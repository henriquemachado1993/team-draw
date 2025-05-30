'use client';

import { useState } from 'react';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Player {
  id: string;
  nickname: string;
  level: number;
}

interface PlayerListProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
  selectedPlayers?: Player[];
  onSelectPlayer?: (player: Player) => void;
  showSelection?: boolean;
}

export default function PlayerList({ 
  players, 
  onEdit, 
  onDelete, 
  selectedPlayers = [], 
  onSelectPlayer,
  showSelection = false 
}: PlayerListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNickname, setEditNickname] = useState('');
  const [editLevel, setEditLevel] = useState(1);

  const getLevelLabel = (level: number) => {
    const levels = {
      1: 'Iniciante',
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

  const isPlayerSelected = (playerId: string) => {
    return selectedPlayers.some(player => player.id === playerId);
  };

  const startEditing = (player: Player) => {
    setEditingId(player.id);
    setEditNickname(player.nickname);
    setEditLevel(player.level);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = (player: Player) => {
    onEdit({
      ...player,
      nickname: editNickname,
      level: editLevel
    });
    setEditingId(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Todos os Jogadores ({players.length})
      </h2>
      
      {players.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum jogador cadastrado ainda.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {showSelection && (
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                    Selecionar
                  </th>
                )}
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                  Nickname
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Nível
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
              {players.map((player) => {
                const isSelected = isPlayerSelected(player.id);
                return (
                  <tr 
                    key={player.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      isSelected && showSelection ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                    }`}
                  >
                    {showSelection && (
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <button
                          onClick={() => onSelectPlayer?.(player)}
                          disabled={isSelected}
                          className={`p-2 rounded-full transition-colors ${
                            isSelected
                              ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400 cursor-default'
                              : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-indigo-900 dark:hover:text-indigo-400'
                          }`}
                          title={isSelected ? 'Já selecionado' : 'Adicionar ao sorteio'}
                        >
                          {isSelected ? (
                            <CheckIcon className="h-4 w-4" />
                          ) : (
                            <PlusIcon className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    )}
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                      {editingId === player.id ? (
                        <input
                          type="text"
                          value={editNickname}
                          onChange={(e) => setEditNickname(e.target.value)}
                          className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <div className="flex items-center">
                          <span>{player.nickname}</span>
                          {isSelected && showSelection && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                              Selecionado
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {editingId === player.id ? (
                        <select
                          value={editLevel}
                          onChange={(e) => setEditLevel(Number(e.target.value))}
                          className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value={1}>Iniciante</option>
                          <option value={2}>Intermediário</option>
                          <option value={3}>Avançado</option>
                          <option value={4}>Expert</option>
                          <option value={5}>Profissional</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(player.level)}`}>
                          Nv.{player.level} - {getLevelLabel(player.level)}
                        </span>
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      {editingId === player.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => saveEdit(player)}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => startEditing(player)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => onDelete(player.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 