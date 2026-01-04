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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
            <UserGroupIcon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Time do Sorteio
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Jogadores selecionados para o sorteio
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
            {selectedPlayers.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            selecionado{selectedPlayers.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Botões de controle */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={onSelectAll}
          disabled={selectedPlayers.length === totalPlayers || totalPlayers === 0}
          className="flex-1 inline-flex justify-center items-center px-4 py-3 bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white font-semibold rounded-xl shadow-lg shadow-success-500/25 hover:shadow-xl hover:shadow-success-500/30 focus:outline-none focus:ring-4 focus:ring-success-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <CheckIcon className="h-5 w-5 mr-2" />
          Todos ({totalPlayers})
        </button>
        <button
          onClick={onClearSelection}
          disabled={selectedPlayers.length === 0}
          className="px-4 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 font-semibold rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <XMarkIcon className="h-5 w-5 mr-2" />
          Limpar
        </button>
      </div>

      {/* Lista de jogadores selecionados */}
      {selectedPlayers.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {selectedPlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-600 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">
                      {player.nickname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {player.nickname}
                  </p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(player.level)} shadow-sm`}>
                    ⭐ Nv.{player.level} - {getLevelLabel(player.level)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onDeselectPlayer(player.id)}
                className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 transform hover:scale-110"
                title="Remover do sorteio"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserGroupIcon className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Nenhum jogador selecionado
          </h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            Selecione jogadores da lista ao lado para formar seu time perfeito
          </p>
        </div>
      )}

      {/* Resumo dos níveis selecionados */}
      {selectedPlayers.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-600">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Distribuição por Nível
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5].map((level) => {
              const count = selectedPlayers.filter(p => p.level === level).length;
              if (count === 0) return null;
              return (
                <div
                  key={level}
                  className={`flex items-center justify-between p-3 rounded-lg ${getLevelColor(level)} shadow-sm`}
                >
                  <span className="text-sm font-medium">
                    Nv.{level}
                  </span>
                  <span className="text-lg font-bold">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 