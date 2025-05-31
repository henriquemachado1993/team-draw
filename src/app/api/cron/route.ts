import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // if (
  //   req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  // ) {
  //   return res.status(401).end("Unauthorized");
  // }

  const clientId = "server-health-check";
  try {
    await prisma.connectionHeartbeat.upsert({
      where: { clientId },
      update: { lastPingAt: new Date() },
      create: {
        clientId,
        lastPingAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, message: "Heartbeat registrado" });
  } catch (error) {
    console.error("Erro no heartbeat:", error);
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
