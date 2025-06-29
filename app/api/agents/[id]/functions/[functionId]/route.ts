import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string; functionId: string } }) {
  try {
    const { sql } = await import("@/lib/database")
    const { id: agentId, functionId } = params

    const [func] = await sql`
      SELECT * FROM functions 
      WHERE id = ${functionId} AND agent_id = ${agentId}
    `

    if (!func) {
      return NextResponse.json({ error: "Function not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      function: {
        id: func.id,
        name: func.name,
        description: func.description,
        parameters: func.parameters,
        code: func.code,
        status: func.status,
        created_at: func.created_at,
        updated_at: func.updated_at,
      },
    })
  } catch (error) {
    console.error("Error fetching function:", error)
    return NextResponse.json({ error: "Failed to load function" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string; functionId: string } }) {
  try {
    const { sql } = await import("@/lib/database")
    const { id: agentId, functionId } = params
    const updates = await request.json()

    const allowedFields = ["name", "description", "parameters", "code", "status"]
    const updateFields = Object.keys(updates).filter((key) => allowedFields.includes(key))

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    // Build dynamic update query
    const setClause = updateFields.map((field, index) => `${field} = $${index + 3}`).join(", ")
    const values = [functionId, agentId, ...updateFields.map((field) => updates[field])]

    const query = `
      UPDATE functions 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1 AND agent_id = $2
      RETURNING *
    `

    const [updatedFunction] = await sql.unsafe(query, values)

    if (!updatedFunction) {
      return NextResponse.json({ error: "Function not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      function: {
        id: updatedFunction.id,
        name: updatedFunction.name,
        description: updatedFunction.description,
        parameters: updatedFunction.parameters,
        code: updatedFunction.code,
        status: updatedFunction.status,
      },
    })
  } catch (error) {
    console.error("Error updating function:", error)
    return NextResponse.json({ error: "Failed to update function" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string; functionId: string } }) {
  try {
    const { sql } = await import("@/lib/database")
    const { id: agentId, functionId } = params

    // Delete function calls first
    await sql`DELETE FROM function_calls WHERE function_id = ${functionId}`

    // Delete the function
    const [deletedFunction] = await sql`
      DELETE FROM functions 
      WHERE id = ${functionId} AND agent_id = ${agentId}
      RETURNING *
    `

    if (!deletedFunction) {
      return NextResponse.json({ error: "Function not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Function deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting function:", error)
    return NextResponse.json({ error: "Failed to delete function" }, { status: 500 })
  }
}
