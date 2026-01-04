'use client';

import { useState } from 'react';
import { ClipboardDocumentIcon, TrophyIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import Tooltip from './Tooltip';

interface Player {
  id: string;
  nickname: string;
  level: number;
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

interface TeamDisplayProps {
  teams: Player[][];
  balanceMetrics?: BalanceMetrics | null;
}

export default function TeamDisplay({ teams, balanceMetrics }: TeamDisplayProps) {
  const [copied, setCopied] = useState(false);

  const getLevelLabel = (level: number) => {
    if (level == 1) return 'Potinha';
    if (level == 2) return 'Intermediário';
    if (level == 3) return 'Avançado';
    if (level == 4) return 'Expert';
    if (level == 5) return 'Profissional';
    return 'Nível ' + level;
  };


  const getLevelColor = (level: number) => {
    const colors = {
      1: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      2: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      4: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      5: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const calculateTeamLevel = (team: Player[]) => {
    const totalLevel = team.reduce((sum, player) => sum + player.level, 0);
    return (totalLevel / team.length).toFixed(1);
  };

  const formatTeamForDiscord = (team: Player[], teamNumber: number) => {
    const players = team.map(player => `${player.nickname} (${getLevelLabel(player.level)})`).join('\n');
    return `**Time ${teamNumber}**\n${players}\n**Nível Médio: ${calculateTeamLevel(team)}**`;
  };

  const formatStatsForDiscord = () => {
    const totalPlayers = teams.reduce((sum, team) => sum + team.length, 0);
    const avgLevel = (teams.map(team => parseFloat(calculateTeamLevel(team))).reduce((a, b) => a + b, 0) / teams.length).toFixed(1);
    const maxDiff = (Math.max(...teams.map(team => parseFloat(calculateTeamLevel(team)))) - Math.min(...teams.map(team => parseFloat(calculateTeamLevel(team))))).toFixed(2);

    let balanceStatus = 'Desconhecido';
    if (balanceMetrics) {
      balanceStatus = balanceMetrics.isBalanced ? 'Equilibrado' : 'Desequilibrado';
    }

    return `\n\n📊 **ESTATÍSTICAS**\n` +
           `• Times criados: ${teams.length}\n` +
           `• Total de jogadores: ${totalPlayers}\n` +
           `• Média geral: ${avgLevel}\n` +
           `• Diferença máxima: ${maxDiff}\n` +
           `• Status: ${balanceStatus}`;
  };

  const copyTeamsToClipboard = () => {
    const teamsText = teams.map((team, index) => formatTeamForDiscord(team, index + 1)).join('\n\n');
    const statsText = formatStatsForDiscord();
    const fullText = teamsText + statsText;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const teamColors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600',
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl shadow-card-hover border border-green-200 dark:border-slate-600 p-6 animate-scale-in relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full -translate-y-12 translate-x-12"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-yellow-400/20 to-green-400/20 rounded-full translate-y-8 -translate-x-8"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-lg animate-bounce">
              <TrophyIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                🎉 Times Sorteados!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Times equilibrados criados automaticamente
              </p>
            </div>
          </div>
          <button
            onClick={copyTeamsToClipboard}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white font-semibold rounded-xl shadow-lg shadow-accent-500/25 hover:shadow-xl hover:shadow-accent-500/30 focus:outline-none focus:ring-4 focus:ring-accent-500/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-accent-500/30 hover:border-accent-400"
          >
            <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
            {copied ? '✅ Copiado!' : 'Copiar Times'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {teams.map((team, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-700 dark:to-slate-600 rounded-lg p-4 border border-slate-200 dark:border-slate-600 shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className={`bg-gradient-to-r ${teamColors[index % teamColors.length]} rounded-md p-3 mb-3 shadow-md`}>
                <h3 className="text-lg font-bold text-white text-center">
                  Time {index + 1}
                </h3>
              </div>

              <ul className="space-y-2 mb-4">
                {team.map((player) => (
                  <li
                    key={player.id}
                    className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-600 rounded-lg border border-slate-200 dark:border-slate-500"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {player.nickname}
                    </span>


                    <span
                      key={player.id}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getLevelColor(player.level)} shadow-sm`}
                    >
                      {getLevelLabel(player.level)}
                    </span>

                  </li>
                ))}
              </ul>

              <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Nível Médio
                  </span>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {calculateTeamLevel(team)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estatísticas gerais */}
        <div className="mt-6 bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-600 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center">
              
              Estatísticas
            </h3>
            {balanceMetrics && (
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${balanceMetrics.isBalanced
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                {balanceMetrics.isBalanced ? '✓ Equilibrado' : '⚠️ Desequilibrado'}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {teams.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Times Criados
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                {teams.reduce((sum, team) => sum + team.length, 0)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Jogadores
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                {teams.map(team => parseFloat(calculateTeamLevel(team))).reduce((a, b) => a + b, 0) / teams.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Média Geral
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {(Math.max(...teams.map(team => parseFloat(calculateTeamLevel(team)))) - Math.min(...teams.map(team => parseFloat(calculateTeamLevel(team))))).toFixed(2)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1">
                <span>Diferença Máx</span>
                <Tooltip content={
                  <div className="text-left">
                    <div className="font-semibold mb-2">O que significa:</div>
                    <div className="space-y-1">
                      <div><strong>0.0:</strong> Times perfeitamente equilibrados</div>
                      <div><strong>0.1-0.5:</strong> Equilíbrio muito bom</div>
                      <div><strong>0.6-1.0:</strong> Equilíbrio razoável</div>
                      <div><strong>&gt;1.0:</strong> Times significativamente desequilibrados</div>
                    </div>
                  </div>
                }>
                  <InformationCircleIcon className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-help" />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 