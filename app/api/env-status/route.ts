import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar todas as variáveis disponíveis
    const envStatus = {
      openai: {
        configured: !!process.env.OPENAI_API_KEY,
        key: process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 15)}...` : null,
        source: process.env.OPENAI_API_KEY ? "v0" : "missing",
      },
      database: {
        configured: !!(
          process.env.DATABASE_URL ||
          process.env.POSTGRES_URL ||
          process.env.POSTGRES_PRISMA_URL ||
          process.env.DATABASE_URL_UNPOOLED
        ),
        url: (
          process.env.DATABASE_URL ||
          process.env.POSTGRES_URL ||
          process.env.POSTGRES_PRISMA_URL ||
          process.env.DATABASE_URL_UNPOOLED ||
          null
        )?.replace(/:[^:@]*@/, ":***@"),
        source: process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL ? "v0" : "local",
        available: {
          DATABASE_URL: !!process.env.DATABASE_URL,
          POSTGRES_URL: !!process.env.POSTGRES_URL,
          POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
          DATABASE_URL_UNPOOLED: !!process.env.DATABASE_URL_UNPOOLED,
        },
      },
      redis: {
        configured: !!(
          process.env.REDIS_URL ||
          process.env.KV_REST_API_URL ||
          process.env.KV_URL ||
          process.env.CELERY_BROKER_URL
        ),
        url:
          process.env.REDIS_URL ||
          process.env.KV_REST_API_URL ||
          process.env.KV_URL ||
          process.env.CELERY_BROKER_URL ||
          null,
        source: process.env.KV_REST_API_URL || process.env.KV_URL ? "v0" : "local",
        available: {
          REDIS_URL: !!process.env.REDIS_URL,
          KV_REST_API_URL: !!process.env.KV_REST_API_URL,
          KV_URL: !!process.env.KV_URL,
          CELERY_BROKER_URL: !!process.env.CELERY_BROKER_URL,
        },
      },
      overall: {
        allConfigured: !!(
          process.env.OPENAI_API_KEY &&
          (process.env.DATABASE_URL ||
            process.env.POSTGRES_URL ||
            process.env.POSTGRES_PRISMA_URL ||
            process.env.DATABASE_URL_UNPOOLED) &&
          (process.env.REDIS_URL || process.env.KV_REST_API_URL || process.env.KV_URL || process.env.CELERY_BROKER_URL)
        ),
        source: "v0",
      },
      // Informações adicionais do v0
      additional: {
        KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
        KV_REST_API_READ_ONLY_TOKEN: !!process.env.KV_REST_API_READ_ONLY_TOKEN,
        PGHOST: process.env.PGHOST || null,
        PGUSER: process.env.PGUSER || null,
        PGDATABASE: process.env.PGDATABASE || null,
        POSTGRES_USER: process.env.POSTGRES_USER || null,
        POSTGRES_PASSWORD: !!process.env.POSTGRES_PASSWORD,
        POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || null,
      },
    }

    return NextResponse.json(envStatus)
  } catch (error) {
    console.error("Erro ao verificar variáveis de ambiente:", error)
    return NextResponse.json(
      {
        error: "Erro ao verificar configurações",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
