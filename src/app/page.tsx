'use client';

import { useState, useEffect, useCallback } from 'react';
import { Cog6ToothIcon, SparklesIcon, TrophyIcon, UsersIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import {
  TeamDrawer,
  TeamDisplay,
  ThemeToggle,
  PlayerManagementModal,
  OnboardingWizard
} from '@/components';
import { usePlayers } from '@/hooks/usePlayers';
import { Player } from '@/lib/players';

export default function Home() {
  const {
    players,
    loading,
    error,
    addPlayer,
    addManyPlayers,
    updatePlayer,
    deletePlayer,
    isNicknameExists,
  } = usePlayers();

  const [drawnTeams, setDrawnTeams] = useState<Player[][]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedPlayersForDraw, setSelectedPlayersForDraw] = useState<Player[]>([]);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);

  // Remover jogadores deletados da seleção
  useEffect(() => {
    setSelectedPlayersForDraw(prev =>
      prev.filter(selectedPlayer =>
        players.some(player => player.id === selectedPlayer.id)
      )
    );
  }, [players]);

  // Auto-selecionar todos os jogadores quando nenhum time foi sorteado ainda
  useEffect(() => {
    if (players.length > 0 && drawnTeams.length === 0 && selectedPlayersForDraw.length === 0) {
      setSelectedPlayersForDraw([...players]);
    }
  }, [players, drawnTeams.length, selectedPlayersForDraw.length]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddPlayer = async (nickname: string, level: number) => {
    const success = await addPlayer(nickname, level);
    if (success) {
      showNotification('Jogador adicionado com sucesso!', 'success');
    } else {
      showNotification(error || 'Erro ao adicionar jogador', 'error');
    }
  };

  const handleBulkAddPlayers = async (newPlayers: { nickname: string; level: number }[]) => {
    const success = await addManyPlayers(newPlayers);
    if (success) {
      showNotification(`${newPlayers.length} jogadores adicionados com sucesso!`, 'success');
    } else {
      showNotification(error || 'Erro ao adicionar jogadores', 'error');
    }
  };

  const handleEditPlayer = async (player: Player) => {
    const success = await updatePlayer(player.id, player.nickname, player.level);
    if (success) {
      showNotification('Jogador atualizado com sucesso!', 'success');
    } else {
      showNotification(error || 'Erro ao atualizar jogador', 'error');
    }
  };

  const handleDeletePlayer = async (id: string) => {
    const success = await deletePlayer(id);
    if (success) {
      showNotification('Jogador removido com sucesso!', 'success');
    } else {
      showNotification(error || 'Erro ao remover jogador', 'error');
    }
  };

  const handleDrawTeams = async (teams: Player[][]) => {
    setDrawnTeams(teams);
    showNotification(`Times sorteados com sucesso! ${teams.length} times criados.`, 'success');
  };

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayersForDraw(prev => {
      // Criar uma nova referência para forçar re-render
      const newSelected = prev.filter(p => p.id !== player.id); // Remove se já existe
      return [...newSelected, player]; // Adiciona no final
    });
  };

  const handleDeselectPlayer = (playerId: string) => {
    setSelectedPlayersForDraw(prev => prev.filter(p => p.id !== playerId));
  };

  const handleStartInlineEdit = (player: Player) => {
    // Esta função pode ser usada para qualquer lógica adicional ao iniciar edição
    console.log('Iniciando edição inline de:', player.nickname);
  };

  const handleSaveInlineEdit = async (playerId: string, nickname: string, level: number) => {
    const success = await updatePlayer(playerId, nickname, level);
    if (success) {
      showNotification('Jogador atualizado com sucesso!', 'success');
      // Atualizar também na lista de selecionados se necessário
      setSelectedPlayersForDraw(prev =>
        prev.map(p => p.id === playerId ? { ...p, nickname, level } : p)
      );
    } else {
      showNotification('Erro ao atualizar jogador', 'error');
    }
  };

  const handleCancelInlineEdit = () => {
    // Esta função pode ser usada para qualquer lógica adicional ao cancelar edição
    console.log('Edição inline cancelada');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">


      {/* Notificação moderna */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[60] p-4 rounded-xl shadow-2xl animate-slide-in border-2 backdrop-blur-sm ${notification.type === 'success'
            ? 'bg-success-500/95 text-white shadow-success-500/50 border-success-400/50'
            : 'bg-red-500/95 text-white shadow-red-500/50 border-red-400/50'
          }`}>
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-5 w-5" />
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Compacto */}
        <div className="flex items-center justify-between mb-4 animate-slide-in">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg shadow-glow animate-bounce-subtle">
              <TrophyIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Sorteador de Times
              </h1>
              <p className="text-white text-xs text-slate-600 dark:text-slate-300 hidden sm:block">
                Times equilibrados automaticamente
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Status compacto */}
            {loading && (
              <div className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                <div className="animate-spin rounded-full h-3 w-3 border border-primary-600 border-t-transparent mr-1"></div>
                Carregando...
              </div>
            )}

            {error && !loading && (
              <div className="inline-flex items-center px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                ⚠️ Local
              </div>
            )}

            {/* Botão de gerenciamento compacto */}
            <button
              onClick={() => setIsPlayerModalOpen(true)}
              className={`inline-flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md text-xs ${players.length === 0
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 animate-pulse'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
            >
              <UsersIcon className="h-3 w-3 mr-1" />


              {players.length === 0 ? 'Adicionar Jogadores' : `Gerenciar Jogadores (${players.length})`}
            </button>
          </div>
        </div>

        {/* Onboarding Wizard - Aparece quando apropriado */}
        {(!loading && players.length === 0) || (players.length > 0 && selectedPlayersForDraw.length === 0) || (selectedPlayersForDraw.length > 0 && drawnTeams.length === 0) ? (
          <div className="mb-6">
            <OnboardingWizard
              playersCount={players.length}
              selectedPlayersCount={selectedPlayersForDraw.length}
              hasDrawnTeams={drawnTeams.length > 0}
              onOpenPlayerModal={() => setIsPlayerModalOpen(true)}
            />
          </div>
        ) : null}

        {/* Times Sorteados - Elemento Principal */}
        {drawnTeams.length > 0 && (
          <div className="mb-6 animate-fade-in-up">
            <TeamDisplay teams={drawnTeams} />
          </div>
        )}

        {/* Área Central - Sorteio */}
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Card Principal de Sorteio */}
          {selectedPlayersForDraw.length > 0 ? (
            <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl shadow-card-hover border border-green-200 dark:border-slate-600 p-6 animate-scale-in relative overflow-hidden">
              {/* Elementos decorativos de fundo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10">
                <div className="text-center mb-6">


                  <div className="inline-flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Tudo pronto!
                  </div>

                  <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    🎉 Hora do Sorteio!
                  </h2>

                  <div className="bg-white dark:bg-slate-700 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-600 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {selectedPlayersForDraw.length}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Jogadores
                        </div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                          {Math.max(...selectedPlayersForDraw.map(p => p.level))} - {Math.min(...selectedPlayersForDraw.map(p => p.level))}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Níveis
                        </div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {(selectedPlayersForDraw.reduce((sum, p) => sum + p.level, 0) / selectedPlayersForDraw.length).toFixed(1)}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Média
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <TeamDrawer
                  players={selectedPlayersForDraw}
                  onDraw={handleDrawTeams}
                />
              </div>
            </div>
          ) : (
            /* Estado vazio - nenhum jogador selecionado */
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-xl shadow-card border border-blue-200 dark:border-slate-600 p-8 text-center animate-scale-in">
              <div className="relative inline-flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-glow animate-pulse">
                  <UsersIcon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {players.length === 0 ? 'Bem-vindo!' : 'Quase lá!'}
              </h3>

              <div className="max-w-md mx-auto mb-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {players.length === 0
                    ? 'Vamos começar criando times incríveis juntos!'
                    : 'Agora é hora de escolher quem vai jogar.'
                  }
                </p>

                <div className="bg-white dark:bg-slate-700 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center space-x-3 text-left">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">
                          {players.length === 0 ? '1' : '2'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {players.length === 0 ? 'Adicionar jogadores' : 'Selecionar participantes'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {players.length === 0
                          ? 'Cadastre todos que vão participar'
                          : 'Escolha quem vai jogar neste sorteio'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsPlayerModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-105"
              >
                {players.length === 0 ? '🚀 Começar' : '🎯 Selecionar'}
              </button>

              {players.length > 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  <strong>{players.length}</strong> jogador{players.length !== 1 ? 'es' : ''} cadastrado{players.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {/* Jogadores Selecionados - Compacto */}
          {selectedPlayersForDraw.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-card border border-slate-200 dark:border-slate-700 p-4 animate-fade-in-up">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Jogadores Selecionados
                </h3>
                <button
                  onClick={() => setIsPlayerModalOpen(true)}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                >
                  Alterar →
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPlayersForDraw.map((player) => {
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

                  return (
                    <span
                      key={player.id}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getLevelColor(player.level)} shadow-sm`}
                    >
                      {player.nickname} (Nv.{player.level})
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal de Gerenciamento de Jogadores */}
        <PlayerManagementModal
          isOpen={isPlayerModalOpen}
          onClose={() => setIsPlayerModalOpen(false)}
          players={players}
          onAddPlayer={handleAddPlayer}
          onAddManyPlayers={handleBulkAddPlayers}
          onEditPlayer={handleEditPlayer}
          onDeletePlayer={handleDeletePlayer}
          onSelectPlayer={handleSelectPlayer}
          onDeselectPlayer={handleDeselectPlayer}
          selectedPlayers={selectedPlayersForDraw}
          isNicknameExists={isNicknameExists}
          onStartInlineEdit={handleStartInlineEdit}
          onSaveInlineEdit={handleSaveInlineEdit}
          onCancelInlineEdit={handleCancelInlineEdit}
        />
      </div>
    </main>
  );
}
