'use client';

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, UsersIcon } from '@heroicons/react/24/outline';
import PlayerInputMode from './PlayerInputMode';
import PlayerList from './PlayerList';
import { Player } from '@/lib/players';

interface PlayerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onAddPlayer: (nickname: string, level: number) => void;
  onAddManyPlayers: (players: { nickname: string; level: number }[]) => void;
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (id: string) => void;
  onSelectPlayer: (player: Player) => void;
  onDeselectPlayer: (playerId: string) => void;
  selectedPlayers: Player[];
  isNicknameExists: (nickname: string, excludeId?: string) => boolean;
  onStartInlineEdit?: (player: Player) => void;
  onSaveInlineEdit?: (playerId: string, nickname: string, level: number) => void;
  onCancelInlineEdit?: () => void;
}

export default function PlayerManagementModal({
  isOpen,
  onClose,
  players,
  onAddPlayer,
  onAddManyPlayers,
  onEditPlayer,
  onDeletePlayer,
  onSelectPlayer,
  onDeselectPlayer,
  selectedPlayers,
  isNicknameExists,
  onStartInlineEdit,
  onSaveInlineEdit,
  onCancelInlineEdit,
}: PlayerManagementModalProps) {
  const [localSelectedPlayers, setLocalSelectedPlayers] = useState(selectedPlayers);

  // Sincronizar estado local com props
  useEffect(() => {
    setLocalSelectedPlayers(selectedPlayers);
  }, [selectedPlayers]);

  const handleLocalSelectPlayer = (player: Player) => {
    const newSelected = localSelectedPlayers.filter(p => p.id !== player.id); // Remove se já existe
    const updated = [...newSelected, player];
    setLocalSelectedPlayers(updated);
    onSelectPlayer(player);
  };

  const handleLocalDeselectPlayer = (playerId: string) => {
    const updated = localSelectedPlayers.filter(p => p.id !== playerId);
    setLocalSelectedPlayers(updated);
    onDeselectPlayer(playerId);
  };

  const handleAddPlayer = async (nickname: string, level: number) => {
    await onAddPlayer(nickname, level);
  };

  const handleDeletePlayer = async (id: string) => {
    await onDeletePlayer(id);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-0 shadow-2xl transition-all">
                {/* Header */}
                <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-slate-700 dark:to-slate-600 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <UsersIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <Dialog.Title as="h3" className="text-lg font-semibold text-slate-900 dark:text-white">
                          Gerenciar Jogadores
                        </Dialog.Title>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Adicione, edite ou remova jogadores do sistema
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 py-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Add Players Section */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                            Adicionar Jogadores
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Cadastre novos participantes
                          </p>
                        </div>
                      </div>

                      <PlayerInputMode
                        onSubmit={handleAddPlayer}
                        onBulkSubmit={onAddManyPlayers}
                        isNicknameExists={isNicknameExists}
                      />
                    </div>

                    {/* Players List Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">

                          <div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                              Selecionar Jogadores
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Escolha quem vai jogar
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900 dark:text-white">
                            {players.length}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            cadastrados
                          </div>
                        </div>
                      </div>

                      {localSelectedPlayers.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                              <span className="text-green-600 dark:text-green-400 text-sm">✅</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                                {localSelectedPlayers.length} jogador{localSelectedPlayers.length !== 1 ? 'es' : ''} selecionado{localSelectedPlayers.length !== 1 ? 's' : ''}
                              </p>
                              <p className="text-xs text-green-700 dark:text-green-300">
                                Pronto para sortear times!
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {players.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                          <div className="flex items-center justify-between text-sm mb-3">
                            <span className="text-slate-600 dark:text-slate-400">Progresso da seleção:</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {localSelectedPlayers.length}/{players.length}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(localSelectedPlayers.length / players.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="max-h-80 overflow-y-auto">
                        <PlayerList
                          players={players}
                          onEdit={onStartInlineEdit || (() => { })}
                          onDelete={handleDeletePlayer}
                          selectedPlayers={localSelectedPlayers}
                          onSelectPlayer={handleLocalSelectPlayer}
                          onDeselectPlayer={handleLocalDeselectPlayer}
                          showSelection={true}
                          onSaveEdit={onSaveInlineEdit}
                          onCancelEdit={onCancelInlineEdit}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-700/50 dark:to-slate-600/50 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {localSelectedPlayers.length}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          selecionados
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">
                        {selectedPlayers.length === 0
                          ? "Selecione jogadores para continuar"
                          : selectedPlayers.length === 1
                            ? "1 jogador selecionado para o sorteio"
                            : `${selectedPlayers.length} jogadores selecionados para criar times equilibrados`
                        }
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 border-2 border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-600 hover:bg-white hover:border-slate-400 dark:hover:bg-slate-500 dark:hover:border-slate-400 font-medium rounded-lg transition-all duration-200 hover:shadow-md"
                        onClick={onClose}
                      >
                        Fechar
                      </button>
                      <button
                        type="button"
                        className={`px-6 py-3 font-bold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 ${selectedPlayers.length > 0
                          ? 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30'
                          : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                          }`}
                        onClick={onClose}
                        disabled={selectedPlayers.length === 0}
                      >
                        {selectedPlayers.length > 0 ? (
                          <>
                            🎲 Pronto para Sortear
                            <span className="ml-2 text-sm">({selectedPlayers.length})</span>
                          </>
                        ) : (
                          'Selecione Jogadores'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
