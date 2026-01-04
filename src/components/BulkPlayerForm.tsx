'use client';

import { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Tooltip from './Tooltip';

const getLevelDescription = (level: number) => {
  if (level == 1) return 'Iniciante - Jogador que está começando a jogar';
  if (level == 2) return 'Intermediário - Jogador com experiência básica';
  if (level == 3) return 'Avançado - Jogador com boa experiência';
  if (level == 4) return 'Expert - Jogador muito experiente';
  if (level == 5) return 'Profissional - Jogador de alto nível';
  return `Nível ${level} - Jogador especializado`;
};

interface BulkPlayerFormProps {
  onSubmit: (players: { nickname: string; level: number }[]) => void;
  isNicknameExists?: (nickname: string, excludeId?: string) => boolean;
}

export default function BulkPlayerForm({ onSubmit, isNicknameExists }: BulkPlayerFormProps) {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const validatePlayers = (players: { nickname: string; level: number }[]) => {
    const validationErrors: string[] = [];
    const seenNicknames = new Set<string>();

    // Verificar duplicatas dentro da própria lista
    players.forEach((player, index) => {
      const lowercaseNickname = player.nickname.toLowerCase();
      if (seenNicknames.has(lowercaseNickname)) {
        validationErrors.push(`Linha ${index + 1}: Nickname "${player.nickname}" duplicado na lista`);
      } else {
        seenNicknames.add(lowercaseNickname);
      }

      // Verificar se já existe nos jogadores salvos
      if (isNicknameExists && isNicknameExists(player.nickname)) {
        validationErrors.push(`Linha ${index + 1}: Nickname "${player.nickname}" já existe`);
      }
    });

    return validationErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const playerStrings = input.trim().split(';').map(s => s.trim()).filter(Boolean);
    const parseErrors: string[] = [];

    const players = playerStrings
      .map((playerString, index) => {
        const [nickname, levelStr] = playerString.split(',').map(s => s.trim());
        const level = parseInt(levelStr);

        if (!nickname) {
          parseErrors.push(`Linha ${index + 1}: Nickname está vazio`);
          return null;
        }

        if (!levelStr || isNaN(level) || level < 1 || level > 5) {
          parseErrors.push(`Linha ${index + 1}: Nível inválido para "${nickname}" (deve ser 1-5)`);
          return null;
        }

        return { nickname, level };
      })
      .filter((player): player is { nickname: string; level: number } => player !== null);

    if (parseErrors.length > 0) {
      setErrors(parseErrors);
      return;
    }

    // Validar duplicatas
    const validationErrors = validatePlayers(players);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (players.length > 0) {
      onSubmit(players);
      setInput('');
      setErrors([]);
    }
  };

  // Criar conteúdo do tooltip com os níveis
  const tooltipContent = (
    <div className="text-left max-w-sm">
      <div className="font-semibold mb-2">Níveis Disponíveis:</div>
      <div className="space-y-1">
        {Array.from({ length: 5 }, (_, i) => i + 1).map(level => (
          <div key={level} className="text-xs">
            <span className="font-medium">Nível {level}:</span> {getLevelDescription(level)}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border-2 border-red-200 dark:border-red-800 animate-slide-in">
          <div className="flex items-center mb-3">
            <span className="text-red-500 mr-2">⚠️</span>
            <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">
              {errors.length} erro{errors.length > 1 ? 's' : ''} encontrado{errors.length > 1 ? 's' : ''}
            </h4>
          </div>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700 dark:text-red-300 flex items-start">
                <span className="text-red-500 mr-2 mt-1.5">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center">
            <label htmlFor="bulk-input" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Lista de Jogadores
            </label>
            <Tooltip content={tooltipContent} position="bottom">
              <InformationCircleIcon className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 ml-2 cursor-help transition-colors" />
            </Tooltip>
          </div>

          <div className="relative">
            <textarea
              id="bulk-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`João,5
Maria,8
Pedro,12
Ana,3`}
              className={`block w-full h-48 px-4 py-3 rounded-xl border-2 shadow-sm focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 sm:text-base font-mono text-sm resize-none ${errors.length > 0
                  ? 'border-red-300 dark:border-red-600 focus:border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-200'
                  : 'border-slate-200 dark:border-slate-600 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500'
                }`}
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-700 px-2 py-1 rounded-md border">
              {input.split(';').filter(s => s.trim()).length} jogadores
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center">

              Formato esperado:
            </h5>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <div><code className="bg-white dark:bg-slate-600 px-2 py-1 rounded text-xs">jogador1,5;jogador2,8;jogador3,12</code></div>
              <div className="text-xs mt-2">
                • Use <strong>vírgula (,)</strong> para separar nome do nível<br />
                • Use <strong>ponto e vírgula (;)</strong> para separar jogadores<br />
                • Níveis de 1 a 5 são aceitos
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!input.trim()}
          className="w-full inline-flex justify-center items-center px-6 py-4 bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white font-semibold rounded-xl shadow-lg shadow-accent-500/25 hover:shadow-xl hover:shadow-accent-500/30 focus:outline-none focus:ring-4 focus:ring-accent-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] border-2 border-accent-500/30 hover:border-accent-400"
        >
          <span className="mr-2">🚀</span>
          Adicionar {input.split(';').filter(s => s.trim()).length || ''} Jogador{input.split(';').filter(s => s.trim()).length !== 1 ? 'es' : ''}
        </button>
      </form>
    </div>
  );
} 