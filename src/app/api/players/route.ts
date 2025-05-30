import { NextRequest, NextResponse } from 'next/server';
import { getAllPlayers, createPlayer, createManyPlayers } from '@/lib/players';

// GET - Buscar todos os jogadores
export async function GET() {
  try {
    const players = await getAllPlayers();
    return NextResponse.json(players);
  } catch (error) {
    console.error('Erro na API GET /players:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar jogadores' },
      { status: 500 }
    );
  }
}

// POST - Criar jogador(es)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar se é criação em lote
    if (Array.isArray(body.players)) {
      const count = await createManyPlayers(body.players);
      return NextResponse.json({ 
        message: `${count} jogadores criados com sucesso`,
        count 
      });
    } else {
      // Criação de jogador único
      const { nickname, level } = body;
      
      if (!nickname || level === undefined) {
        return NextResponse.json(
          { error: 'Nickname e level são obrigatórios' },
          { status: 400 }
        );
      }
      
      const player = await createPlayer(nickname, level);
      return NextResponse.json(player, { status: 201 });
    }
  } catch (error) {
    console.error('Erro na API POST /players:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Falha ao criar jogador(es)' },
      { status: 500 }
    );
  }
} 