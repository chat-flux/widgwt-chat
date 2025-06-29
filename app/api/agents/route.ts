import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "user_1"

    const agents = await sql`
      SELECT 
        a.*,
        COALESCE(doc_count.count, 0) as documents_count, 
        COALESCE(func_count.count, 0) as functions_count,
        COALESCE(conv_count.count, 0) as conversations_count,
        wc.is_published,
        wc.embed_count
      FROM agents a
      LEFT JOIN (
        SELECT agent_id, COUNT(*) as count 
        FROM documents 
        WHERE status = 'active' 
        GROUP BY agent_id
      ) doc_count ON a.id = doc_count.agent_id
      LEFT JOIN (
        SELECT agent_id, COUNT(*) as count 
        FROM functions 
        WHERE status = 'active' 
        GROUP BY agent_id
      ) func_count ON a.id = func_count.agent_id
      LEFT JOIN (
        SELECT agent_id, COUNT(*) as count 
        FROM conversations 
        GROUP BY agent_id
      ) conv_count ON a.id = conv_count.agent_id
      LEFT JOIN widget_configs wc ON a.id = wc.agent_id
      WHERE a.user_id = ${userId} AND a.status = 'active'
      ORDER BY a.created_at DESC
    `

    return NextResponse.json(agents)
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, name, description, system_prompt, model = "gpt-4", temperature = 0.7, max_tokens = 2000 } = body

    if (!user_id || !name) {
      return NextResponse.json({ error: "user_id and name are required" }, { status: 400 })
    }

    const [agent] = await sql`
      INSERT INTO agents (user_id, name, description, system_prompt, model, temperature, max_tokens)
      VALUES (${user_id}, ${name}, ${description}, ${system_prompt}, ${model}, ${temperature}, ${max_tokens})
      RETURNING *
    `

    return NextResponse.json(agent, { status: 201 })
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
  }
}
