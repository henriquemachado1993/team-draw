'use client';

import { useState, useMemo } from 'react';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
  onDeselectPlayer?: (playerId: string) => void;
  showSelection?: boolean;
  onSaveEdit?: (playerId: string, nickname: string, level: number) => void;
  onCancelEdit?: () => void;
}

export default function PlayerList({
  players,
  onDelete,
  selectedPlayers = [],
  onSelectPlayer,
  onDeselectPlayer,
  showSelection = false,
  onSaveEdit,
  onCancelEdit
}: PlayerListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNickname, setEditNickname] = useState('');
  const [editLevel, setEditLevel] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar jogadores baseado no termo de busca
  const filteredPlayers = useMemo(() => {
    if (!searchTerm.trim()) return players;
    return players.filter(player =>
      player.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [players, searchTerm]);

  const getLevelLabel = (level: number) => {
    if (level == 1) return 'Potinha';
    if (level == 2) return 'Intermediário';
    if (level == 3) return 'Avançado';
    if (level == 4) return 'Expert';
    if (level == 5) return 'Profissional';
    return 'Nível ' + level;
  };

  const getLevelColor = (level: number) => {
    if (level == 1) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (level == 2) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (level == 3) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (level == 4) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (level == 5) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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
    if (onCancelEdit) {
      onCancelEdit();
    }
    setEditingId(null);
  };

  const saveEdit = (player: Player) => {
    if (onSaveEdit) {
      onSaveEdit(player.id, editNickname, editLevel);
    }
    setEditingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Lista de Jogadores
        </h2>
        <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
          {filteredPlayers.length}{searchTerm ? `/${players.length}` : ''} jogador{filteredPlayers.length !== 1 ? 'es' : ''}{searchTerm ? ' filtrado' + (filteredPlayers.length !== 1 ? 's' : '') : ''}
        </div>
      </div>

      {/* Campo de busca */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar jogadores por nome..."
            className="block w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 sm:text-base placeholder-slate-400 dark:placeholder-slate-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              title="Limpar busca"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlassIcon className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {players.length === 0 ? 'Nenhum jogador cadastrado ainda' : searchTerm ? `Nenhum jogador encontrado para "${searchTerm}"` : 'Nenhum jogador disponível'}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            {players.length === 0 ? 'Adicione jogadores para começar' : searchTerm ? 'Tente ajustar o termo de busca' : 'Verifique os filtros aplicados'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden shadow-card-hover ring-1 ring-slate-200 dark:ring-slate-700 sm:rounded-xl">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {showSelection && (
                  <th scope="col" className="py-4 pl-6 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Selecionar
                  </th>
                )}
                <th scope="col" className="py-4 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Jogador
                </th>
                <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Nível
                </th>
                <th scope="col" className="relative py-4 pl-3 pr-6">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
              {filteredPlayers.map((player) => {
                const isSelected = isPlayerSelected(player.id);
                return (
                  <tr
                    key={player.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 ${isSelected && showSelection ? 'bg-primary-50 dark:bg-primary-900/10 border-l-4 border-l-primary-500' : ''
                      }`}
                  >
                    {showSelection && (
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
                        <button
                          onClick={() => {
                            if (isSelected) {
                              onDeselectPlayer?.(player.id);
                            } else {
                              onSelectPlayer?.(player);
                            }
                          }}
                          className={`p-2.5 rounded-xl transition-all duration-200 transform hover:scale-105 border-2 ${isSelected
                              ? 'bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:border-primary-700 shadow-lg hover:bg-red-100 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900 dark:hover:text-red-400 dark:hover:border-red-700'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-primary-100 hover:text-primary-600 hover:border-primary-300 dark:bg-slate-600 dark:text-slate-300 dark:border-slate-500 dark:hover:bg-primary-900 dark:hover:text-primary-400 dark:hover:border-primary-600'
                            }`}
                          title={isSelected ? 'Remover do sorteio' : 'Adicionar ao sorteio'}
                        >
                          {isSelected ? (
                            <CheckIcon className="h-4 w-4" />
                          ) : (
                            <PlusIcon className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    )}
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white">
                      {editingId === player.id ? (
                        <input
                          type="text"
                          value={editNickname}
                          onChange={(e) => setEditNickname(e.target.value)}
                          className="block w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 sm:text-sm"
                        />
                      ) : (
                        <div className="flex items-center">
                          <span className="font-semibold">{player.nickname}</span>
                          {isSelected && showSelection && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                              🎯 Selecionado
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">
                      {editingId === player.id ? (
                        <select
                          value={editLevel}
                          onChange={(e) => setEditLevel(Number(e.target.value))}
                          className="block w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 sm:text-sm"
                        >
                          {Array.from({ length: 5 }, (_, i) => i + 1).map(level => (
                            <option key={level} value={level}>
                              {level} - {getLevelLabel(level)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getLevelColor(player.level)} shadow-sm`}>
                          {player.level} - {getLevelLabel(player.level)}
                        </span>
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                      {editingId === player.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => saveEdit(player)}
                            className="p-2 text-green-600 dark:text-green-300 hover:text-green-700 dark:hover:text-green-200 hover:bg-green-50 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-600 rounded-lg transition-all duration-200 transform hover:scale-105 bg-white dark:bg-slate-700"
                            title="Salvar alterações"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-2 text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-600 rounded-lg transition-all duration-200 transform hover:scale-105 bg-white dark:bg-slate-700"
                            title="Cancelar edição"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => startEditing(player)}
                            className="p-2 text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900/30 border border-primary-200 dark:border-primary-600 rounded-lg transition-all duration-200 transform hover:scale-105 bg-white dark:bg-slate-700"
                            title="Editar jogador"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => onDelete(player.id)}
                            className="p-2 text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-600 rounded-lg transition-all duration-200 transform hover:scale-105 bg-white dark:bg-slate-700"
                            title="Remover jogador"
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