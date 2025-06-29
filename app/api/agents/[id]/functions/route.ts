import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const functions = await sql`
      SELECT * FROM functions 
      WHERE agent_id = ${id}
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      functions: functions.map((func) => ({
        id: func.id,
        name: func.name,
        description: func.description,
        category: func.category,
        parameters: func.parameters,
        implementation: func.implementation,
        enabled: func.enabled,
        createdAt: func.created_at,
        updatedAt: func.updated_at,
        lastUsed: func.last_used,
        usageCount: func.usage_count,
      })),
    })
  } catch (error) {
    console.error("Error fetching functions:", error)
    return NextResponse.json({ error: "Failed to fetch functions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { name, description, category = "custom", parameters, implementation } = await request.json()

    if (!name || !parameters || !implementation) {
      return NextResponse.json({ error: "Name, parameters, and implementation are required" }, { status: 400 })
    }

    const [func] = await sql`
      INSERT INTO functions (agent_id, name, description, category, parameters, implementation)
      VALUES (${id}, ${name}, ${description}, ${category}, ${JSON.stringify(parameters)}, ${implementation})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      function: {
        id: func.id,
        name: func.name,
        description: func.description,
        category: func.category,
        parameters: func.parameters,
        implementation: func.implementation,
        enabled: func.enabled,
        createdAt: func.created_at,
        usageCount: func.usage_count,
      },
    })
  } catch (error) {
    console.error("Error creating function:", error)
    return NextResponse.json({ error: "Failed to create function" }, { status: 500 })
  }
}
