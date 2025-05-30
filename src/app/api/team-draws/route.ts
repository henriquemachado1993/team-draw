import { NextRequest, NextResponse } from 'next/server';
import { saveTeamDraw } from '@/lib/players';

// POST - Salvar sorteio de times
export async function POST(request: NextRequest) {
  try {
    const { playerIds, teams } = await request.json();
    
    if (!playerIds || !Array.isArray(playerIds) || !teams) {
      return NextResponse.json(
        { error: 'IDs dos jogadores e times são obrigatórios' },
        { status: 400 }
      );
    }
    
    await saveTeamDraw(playerIds, teams);
    return NextResponse.json({ 
      message: 'Sorteio salvo com sucesso' 
    }, { status: 201 });
  } catch (error) {
    console.error('Erro na API POST /team-draws:', error);
    
    return NextResponse.json(
      { error: 'Falha ao salvar sorteio' },
      { status: 500 }
    );
  }
} 