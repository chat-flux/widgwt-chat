export interface EnvConfig {
  openaiApiKey: string | null
  databaseUrl: string | null
  redisUrl: string | null
  nodeEnv: string
  source: "local" | "v0" | "mixed"
}

export interface EnvStatus {
  openai: {
    configured: boolean
    key: string | null
    source: string
  }
  database: {
    configured: boolean
    url: string | null
    source: string
    available?: Record<string, boolean>
  }
  redis: {
    configured: boolean
    url: string | null
    source: string
    available?: Record<string, boolean>
  }
  overall: {
    source: string
    allConfigured: boolean
  }
  additional?: Record<string, any>
}

// Função para buscar status do servidor
export async function fetchEnvStatus(): Promise<EnvStatus> {
  try {
    const response = await fetch("/api/env-status")
    if (!response.ok) {
      throw new Error("Erro ao buscar status das variáveis")
    }
    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar status:", error)
    // Retornar status padrão em caso de erro
    return {
      openai: { configured: false, key: null, source: "missing" },
      database: { configured: false, url: null, source: "missing" },
      redis: { configured: false, url: null, source: "missing" },
      overall: { source: "unknown", allConfigured: false },
    }
  }
}

// Função legada para compatibilidade (agora usa valores padrão)
export function validateEnvConfig(): EnvConfig {
  return {
    openaiApiKey: null,
    databaseUrl: null,
    redisUrl: null,
    nodeEnv: "development",
    source: "v0",
  }
}

// Função legada para compatibilidade (agora retorna valores padrão)
export function getEnvStatus(): EnvStatus {
  return {
    openai: { configured: false, key: null, source: "checking" },
    database: { configured: false, url: null, source: "checking" },
    redis: { configured: false, url: null, source: "checking" },
    overall: { source: "checking", allConfigured: false },
  }
}
