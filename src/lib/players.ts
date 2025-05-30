import { prisma } from './prisma';

export interface Player {
  id: string;
  nickname: string;
  level: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Buscar todos os jogadores
export async function getAllPlayers(): Promise<Player[]> {
  try {
    const players = await prisma.player.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return players;
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error);
    throw new Error('Falha ao carregar jogadores');
  }
}

// Criar um novo jogador
export async function createPlayer(nickname: string, level: number): Promise<Player> {
  try {
    const player = await prisma.player.create({
      data: {
        nickname,
        level
      }
    });
    return player;
  } catch (error) {
    console.error('Erro ao criar jogador:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new Error('Este nickname já está em uso');
    }
    throw new Error('Falha ao criar jogador');
  }
}

// Criar múltiplos jogadores
export async function createManyPlayers(players: { nickname: string; level: number }[]): Promise<number> {
  try {
    const result = await prisma.player.createMany({
      data: players,
      skipDuplicates: true // Ignora nicknames duplicados
    });
    return result.count;
  } catch (error) {
    console.error('Erro ao criar jogadores em lote:', error);
    throw new Error('Falha ao criar jogadores');
  }
}

// Atualizar um jogador
export async function updatePlayer(id: string, nickname: string, level: number): Promise<Player> {
  try {
    const player = await prisma.player.update({
      where: { id },
      data: {
        nickname,
        level
      }
    });
    return player;
  } catch (error) {
    console.error('Erro ao atualizar jogador:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new Error('Este nickname já está em uso');
    }
    throw new Error('Falha ao atualizar jogador');
  }
}

// Deletar um jogador
export async function deletePlayer(id: string): Promise<void> {
  try {
    await prisma.player.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Erro ao deletar jogador:', error);
    throw new Error('Falha ao deletar jogador');
  }
}

// Salvar um sorteio de times
export async function saveTeamDraw(playerIds: string[], teams: any[]): Promise<void> {
  try {
    await prisma.teamDraw.create({
      data: {
        players: {
          connect: playerIds.map(id => ({ id }))
        },
        teams: JSON.stringify(teams)
      }
    });
  } catch (error) {
    console.error('Erro ao salvar sorteio:', error);
    throw new Error('Falha ao salvar sorteio');
  }
} 