'use client';

import { useState, useEffect } from 'react';

interface Player {
  id: string;
  nickname: string;
  level: number;
}

interface PlayerFormProps {
  onSubmit: (nickname: string, level: number) => void;
  isNicknameExists?: (nickname: string, excludeId?: string) => boolean;
}

export default function PlayerForm({
  onSubmit,
  isNicknameExists
}: PlayerFormProps) {
  const [nickname, setNickname] = useState('');
  const [level, setLevel] = useState(1);
  const [nicknameError, setNicknameError] = useState('');

  // Validar nickname em tempo real
  const validateNickname = (value: string) => {
    if (!value.trim()) {
      setNicknameError('');
      return;
    }

    if (isNicknameExists && isNicknameExists(value.trim())) {
      setNicknameError('Este nickname já está em uso');
    } else {
      setNicknameError('');
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    validateNickname(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setNicknameError('Nickname é obrigatório');
      return;
    }

    if (nicknameError) {
      return; // Não enviar se há erro de validação
    }

    onSubmit(trimmedNickname, level);
    setNickname('');
    setLevel(1);
    setNicknameError('');
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="nickname" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Nickname do Jogador
        </label>
        <div className="relative">
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="Digite o nickname..."
            className={`block w-full px-4 py-3 rounded-xl border-2 shadow-sm focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 sm:text-base ${
              nicknameError
                ? 'border-red-300 dark:border-red-600 focus:border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200'
                : 'border-slate-200 dark:border-slate-600 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500'
            }`}
            required
          />
          {nickname.trim() && !nicknameError && (
            <div className="absolute right-3 top-3 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>
        {nicknameError && (
          <p className="flex items-center text-sm text-red-600 dark:text-red-400 font-medium">
            <span className="mr-1">⚠️</span>
            {nicknameError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="level" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Nível de Habilidade
        </label>
        <div className="relative">
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="block w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 sm:text-base appearance-none cursor-pointer"
          >
            {Array.from({ length: 5 }, (_, i) => i + 1).map(levelNum => {
              const getLevelLabel = (level: number) => {
                if (level == 1) return 'Potinha';
                if (level == 2) return 'Intermediário';
                if (level == 3 ) return 'Avançado';
                if (level == 4) return 'Expert';
                if (level == 5 ) return 'Profissional';
                return 'Nível ' + level;
              };
              return (
                <option key={levelNum} value={levelNum}>
                  {levelNum} - {getLevelLabel(levelNum)}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          type="submit"
          disabled={!!nicknameError || !nickname.trim()}
          className="flex-1 inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] border-2 border-primary-500/30 hover:border-primary-400"
        >
          <span className="mr-2">➕</span>
          Adicionar Jogador
        </button>
      </div>
    </form>
  );
} 