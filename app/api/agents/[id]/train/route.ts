import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { sql } = await import("@/lib/database")
    const agentId = params.id

    // Check if agent exists
    const [agent] = await sql`
      SELECT id, training_status FROM agents WHERE id = ${agentId}
    `

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    if (agent.training_status === "training") {
      return NextResponse.json({ error: "Training already in progress" }, { status: 400 })
    }

    // Get counts for training
    const [documentCount] = await sql`
      SELECT COUNT(*) as total FROM documents WHERE agent_id = ${agentId}
    `

    const [functionCount] = await sql`
      SELECT COUNT(*) as total FROM functions WHERE agent_id = ${agentId}
    `

    const totalItems = Number.parseInt(documentCount?.total || "0") + Number.parseInt(functionCount?.total || "0")

    if (totalItems === 0) {
      return NextResponse.json({ error: "No documents or functions to train with" }, { status: 400 })
    }

    // Start training
    await sql`
      UPDATE agents 
      SET 
        training_status = 'training',
        training_progress = 0,
        training_stage = 'analyzing_documents',
        training_error = NULL,
        updated_at = NOW()
      WHERE id = ${agentId}
    `

    // Simulate training process (in a real app, this would be a background job)
    simulateTraining(agentId)

    return NextResponse.json({
      success: true,
      message: "Training started successfully",
    })
  } catch (error) {
    console.error("Error starting training:", error)
    return NextResponse.json({ error: "Failed to start training" }, { status: 500 })
  }
}

// Simulate training process
async function simulateTraining(agentId: string) {
  try {
    const { sql } = await import("@/lib/database")

    const stages = [
      { stage: "analyzing_documents", progress: 20, duration: 3000 },
      { stage: "processing_functions", progress: 40, duration: 2000 },
      { stage: "building_knowledge", progress: 70, duration: 4000 },
      { stage: "optimizing", progress: 90, duration: 2000 },
      { stage: "completed", progress: 100, duration: 1000 },
    ]

    for (const { stage, progress, duration } of stages) {
      await new Promise((resolve) => setTimeout(resolve, duration))

      await sql`
        UPDATE agents 
        SET 
          training_stage = ${stage},
          training_progress = ${progress},
          updated_at = NOW()
        WHERE id = ${agentId}
      `
    }

    // Mark as completed
    await sql`
      UPDATE agents 
      SET 
        training_status = 'completed',
        training_progress = 100,
        training_stage = 'completed',
        last_training = NOW(),
        status = 'active',
        updated_at = NOW()
      WHERE id = ${agentId}
    `

    // Mark all documents and functions as processed
    await sql`
      UPDATE documents 
      SET status = 'processed', updated_at = NOW()
      WHERE agent_id = ${agentId} AND status != 'processed'
    `

    await sql`
      UPDATE functions 
      SET status = 'active', updated_at = NOW()
      WHERE agent_id = ${agentId} AND status != 'active'
    `
  } catch (error) {
    console.error("Error during training simulation:", error)

    // Mark as error
    try {
      const { sql } = await import("@/lib/database")
      await sql`
        UPDATE agents 
        SET 
          training_status = 'error',
          training_error = ${error instanceof Error ? error.message : "Unknown error"},
          updated_at = NOW()
        WHERE id = ${agentId}
      `
    } catch (updateError) {
      console.error("Error updating training error:", updateError)
    }
  }
}
