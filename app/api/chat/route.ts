import { openai } from "@ai-sdk/openai"
import { streamText, convertToCoreMessages } from "ai"
import type { NextRequest } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const { messages, agentId } = await req.json()

    // Verificar se temos a chave da OpenAI
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "OpenAI API key não configurada. Verifique suas variáveis de ambiente.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Buscar configurações do agente (simulado por enquanto)
    const agentConfig = getAgentConfig(agentId)

    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      messages: convertToCoreMessages(messages),
      system: agentConfig.systemPrompt,
      temperature: agentConfig.temperature,
      maxTokens: agentConfig.maxTokens,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Erro no chat:", error)
    return new Response(
      JSON.stringify({
        error: "Erro interno do servidor. Verifique os logs.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

// Configurações simuladas dos agentes
function getAgentConfig(agentId: string) {
  const configs: Record<string, any> = {
    "1": {
      systemPrompt: `Você é um assistente de vendas especializado e amigável. 
      Seu objetivo é ajudar clientes a encontrar produtos adequados às suas necessidades.
      Seja sempre educado, prestativo e focado em soluções.`,
      temperature: 0.7,
      maxTokens: 500,
    },
    "2": {
      systemPrompt: `Você é um especialista em suporte técnico.
      Forneça soluções claras e passo-a-passo para problemas técnicos.
      Seja preciso e didático em suas explicações.`,
      temperature: 0.3,
      maxTokens: 800,
    },
    default: {
      systemPrompt: `Você é um assistente útil e amigável.
      Responda de forma clara e prestativa às perguntas dos usuários.`,
      temperature: 0.5,
      maxTokens: 600,
    },
  }

  return configs[agentId] || configs.default
}
