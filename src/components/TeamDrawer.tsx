'use client';

import { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface Player {
  id: string;
  nickname: string;
  level: number;
}

interface TeamDrawerProps {
  players: Player[];
  onDraw: (teams: Player[][]) => void;
}

export default function TeamDrawer({ players, onDraw }: TeamDrawerProps) {
  const [numberOfTeams, setNumberOfTeams] = useState(2);

  const drawTeams = () => {
    if (players.length < numberOfTeams) {
      alert(`Selecione pelo menos ${numberOfTeams} jogadores para sortear!`);
      return;
    }

    // Embaralha os jogadores para randomizar o sorteio
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);

    // Ordena os jogadores por nível (do maior para o menor) para distribuir equilibradamente
    const sortedPlayers = shuffledPlayers.sort((a, b) => b.level - a.level);

    // Inicializa os times
    const teams: Player[][] = Array.from({ length: numberOfTeams }, () => []);

    // Distribui os jogadores alternadamente entre os times
    sortedPlayers.forEach((player, index) => {
      const teamIndex = index % numberOfTeams;
      teams[teamIndex].push(player);
    });

    onDraw(teams);
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
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <ArrowPathIcon className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
        Sortear Times
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="teams" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Número de Times
          </label>
          <select
            id="teams"
            value={numberOfTeams}
            onChange={(e) => setNumberOfTeams(Number(e.target.value))}
            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value={2}>2 Times</option>
            <option value={3}>3 Times</option>
            <option value={4}>4 Times</option>
            <option value={5}>5 Times</option>
          </select>
        </div>

        {/* Resumo dos jogadores selecionados */}
        {players.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Jogadores no Sorteio ({players.length}):
            </h4>
            <div className="flex flex-wrap gap-2">
              {players.map((player) => (
                <span
                  key={player.id}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(player.level)}`}
                >
                  {player.nickname} (Nv.{player.level})
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={drawTeams}
          disabled={players.length < numberOfTeams}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Sortear Times
        </button>
        
        {players.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Selecione jogadores na seção ao lado para começar o sorteio
          </p>
        )}
        
        {players.length > 0 && players.length < numberOfTeams && (
          <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
            Selecione pelo menos {numberOfTeams} jogadores para sortear {numberOfTeams} times
          </p>
        )}
      </div>
    </div>
  );
} 