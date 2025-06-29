import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key não configurada" }, { status: 400 })
    }

    const response = await fetch(`https://api.openai.com/v1/assistants/${params.id}`, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Erro ao buscar assistente")
    }

    const assistant = await response.json()

    return NextResponse.json({
      success: true,
      assistant,
    })
  } catch (error) {
    console.error("Erro ao buscar assistente:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro ao buscar assistente",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, instructions, model, tools, temperature, top_p } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key não configurada" }, { status: 400 })
    }

    const response = await fetch(`https://api.openai.com/v1/assistants/${params.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({
        name,
        instructions,
        model,
        tools,
        temperature,
        top_p,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Erro ao atualizar assistente")
    }

    const assistant = await response.json()

    return NextResponse.json({
      success: true,
      assistant,
    })
  } catch (error) {
    console.error("Erro ao atualizar assistente:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro ao atualizar assistente",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key não configurada" }, { status: 400 })
    }

    const response = await fetch(`https://api.openai.com/v1/assistants/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Erro ao deletar assistente")
    }

    // Atualizar agente no banco para remover assistant_id
    try {
      const { sql } = await import("@/lib/database")
      await sql`
        UPDATE agents 
        SET assistant_id = NULL, status = 'inactive'
        WHERE assistant_id = ${params.id}
      `
    } catch (dbError) {
      console.error("Erro ao atualizar agente no banco:", dbError)
    }

    return NextResponse.json({
      success: true,
      message: "Assistente deletado com sucesso",
    })
  } catch (error) {
    console.error("Erro ao deletar assistente:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro ao deletar assistente",
      },
      { status: 500 },
    )
  }
}
