import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { sql } = await import("@/lib/database")
    const agentId = params.id

    const [agent] = await sql`
      SELECT 
        a.*,
        COUNT(DISTINCT c.id) as conversations,
        COUNT(DISTINCT d.id) as documents_count,
        COUNT(DISTINCT f.id) as functions_count,
        MAX(c.updated_at) as last_activity
      FROM agents a
      LEFT JOIN conversations c ON a.id = c.agent_id
      LEFT JOIN documents d ON a.id = d.agent_id
      LEFT JOIN functions f ON a.id = f.agent_id
      WHERE a.id = ${agentId}
      GROUP BY a.id
    `

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        status: agent.status,
        systemPrompt: agent.system_prompt,
        personality: agent.personality,
        color: agent.color,
        conversations: Number.parseInt(agent.conversations) || 0,
        documentsCount: Number.parseInt(agent.documents_count) || 0,
        functionsCount: Number.parseInt(agent.functions_count) || 0,
        lastActivity: agent.last_activity ? new Date(agent.last_activity).toLocaleString("pt-BR") : "Nunca",
      },
    })
  } catch (error) {
    console.error("Error fetching agent:", error)
    return NextResponse.json({ error: "Failed to load agent" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { sql } = await import("@/lib/database")
    const agentId = params.id
    const updates = await request.json()

    const allowedFields = ["name", "description", "system_prompt", "personality", "color", "status"]
    const updateFields = Object.keys(updates).filter((key) => allowedFields.includes(key))

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    // Build dynamic update query
    const setClause = updateFields.map((field) => `${field} = $${updateFields.indexOf(field) + 2}`).join(", ")
    const values = [agentId, ...updateFields.map((field) => updates[field])]

    const query = `
      UPDATE agents 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `

    const [updatedAgent] = await sql.unsafe(query, values)

    if (!updatedAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      agent: {
        id: updatedAgent.id,
        name: updatedAgent.name,
        description: updatedAgent.description,
        status: updatedAgent.status,
        systemPrompt: updatedAgent.system_prompt,
        personality: updatedAgent.personality,
        color: updatedAgent.color,
      },
    })
  } catch (error) {
    console.error("Error updating agent:", error)
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { sql } = await import("@/lib/database")
    const agentId = params.id

    // Delete related data first
    await sql`DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE agent_id = ${agentId})`
    await sql`DELETE FROM conversations WHERE agent_id = ${agentId}`
    await sql`DELETE FROM documents WHERE agent_id = ${agentId}`
    await sql`DELETE FROM functions WHERE agent_id = ${agentId}`
    await sql`DELETE FROM widget_configs WHERE agent_id = ${agentId}`

    // Delete the agent
    const [deletedAgent] = await sql`DELETE FROM agents WHERE id = ${agentId} RETURNING *`

    if (!deletedAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Agent deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting agent:", error)
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 })
  }
}
