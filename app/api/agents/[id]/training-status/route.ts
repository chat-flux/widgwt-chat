import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { sql } = await import("@/lib/database")
    const agentId = params.id

    // Get agent training status
    const [agent] = await sql`
      SELECT 
        training_status,
        training_progress,
        training_stage,
        last_training,
        training_error
      FROM agents 
      WHERE id = ${agentId}
    `

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Get document and function counts
    const [documentCount] = await sql`
      SELECT COUNT(*) as total FROM documents WHERE agent_id = ${agentId}
    `

    const [functionCount] = await sql`
      SELECT COUNT(*) as total FROM functions WHERE agent_id = ${agentId}
    `

    const [processedDocuments] = await sql`
      SELECT COUNT(*) as processed FROM documents WHERE agent_id = ${agentId} AND status = 'processed'
    `

    const [processedFunctions] = await sql`
      SELECT COUNT(*) as processed FROM functions WHERE agent_id = ${agentId} AND status = 'active'
    `

    const status = {
      isTraining: agent.training_status === "training",
      progress: agent.training_progress || 0,
      stage: agent.training_stage || "idle",
      documentsProcessed: Number.parseInt(processedDocuments?.processed || "0"),
      totalDocuments: Number.parseInt(documentCount?.total || "0"),
      functionsProcessed: Number.parseInt(processedFunctions?.processed || "0"),
      totalFunctions: Number.parseInt(functionCount?.total || "0"),
      lastTraining: agent.last_training,
      status: agent.training_status || "idle",
      error: agent.training_error,
    }

    return NextResponse.json({
      success: true,
      status,
    })
  } catch (error) {
    console.error("Error fetching training status:", error)
    return NextResponse.json({ error: "Failed to load training status" }, { status: 500 })
  }
}
