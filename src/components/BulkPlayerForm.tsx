'use client';

import { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Tooltip from './Tooltip';

const LEVEL_DESCRIPTIONS = {
  1: 'Iniciante - Jogador que está começando a jogar',
  2: 'Intermediário - Jogador com experiência básica',
  3: 'Avançado - Jogador com boa experiência',
  4: 'Expert - Jogador muito experiente',
  5: 'Profissional - Jogador de alto nível'
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
        {Object.entries(LEVEL_DESCRIPTIONS).map(([level, description]) => (
          <div key={level} className="text-xs">
            <span className="font-medium">Nível {level}:</span> {description}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Erros encontrados:</h4>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700 dark:text-red-300">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center mb-2">
            <label htmlFor="bulk-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Adicione os jogadores (formato: jogador1,nivel;jogador2,nivel)
            </label>
            <Tooltip content={tooltipContent} position="bottom">
              <InformationCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 ml-2 cursor-help" />
            </Tooltip>
          </div>
          <textarea
            id="bulk-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="jogador1,1;jogador2,2;jogador3,3"
            className={`block w-full h-48 rounded-lg border shadow-sm focus:ring-indigo-500 sm:text-base ${
              errors.length > 0 
                ? 'border-red-300 dark:border-red-600 focus:border-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500'
            } dark:bg-gray-700 dark:text-white`}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Separe cada jogador com ponto e vírgula (;) e use vírgula (,) para separar nome do nível
          </p>
        </div>
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
        >
          Adicionar Jogadores
        </button>
      </form>
    </div>
  );
} 