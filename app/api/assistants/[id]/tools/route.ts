import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const assistantId = params.id
    const { tool } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key não configurada" }, { status: 400 })
    }

    // Primeiro, buscar o assistente atual
    const getResponse = await fetch(`https://api.openai.com/v1/assistants/${assistantId}`, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    })

    if (!getResponse.ok) {
      throw new Error("Assistente não encontrado")
    }

    const assistant = await getResponse.json()
    const currentTools = assistant.tools || []

    // Adicionar nova tool se não existir
    const toolExists = currentTools.some(
      (t: any) => t.type === tool.type && (tool.type !== "function" || t.function?.name === tool.function?.name),
    )

    if (!toolExists) {
      currentTools.push(tool)
    }

    // Atualizar assistente com as tools
    const updateResponse = await fetch(`https://api.openai.com/v1/assistants/${assistantId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({
        tools: currentTools,
      }),
    })

    if (!updateResponse.ok) {
      throw new Error("Erro ao atualizar assistente")
    }

    const updatedAssistant = await updateResponse.json()

    return NextResponse.json({
      success: true,
      assistant: updatedAssistant,
      toolAdded: !toolExists,
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao adicionar tool" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const assistantId = params.id
    const { toolType, functionName } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key não configurada" }, { status: 400 })
    }

    // Buscar assistente atual
    const getResponse = await fetch(`https://api.openai.com/v1/assistants/${assistantId}`, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    })

    if (!getResponse.ok) {
      throw new Error("Assistente não encontrado")
    }

    const assistant = await getResponse.json()
    const currentTools = assistant.tools || []

    // Remover tool
    const filteredTools = currentTools.filter((t: any) => {
      if (t.type !== toolType) return true
      if (toolType === "function" && functionName) {
        return t.function?.name !== functionName
      }
      return false
    })

    // Atualizar assistente
    const updateResponse = await fetch(`https://api.openai.com/v1/assistants/${assistantId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({
        tools: filteredTools,
      }),
    })

    if (!updateResponse.ok) {
      throw new Error("Erro ao atualizar assistente")
    }

    const updatedAssistant = await updateResponse.json()

    return NextResponse.json({
      success: true,
      assistant: updatedAssistant,
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao remover tool" }, { status: 500 })
  }
}
