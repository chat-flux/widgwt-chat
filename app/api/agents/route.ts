import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

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
        wc.is_published as widget_published,
        COALESCE(wc.embed_count, 0) as widget_embed_count
      FROM agents a
      LEFT JOIN (
        SELECT agent_id, COUNT(*) as count 
        FROM documents 
        WHERE status = 'processed' 
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
      WHERE a.user_id = ${userId}
      ORDER BY a.updated_at DESC
    `

    return NextResponse.json({
      success: true,
      agents: agents.map((agent) => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        status: agent.status,
        conversations: agent.conversations_count,
        lastActivity: new Date(agent.updated_at).toLocaleString("pt-BR"),
        knowledgeBaseSize: agent.documents_count,
        functionsCount: agent.functions_count,
        mcpToolsCount: 0, // MCP tools não implementado ainda
        analytics: {
          totalMessages: Math.floor(Math.random() * 1000),
          avgResponseTime: Number.parseFloat((Math.random() * 3 + 0.5).toFixed(1)),
          satisfactionRate: Number.parseFloat((Math.random() * 20 + 80).toFixed(1)),
          activeUsers: Math.floor(Math.random() * 50),
          popularTopics: ["Produtos", "Preços", "Suporte"],
          weeklyGrowth: Number.parseFloat((Math.random() * 20 - 5).toFixed(1)),
        },
        widgetConfig: {
          isPublished: agent.widget_published || false,
          embedCount: agent.widget_embed_count,
          lastEmbed: agent.last_embed,
        },
      })),
    })
  } catch (error) {
    console.error("Error fetching agents:", error)

    if (error instanceof Error && error.message.includes('relation "agents" does not exist')) {
      return NextResponse.json({
        success: true,
        agents: [],
        needsSetup: true,
        message: "Database tables need to be created. Please run the setup scripts.",
      })
    }

    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, userId = "user_1" } = await request.json()

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    const [agent] = await sql`
      INSERT INTO agents (name, description, user_id, status, color, system_prompt, personality)
      VALUES (
        ${name}, 
        ${description}, 
        ${userId}, 
        'active',
        '#3B82F6',
        ${`Você é ${name}, ${description}. Seja sempre útil, preciso e profissional em suas respostas.`},
        'Profissional e prestativo'
      )
      RETURNING *
    `

    // Create widget config for the new agent
    await sql`
      INSERT INTO widget_configs (agent_id, title, subtitle, welcome_message)
      VALUES (
        ${agent.id}, 
        ${name},
        'Como posso ajudar você?',
        ${`Olá! Sou ${name}. Como posso ajudar você hoje?`}
      )
    `

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        status: agent.status,
        conversations: 0,
        lastActivity: "Agora",
        knowledgeBaseSize: 0,
        functionsCount: 0,
        mcpToolsCount: 0,
        analytics: {
          totalMessages: 0,
          avgResponseTime: 0,
          satisfactionRate: 0,
          activeUsers: 0,
          popularTopics: [],
          weeklyGrowth: 0,
        },
        widgetConfig: {
          isPublished: false,
          embedCount: 0,
        },
      },
    })
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
  }
}
