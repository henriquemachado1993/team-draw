'use client';

import { XMarkIcon, UserGroupIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Player } from '@/lib/players';

interface PlayerSelectionProps {
  selectedPlayers: Player[];
  onDeselectPlayer: (playerId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  totalPlayers: number;
}

export default function PlayerSelection({
  selectedPlayers,
  onDeselectPlayer,
  onSelectAll,
  onClearSelection,
  totalPlayers,
}: PlayerSelectionProps) {
  const getLevelLabel = (level: number) => {
    const levels = {
      1: 'Potinha',
      2: 'Intermediário',
      3: 'Avançado',
      4: 'Expert',
      5: 'Profissional'
    };
    return levels[level as keyof typeof levels];
  };

  const getLevelColor = (level: number) => {
    const colors = {
      1: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      2: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      4: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      5: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[level as keyof typeof colors];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <UserGroupIcon className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
          Jogadores para Sorteio
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {selectedPlayers.length} selecionados
        </span>
      </div>

      {/* Botões de controle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={onSelectAll}
          disabled={selectedPlayers.length === totalPlayers || totalPlayers === 0}
          className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <CheckIcon className="h-4 w-4 mr-1" />
          Selecionar Todos
        </button>
        <button
          onClick={onClearSelection}
          disabled={selectedPlayers.length === 0}
          className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <XMarkIcon className="h-4 w-4 mr-1" />
          Limpar
        </button>
      </div>

      {/* Lista de jogadores selecionados */}
      {selectedPlayers.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {selectedPlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {player.nickname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {player.nickname}
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(player.level)}`}>
                    Nv.{player.level} - {getLevelLabel(player.level)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onDeselectPlayer(player.id)}
                className="flex-shrink-0 p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                title="Remover do sorteio"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Nenhum jogador selecionado
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Selecione jogadores da lista ao lado para adicionar ao sorteio.
          </p>
        </div>
      )}

      {/* Resumo dos níveis selecionados */}
      {selectedPlayers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Distribuição por Nível:
          </h4>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((level) => {
              const count = selectedPlayers.filter(p => p.level === level).length;
              if (count === 0) return null;
              return (
                <span
                  key={level}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(level)}`}
                >
                  Nv.{level}: {count}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 