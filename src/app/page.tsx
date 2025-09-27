'use client';

import { useState, useEffect } from 'react';
import { UserPlusIcon, UsersIcon } from '@heroicons/react/24/outline';
import { 
  PlayerInputMode, 
  PlayerList, 
  TeamDrawer, 
  TeamDisplay, 
  ThemeToggle, 
  Tabs, 
  PlayerSelection 
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
    saveTeamDraw,
    isNicknameExists,
  } = usePlayers();

  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [drawnTeams, setDrawnTeams] = useState<Player[][]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState('add');
  const [selectedPlayersForDraw, setSelectedPlayersForDraw] = useState<Player[]>([]);

  // Mudar para aba de adicionar quando começar a editar
  useEffect(() => {
    if (editingPlayer) {
      setActiveTab('add');
    }
  }, [editingPlayer]);

  // Remover jogadores deletados da seleção
  useEffect(() => {
    setSelectedPlayersForDraw(prev => 
      prev.filter(selectedPlayer => 
        players.some(player => player.id === selectedPlayer.id)
      )
    );
  }, [players]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddPlayer = async (nickname: string, level: number) => {
    if (editingPlayer) {
      // Atualizar jogador existente
      const success = await updatePlayer(editingPlayer.id, nickname, level);
      if (success) {
        setEditingPlayer(null);
        showNotification('Jogador atualizado com sucesso!', 'success');
      } else {
        showNotification(error || 'Erro ao atualizar jogador', 'error');
      }
    } else {
      // Adicionar novo jogador
      const success = await addPlayer(nickname, level);
      if (success) {
        showNotification('Jogador adicionado com sucesso!', 'success');
      } else {
        showNotification(error || 'Erro ao adicionar jogador', 'error');
      }
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

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    // A aba será mudada automaticamente pelo useEffect
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
    
    // Salvar sorteio no banco
    //const success = await saveTeamDraw(teams);
    //if (success) {
    //  showNotification('Sorteio salvo no banco de dados!', 'success');
    //} else {
    //  showNotification(error || 'Erro ao salvar sorteio', 'error');
    //}
  };

  const handleSelectPlayer = (player: Player) => {
    if (!selectedPlayersForDraw.find(p => p.id === player.id)) {
      setSelectedPlayersForDraw(prev => [...prev, player]);
    }
  };

  const handleDeselectPlayer = (playerId: string) => {
    setSelectedPlayersForDraw(prev => prev.filter(p => p.id !== playerId));
  };

  const handleSelectAllPlayers = () => {
    setSelectedPlayersForDraw([...players]);
  };

  const handleClearSelection = () => {
    setSelectedPlayersForDraw([]);
  };

  // Aba de Adicionar Jogadores
  const addPlayersTab = (
    <div className="max-w-4xl mx-auto">
      <PlayerInputMode
        onSubmit={handleAddPlayer}
        onBulkSubmit={handleBulkAddPlayers}
        editingPlayer={editingPlayer}
        onCancelEdit={() => setEditingPlayer(null)}
        isNicknameExists={isNicknameExists}
      />
      
      {editingPlayer && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Modo de Edição Ativo
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Você está editando o jogador <strong>{editingPlayer.nickname}</strong>. 
            Use o formulário acima para fazer as alterações ou clique em cancelar.
          </p>
        </div>
      )}
      
      {/* Lista resumida na aba de adicionar */}
      {players.length > 0 && !editingPlayer && (
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Jogadores Cadastrados ({players.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {players.slice(0, 20).map((player) => (
              <span
                key={player.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
              >
                {player.nickname} (Nv.{player.level})
              </span>
            ))}
            {players.length > 20 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{players.length - 20} mais...
              </span>
            )}
          </div>
          <button
            onClick={() => setActiveTab('manage')}
            className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
          >
            Ver todos os jogadores e fazer sorteio →
          </button>
        </div>
      )}
    </div>
  );

  // Aba de Jogadores e Sorteio
  const playersAndDrawTab = (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
      {/* Lista de todos os jogadores */}
      <div className="lg:col-span-1 2xl:col-span-1">
        <PlayerList
          players={players}
          onEdit={handleEditPlayer}
          onDelete={handleDeletePlayer}
          selectedPlayers={selectedPlayersForDraw}
          onSelectPlayer={handleSelectPlayer}
          showSelection={true}
        />
      </div>

      {/* Seleção de jogadores para sorteio */}
      <div className="lg:col-span-1 2xl:col-span-1">
        <PlayerSelection
          selectedPlayers={selectedPlayersForDraw}
          onDeselectPlayer={handleDeselectPlayer}
          onSelectAll={handleSelectAllPlayers}
          onClearSelection={handleClearSelection}
          totalPlayers={players.length}
        />
      </div>

      {/* Sorteio e resultado */}
      <div className="lg:col-span-2 2xl:col-span-1 space-y-6">
        <TeamDrawer
          players={selectedPlayersForDraw}
          onDraw={handleDrawTeams}
        />
        {drawnTeams.length > 0 && (
          <TeamDisplay teams={drawnTeams} />
        )}
      </div>
    </div>
  );

  const tabs = [
    {
      id: 'add',
      label: 'Adicionar Jogadores',
      icon: <UserPlusIcon />,
      content: addPlayersTab,
    },
    {
      id: 'manage',
      label: `Jogadores & Sorteio${players.length > 0 ? ` (${players.length})` : ''}`,
      icon: <UsersIcon />,
      content: playersAndDrawTab,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <ThemeToggle />
      
      {/* Notificação */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Container com largura baseada na tela e margens responsivas */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="max-w-none">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Sorteador de Times
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
              Gerencie seus jogadores e sorteie times equilibrados
            </p>
            {loading && (
              <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                Carregando jogadores do banco de dados...
              </p>
            )}
            {error && !loading && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                Usando dados locais: {error}
              </p>
            )}
          </div>

          <Tabs 
            tabs={tabs} 
            defaultTab="add"
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 lg:p-10 border border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>
    </main>
  );
}
