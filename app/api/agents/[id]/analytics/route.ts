import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { sql } = await import("@/lib/database")
    const agentId = params.id

    // Get basic agent info
    const [agent] = await sql`
      SELECT id, name, created_at, status
      FROM agents 
      WHERE id = ${agentId}
    `

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Get conversation stats
    const [conversationStats] = await sql`
      SELECT 
        COUNT(*) as total_conversations,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as conversations_last_7_days,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as conversations_last_30_days
      FROM conversations 
      WHERE agent_id = ${agentId}
    `

    // Get message stats
    const [messageStats] = await sql`
      SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as user_messages,
        COUNT(CASE WHEN role = 'assistant' THEN 1 END) as assistant_messages,
        AVG(LENGTH(content)) as avg_message_length
      FROM messages m
      JOIN conversations c ON m.conversation_id = c.id
      WHERE c.agent_id = ${agentId}
    `

    // Get daily conversation data for the last 30 days
    const dailyConversations = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as conversations
      FROM conversations 
      WHERE agent_id = ${agentId}
        AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `

    // Get hourly distribution
    const hourlyDistribution = await sql`
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as conversations
      FROM conversations 
      WHERE agent_id = ${agentId}
        AND created_at >= NOW() - INTERVAL '7 days'
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `

    // Get function usage stats
    const functionStats = await sql`
      SELECT 
        f.name,
        COUNT(fc.id) as usage_count
      FROM functions f
      LEFT JOIN function_calls fc ON f.id = fc.function_id
      WHERE f.agent_id = ${agentId}
      GROUP BY f.id, f.name
      ORDER BY usage_count DESC
      LIMIT 10
    `

    // Get document stats
    const [documentStats] = await sql`
      SELECT 
        COUNT(*) as total_documents,
        SUM(file_size) as total_size,
        COUNT(CASE WHEN status = 'processed' THEN 1 END) as processed_documents
      FROM documents 
      WHERE agent_id = ${agentId}
    `

    // Calculate satisfaction rate (mock data for now)
    const satisfactionRate = Math.floor(Math.random() * 10) + 85 // 85-95%

    return NextResponse.json({
      success: true,
      analytics: {
        agent: {
          id: agent.id,
          name: agent.name,
          created_at: agent.created_at,
          status: agent.status,
        },
        conversations: {
          total: Number.parseInt(conversationStats?.total_conversations || "0"),
          last_7_days: Number.parseInt(conversationStats?.conversations_last_7_days || "0"),
          last_30_days: Number.parseInt(conversationStats?.conversations_last_30_days || "0"),
        },
        messages: {
          total: Number.parseInt(messageStats?.total_messages || "0"),
          user_messages: Number.parseInt(messageStats?.user_messages || "0"),
          assistant_messages: Number.parseInt(messageStats?.assistant_messages || "0"),
          avg_length: Math.round(Number.parseFloat(messageStats?.avg_message_length || "0")),
        },
        daily_conversations: dailyConversations.map((row) => ({
          date: row.date,
          conversations: Number.parseInt(row.conversations),
        })),
        hourly_distribution: hourlyDistribution.map((row) => ({
          hour: Number.parseInt(row.hour),
          conversations: Number.parseInt(row.conversations),
        })),
        functions: functionStats.map((row) => ({
          name: row.name,
          usage_count: Number.parseInt(row.usage_count),
        })),
        documents: {
          total: Number.parseInt(documentStats?.total_documents || "0"),
          total_size: Number.parseInt(documentStats?.total_size || "0"),
          processed: Number.parseInt(documentStats?.processed_documents || "0"),
        },
        satisfaction_rate: satisfactionRate,
      },
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 })
  }
}
