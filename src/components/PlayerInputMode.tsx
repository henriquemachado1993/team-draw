'use client';

import { useState } from 'react';
import PlayerForm from './PlayerForm';
import BulkPlayerForm from './BulkPlayerForm';

interface Player {
  id: string;
  nickname: string;
  level: number;
}

interface PlayerInputModeProps {
  onSubmit: (nickname: string, level: number) => void;
  onBulkSubmit: (players: { nickname: string; level: number }[]) => void;
  editingPlayer?: Player | null;
  onCancelEdit?: () => void;
  isNicknameExists?: (nickname: string, excludeId?: string) => boolean;
}

export default function PlayerInputMode({ 
  onSubmit, 
  onBulkSubmit, 
  editingPlayer, 
  onCancelEdit,
  isNicknameExists 
}: PlayerInputModeProps) {
  const [mode, setMode] = useState<'single' | 'bulk'>('bulk');

  // Se está editando um jogador, forçar modo single
  const effectiveMode = editingPlayer ? 'single' : mode;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {!editingPlayer && (
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setMode('bulk')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'bulk'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Adicionar Vários Jogadores
          </button>
          <button
            onClick={() => setMode('single')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'single'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Adicionar Jogador
          </button>
        </div>
      )}

      {editingPlayer && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Editando jogador: <strong>{editingPlayer.nickname}</strong>
          </p>
        </div>
      )}

      {effectiveMode === 'single' ? (
        <PlayerForm 
          onSubmit={onSubmit} 
          editingPlayer={editingPlayer}
          onCancelEdit={onCancelEdit}
          isNicknameExists={isNicknameExists}
        />
      ) : (
        <BulkPlayerForm 
          onSubmit={onBulkSubmit}
          isNicknameExists={isNicknameExists}
        />
      )}
    </div>
  );
} 