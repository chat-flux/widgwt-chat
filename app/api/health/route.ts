import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar se as variáveis essenciais estão configuradas
    const hasOpenAI = !!process.env.OPENAI_API_KEY
    const hasDatabase = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL)
    const hasRedis = !!(process.env.REDIS_URL || process.env.KV_REST_API_URL)

    const status = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        openai: hasOpenAI ? "configured" : "missing",
        database: hasDatabase ? "configured" : "missing",
        redis: hasRedis ? "configured" : "missing",
      },
      environment: process.env.NODE_ENV || "development",
    }

    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
