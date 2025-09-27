'use client';

import { useState } from 'react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface Player {
  id: string;
  nickname: string;
  level: number;
}

interface TeamDisplayProps {
  teams: Player[][];
}

export default function TeamDisplay({ teams }: TeamDisplayProps) {
  const [copied, setCopied] = useState(false);

  const getLevelLabel = (level: number) => {
    if (level >= 1 && level <= 5) return 'Potinha';
    if (level >= 6 && level <= 10) return 'Intermediário';
    if (level >= 11 && level <= 15) return 'Avançado';
    if (level >= 16 && level <= 18) return 'Expert';
    if (level >= 19 && level <= 20) return 'Profissional';
    return 'Nível ' + level;
  };

  const calculateTeamLevel = (team: Player[]) => {
    const totalLevel = team.reduce((sum, player) => sum + player.level, 0);
    return (totalLevel / team.length).toFixed(1);
  };

  const formatTeamForDiscord = (team: Player[], teamNumber: number) => {
    const players = team.map(player => `${player.nickname} (${getLevelLabel(player.level)})`).join('\n');
    return `**Time ${teamNumber}**\n${players}\n**Nível Médio: ${calculateTeamLevel(team)}**`;
  };

  const copyTeamsToClipboard = () => {
    const text = teams.map((team, index) => formatTeamForDiscord(team, index + 1)).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Times Sorteados</h2>
        <button
          onClick={copyTeamsToClipboard}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
          {copied ? 'Copiado!' : 'Copiar Times'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Time {index + 1}
            </h3>
            <ul className="space-y-2">
              {team.map((player) => (
                <li
                  key={player.id}
                  className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300"
                >
                  <span>{player.nickname}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {getLevelLabel(player.level)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Nível Médio: {calculateTeamLevel(team)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 