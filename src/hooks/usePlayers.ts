import { useState, useEffect } from 'react';
import { Player } from '@/lib/players';

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar se nickname já existe
  const isNicknameExists = (nickname: string, excludeId?: string): boolean => {
    return players.some(player => 
      player.nickname.toLowerCase() === nickname.toLowerCase() && 
      player.id !== excludeId
    );
  };

  // Carregar jogadores do banco
  const loadPlayers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/players');
      if (!response.ok) {
        throw new Error('Falha ao carregar jogadores');
      }
      const data = await response.json();
      setPlayers(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar jogadores:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      // Em caso de erro, tenta carregar do localStorage como fallback
      try {
        const savedPlayers = localStorage.getItem('players');
        if (savedPlayers) {
          setPlayers(JSON.parse(savedPlayers));
        }
      } catch (localError) {
        console.error('Erro ao carregar do localStorage:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Adicionar jogador
  const addPlayer = async (nickname: string, level: number): Promise<boolean> => {
    try {
      // Validar nickname duplicado
      if (isNicknameExists(nickname)) {
        setError('Este nickname já está em uso');
        return false;
      }

      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname, level }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar jogador');
      }

      const newPlayer = await response.json();
      setPlayers(prev => [newPlayer, ...prev]);
      setError(null);
      
      // Salvar também no localStorage como backup
      const updatedPlayers = [newPlayer, ...players];
      localStorage.setItem('players', JSON.stringify(updatedPlayers));
      
      return true;
    } catch (err) {
      console.error('Erro ao adicionar jogador:', err);
      setError(err instanceof Error ? err.message : 'Erro ao adicionar jogador');
      return false;
    }
  };

  // Adicionar múltiplos jogadores
  const addManyPlayers = async (newPlayers: { nickname: string; level: number }[]): Promise<boolean> => {
    try {
      // Validar nicknames duplicados
      const duplicateNicknames = newPlayers.filter(newPlayer => 
        isNicknameExists(newPlayer.nickname)
      );
      
      if (duplicateNicknames.length > 0) {
        const nicknames = duplicateNicknames.map(p => p.nickname).join(', ');
        setError(`Os seguintes nicknames já estão em uso: ${nicknames}`);
        return false;
      }

      // Validar duplicatas dentro da própria lista
      const nicknames = newPlayers.map(p => p.nickname.toLowerCase());
      const duplicatesInList = nicknames.filter((nickname, index) => 
        nicknames.indexOf(nickname) !== index
      );
      
      if (duplicatesInList.length > 0) {
        setError('Há nicknames duplicados na lista');
        return false;
      }

      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ players: newPlayers }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar jogadores');
      }

      // Recarregar lista de jogadores
      await loadPlayers();
      setError(null);
      return true;
    } catch (err) {
      console.error('Erro ao adicionar jogadores:', err);
      setError(err instanceof Error ? err.message : 'Erro ao adicionar jogadores');
      return false;
    }
  };

  // Atualizar jogador
  const updatePlayer = async (id: string, nickname: string, level: number): Promise<boolean> => {
    try {
      // Validar nickname duplicado (excluindo o próprio jogador)
      if (isNicknameExists(nickname, id)) {
        setError('Este nickname já está em uso');
        return false;
      }

      const response = await fetch(`/api/players/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname, level }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar jogador');
      }

      const updatedPlayer = await response.json();
      setPlayers(prev => prev.map(player => 
        player.id === id ? updatedPlayer : player
      ));
      setError(null);
      
      // Atualizar localStorage
      const updatedPlayers = players.map(player => 
        player.id === id ? updatedPlayer : player
      );
      localStorage.setItem('players', JSON.stringify(updatedPlayers));
      
      return true;
    } catch (err) {
      console.error('Erro ao atualizar jogador:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar jogador');
      return false;
    }
  };

  // Deletar jogador
  const deletePlayer = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/players/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao deletar jogador');
      }

      setPlayers(prev => prev.filter(player => player.id !== id));
      setError(null);
      
      // Atualizar localStorage
      const filteredPlayers = players.filter(player => player.id !== id);
      localStorage.setItem('players', JSON.stringify(filteredPlayers));
      
      return true;
    } catch (err) {
      console.error('Erro ao deletar jogador:', err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar jogador');
      return false;
    }
  };

  // Salvar sorteio
  const saveTeamDraw = async (teams: Player[][]): Promise<boolean> => {
    try {
      const playerIds = teams.flat().map(player => player.id);
      
      const response = await fetch('/api/team-draws', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerIds, teams }),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar sorteio');
      }

      setError(null);
      return true;
    } catch (err) {
      console.error('Erro ao salvar sorteio:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar sorteio');
      return false;
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  return {
    players,
    loading,
    error,
    addPlayer,
    addManyPlayers,
    updatePlayer,
    deletePlayer,
    saveTeamDraw,
    refreshPlayers: loadPlayers,
    isNicknameExists,
  };
} 