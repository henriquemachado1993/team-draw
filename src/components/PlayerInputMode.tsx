'use client';

import { useState } from 'react';
import PlayerForm from './PlayerForm';
import BulkPlayerForm from './BulkPlayerForm';

interface PlayerInputModeProps {
  onSubmit: (nickname: string, level: number) => void;
  onBulkSubmit: (players: { nickname: string; level: number }[]) => void;
  isNicknameExists?: (nickname: string, excludeId?: string) => boolean;
}

export default function PlayerInputMode({
  onSubmit,
  onBulkSubmit,
  isNicknameExists
}: PlayerInputModeProps) {
  const [mode, setMode] = useState<'single' | 'bulk'>('bulk');

  const effectiveMode = mode;

  return (
    <div>
      <div className="flex space-x-3 mb-6 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
        <button
          onClick={() => setMode('bulk')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
            mode === 'bulk'
              ? 'bg-white dark:bg-slate-600 text-primary-700 dark:text-primary-300 shadow-lg shadow-primary-500/25'
              : 'bg-slate-50 dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white hover:text-slate-900 dark:hover:bg-slate-500 dark:hover:text-white border border-slate-200 dark:border-slate-500'
          }`}
        >
          ➕ Adicionar Vários
        </button>
        <button
          onClick={() => setMode('single')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
            mode === 'single'
              ? 'bg-white dark:bg-slate-600 text-primary-700 dark:text-primary-300 shadow-lg shadow-primary-500/25'
              : 'bg-slate-50 dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white hover:text-slate-900 dark:hover:bg-slate-500 dark:hover:text-white border border-slate-200 dark:border-slate-500'
          }`}
        >
          👤 Adicionar Um
        </button>
      </div>

      <div className="animate-slide-in">
        {effectiveMode === 'single' ? (
          <PlayerForm
            onSubmit={onSubmit}
            isNicknameExists={isNicknameExists}
          />
        ) : (
          <BulkPlayerForm
            onSubmit={onBulkSubmit}
            isNicknameExists={isNicknameExists}
          />
        )}
      </div>
    </div>
  );
} 