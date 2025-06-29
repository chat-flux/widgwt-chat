import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { message, agentId } = await req.json()

    // Verificar se temos a chave da OpenAI
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "OpenAI API key não configurada",
          response: "Desculpe, o chat não está disponível no momento. Entre em contato conosco por outros meios.",
        }),
        {
          status: 200, // Retorna 200 para não quebrar o widget
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        },
      )
    }

    // Buscar configurações do agente
    const agentConfig = getAgentConfig(agentId)

    console.log(`🤖 Widget Chat - Agente ${agentId}:`, message)

    const result = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: message,
      system: agentConfig.systemPrompt,
      temperature: agentConfig.temperature,
      maxTokens: agentConfig.maxTokens,
    })

    console.log(`✅ Resposta gerada:`, result.text)

    return new Response(
      JSON.stringify({
        success: true,
        response: result.text,
        agentId,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  } catch (error) {
    console.error("❌ Erro no widget chat:", error)

    return new Response(
      JSON.stringify({
        error: "Erro interno",
        response: "Desculpe, ocorreu um erro. Tente novamente em alguns instantes.",
      }),
      {
        status: 200, // Retorna 200 para não quebrar o widget
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  }
}

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

// Configurações dos agentes
function getAgentConfig(agentId: string) {
  const configs: Record<string, any> = {
    "1": {
      systemPrompt: `Você é um assistente de vendas especializado e amigável chamado "Assistente de Vendas". 
      Seu objetivo é ajudar clientes a encontrar produtos adequados às suas necessidades.
      Seja sempre educado, prestativo e focado em soluções. Mantenha respostas concisas e úteis.
      Se não souber algo específico sobre produtos, peça mais detalhes ou sugira entrar em contato com a equipe.`,
      temperature: 0.7,
      maxTokens: 300,
    },
    "2": {
      systemPrompt: `Você é um especialista em suporte técnico chamado "Suporte Técnico".
      Forneça soluções claras e passo-a-passo para problemas técnicos.
      Seja preciso e didático em suas explicações. Mantenha respostas organizadas e fáceis de seguir.
      Se o problema for complexo, sugira escalonamento para a equipe técnica.`,
      temperature: 0.3,
      maxTokens: 400,
    },
    default: {
      systemPrompt: `Você é um assistente útil e amigável.
      Responda de forma clara e prestativa às perguntas dos usuários.
      Mantenha um tom profissional mas acessível. Se não souber algo, seja honesto e sugira alternativas.`,
      temperature: 0.5,
      maxTokens: 250,
    },
  }

  return configs[agentId] || configs.default
}
