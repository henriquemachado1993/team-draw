'use client';

import { useState, useEffect } from 'react';

interface Player {
  id: string;
  nickname: string;
  level: number;
}

interface PlayerFormProps {
  onSubmit: (nickname: string, level: number) => void;
  editingPlayer?: Player | null;
  onCancelEdit?: () => void;
  isNicknameExists?: (nickname: string, excludeId?: string) => boolean;
}

export default function PlayerForm({ 
  onSubmit, 
  editingPlayer, 
  onCancelEdit,
  isNicknameExists 
}: PlayerFormProps) {
  const [nickname, setNickname] = useState('');
  const [level, setLevel] = useState(1);
  const [nicknameError, setNicknameError] = useState('');

  // Atualizar formulário quando editingPlayer mudar
  useEffect(() => {
    if (editingPlayer) {
      setNickname(editingPlayer.nickname);
      setLevel(editingPlayer.level);
    } else {
      setNickname('');
      setLevel(1);
    }
    setNicknameError('');
  }, [editingPlayer]);

  // Validar nickname em tempo real
  const validateNickname = (value: string) => {
    if (!value.trim()) {
      setNicknameError('');
      return;
    }

    if (isNicknameExists && isNicknameExists(value.trim(), editingPlayer?.id)) {
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
    if (!editingPlayer) {
      setNickname('');
      setLevel(1);
      setNicknameError('');
    }
  };

  const handleCancel = () => {
    setNickname('');
    setLevel(1);
    setNicknameError('');
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nickname
        </label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={handleNicknameChange}
          className={`block w-full rounded-lg border shadow-sm focus:ring-indigo-500 sm:text-base ${
            nicknameError 
              ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500'
          } dark:bg-gray-700 dark:text-white`}
          required
        />
        {nicknameError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {nicknameError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nível
        </label>
        <select
          id="level"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
        >
          <option value={1}>Iniciante</option>
          <option value={2}>Intermediário</option>
          <option value={3}>Avançado</option>
          <option value={4}>Expert</option>
          <option value={5}>Profissional</option>
        </select>
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={!!nicknameError || !nickname.trim()}
          className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
        >
          {editingPlayer ? 'Atualizar Jogador' : 'Adicionar Jogador'}
        </button>
        
        {editingPlayer && onCancelEdit && (
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
} 