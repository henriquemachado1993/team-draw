import { NextRequest, NextResponse } from "next/server";
import { updatePlayer, deletePlayer } from "@/lib/players";

// PUT - Atualizar jogador
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { nickname, level } = await request.json();

    if (!nickname || level === undefined) {
      return NextResponse.json(
        { error: "Nickname e level são obrigatórios" },
        { status: 400 }
      );
    }

    if (level < 1 || level > 20) {
      return NextResponse.json(
        { error: "Level deve estar entre 1 e 20" },
        { status: 400 }
      );
    }

    const player = await updatePlayer((await params).id, nickname, level);
    return NextResponse.json(player);
  } catch (error) {
    console.error("Erro na API PUT /players/[id]:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Falha ao atualizar jogador" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar jogador
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await deletePlayer((await params).id);
    return NextResponse.json({ message: "Jogador deletado com sucesso" });
  } catch (error) {
    console.error("Erro na API DELETE /players/[id]:", error);

    return NextResponse.json(
      { error: "Falha ao deletar jogador" },
      { status: 500 }
    );
  }
}
