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

interface BalanceMetrics {
  teamStats: Array<{
    teamIndex: number;
    sum: number;
    avg: number;
    count: number;
  }>;
  maxSum: number;
  minSum: number;
  difference: number;
  isBalanced: boolean;
}

export default function TeamDrawer({ players, onDraw }: TeamDrawerProps) {
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [lastBalanceMetrics, setLastBalanceMetrics] = useState<BalanceMetrics | null>(null);

  const drawTeams = () => {
    if (players.length < numberOfTeams) {
      alert(`Selecione pelo menos ${numberOfTeams} jogadores para sortear!`);
      return;
    }

    // Algoritmo de balanceamento melhorado baseado em soma de níveis
    const balancedTeams = createBalancedTeams(players, numberOfTeams);

    // Calcula métricas de balanceamento
    const metrics = calculateBalanceMetrics(balancedTeams);
    setLastBalanceMetrics(metrics);

    onDraw(balancedTeams);
  };

  // Função para criar times balanceados baseado na soma dos níveis
  const createBalancedTeams = (players: Player[], numberOfTeams: number): Player[][] => {
    // Embaralha os jogadores inicialmente para randomização
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);

    // Ordena por nível (do maior para o menor) para priorizar distribuição de jogadores fortes
    const sortedPlayers = shuffledPlayers.sort((a, b) => b.level - a.level);

    // Inicializa os times vazios
    const teams: Player[][] = Array.from({ length: numberOfTeams }, () => []);

    // Calcula a soma atual de níveis de cada time
    const teamSums = new Array(numberOfTeams).fill(0);

    // Distribui jogadores usando algoritmo greedy para balanceamento
    for (const player of sortedPlayers) {
      // Encontra o time com menor soma atual
      let minSumTeamIndex = 0;
      let minSum = teamSums[0];

      for (let i = 1; i < numberOfTeams; i++) {
        if (teamSums[i] < minSum) {
          minSum = teamSums[i];
          minSumTeamIndex = i;
        }
      }

      // Adiciona o jogador ao time com menor soma
      teams[minSumTeamIndex].push(player);
      teamSums[minSumTeamIndex] += player.level;
    }

    return teams;
  };


  // Função para calcular métricas de balanceamento dos times
  const calculateBalanceMetrics = (teams: Player[][]) => {
    const teamStats = teams.map((team, index) => {
      const sum = team.reduce((acc, player) => acc + player.level, 0);
      const avg = team.length > 0 ? sum / team.length : 0;
      return {
        teamIndex: index + 1,
        sum,
        avg: Math.round(avg * 10) / 10,
        count: team.length
      };
    });

    const sums = teamStats.map(stat => stat.sum);
    const maxSum = Math.max(...sums);
    const minSum = Math.min(...sums);
    const difference = maxSum - minSum;

    return {
      teamStats,
      maxSum,
      minSum,
      difference,
      isBalanced: difference <= 2 // Considera balanceado se diferença máxima for de 2 níveis ou menos
    };
  };



  const getLevelColor = (level: number) => {
    if (level == 1) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (level == 2) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (level == 3) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (level == 4) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (level == 5) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
          <ArrowPathIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Sorteio de Times
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Configure e execute o sorteio equilibrado
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="teams" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Quantidade de Times
          </label>
          <div className="relative">
            <select
              id="teams"
              value={numberOfTeams}
              onChange={(e) => setNumberOfTeams(Number(e.target.value))}
              className="block w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 sm:text-base appearance-none cursor-pointer"
            >
              <option value={2}>2 Times</option>
              <option value={3}>3 Times</option>
              <option value={4}>4 Times</option>
              <option value={5}>5 Times</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Resumo dos jogadores selecionados */}
        {players.length > 0 && (
          <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-600 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Jogadores Selecionados
              </h4>
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded-full">
                {players.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {players.map((player) => (
                <span
                  key={player.id}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getLevelColor(player.level)} shadow-sm`}
                >
                  {player.nickname} (Lv.{player.level})
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={drawTeams}
          disabled={players.length < numberOfTeams}
          className="w-full inline-flex justify-center items-center px-8 py-5 bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 hover:from-primary-700 hover:via-purple-700 hover:to-accent-700 text-white font-bold text-xl rounded-2xl shadow-2xl shadow-primary-500/30 hover:shadow-3xl hover:shadow-primary-500/40 focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center">
            <ArrowPathIcon className="h-7 w-7 mr-3 animate-spin group-hover:animate-pulse" style={{animationDuration: '1.5s'}} />
            <span className="mr-2">🎲</span>
            <span className="font-black">SORTEAR TIMES!</span>
            <span className="ml-2 text-sm font-semibold">({numberOfTeams} times)</span>
          </div>
        </button>

        {/* Métricas de balanceamento do último sorteio */}
        {lastBalanceMetrics && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                📊 Balanceamento dos Times
              </h4>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  lastBalanceMetrics.isBalanced
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {lastBalanceMetrics.isBalanced ? '✓ Equilibrado' : '⚠️ Desequilibrado'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-3">
              {lastBalanceMetrics.teamStats.map((stat) => (
                <div key={stat.teamIndex} className="bg-white dark:bg-slate-700 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                  <div className="text-center">
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Time {stat.teamIndex}
                    </div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {stat.sum}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {stat.count} jogadores
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Ø {stat.avg}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-slate-600 dark:text-slate-400">
              Diferença máxima: <span className="font-semibold text-slate-900 dark:text-white">{lastBalanceMetrics.difference}</span> níveis
            </div>
          </div>
        )}

        {players.length === 0 && (
          <div className="text-center py-6 px-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800">
            <div className="text-amber-600 dark:text-amber-400 mb-2">⚠️</div>
            <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
              Selecione jogadores para começar o sorteio
            </p>
          </div>
        )}

        {players.length > 0 && players.length < numberOfTeams && (
          <div className="text-center py-4 px-4 bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800">
            <div className="text-red-600 dark:text-red-400 mb-2">❌</div>
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">
              Precisa de pelo menos {numberOfTeams} jogadores para {numberOfTeams} times
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Você tem {players.length} jogador{players.length !== 1 ? 'es' : ''} selecionado{players.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 