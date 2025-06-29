import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key não configurada" }, { status: 400 })
    }

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "Arquivo de áudio não fornecido" }, { status: 400 })
    }

    // Criar FormData para enviar para OpenAI
    const openaiFormData = new FormData()
    openaiFormData.append("file", audioFile)
    openaiFormData.append("model", "whisper-1")
    openaiFormData.append("language", "pt")

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openaiFormData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Erro na transcrição")
    }

    const transcription = await response.json()

    return NextResponse.json({
      success: true,
      text: transcription.text,
    })
  } catch (error) {
    console.error("Erro na transcrição:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro na transcrição",
      },
      { status: 500 },
    )
  }
}
