import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

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

    console.log("🔑 OpenAI API Key detectada:", apiKey.substring(0, 15) + "...")
    console.log("📝 Prompt recebido:", prompt)

    const result = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: prompt || "Olá! Como você está?",
      maxTokens: 100,
      temperature: 0.7,
    })

    console.log("✅ Resposta da OpenAI:", result.text)

    return new Response(
      JSON.stringify({
        success: true,
        response: result.text,
        usage: result.usage,
        model: "gpt-3.5-turbo",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("❌ Erro na OpenAI API:", error)

    return new Response(
      JSON.stringify({
        error: `Erro na OpenAI API: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        details: error instanceof Error ? error.stack : null,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
