import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

const sql = neon(process.env.DATABASE_URL)

export { sql }

// Database types
export interface Agent {
  id: string
  name: string
  description: string | null
  status: "active" | "inactive" | "training"
  system_prompt: string | null
  personality: string | null
  color: string
  assistant_id: string | null
  created_at: string
  updated_at: string
  user_id: string | null
}

export interface McpTool {
  id: string
  agent_id: string
  tool_id: string
  name: string
  description: string | null
  category: string | null
  repository: string | null
  version: string | null
  config: any
  enabled: boolean
  installed_at: string
  last_used: string | null
  usage_count: number
}

export interface Document {
  id: string
  agent_id: string
  file_name: string
  file_path: string | null
  file_size: number | null
  file_type: string | null
  chunks: number
  embeddings: number
  status: "processing" | "processed" | "error"
  uploaded_at: string
  processed_at: string | null
}

export interface Function {
  id: string
  agent_id: string
  name: string
  description: string | null
  category: string
  parameters: any
  implementation: string
  enabled: boolean
  created_at: string
  updated_at: string
  last_used: string | null
  usage_count: number
}

export interface Conversation {
  id: string
  agent_id: string
  session_id: string | null
  user_id: string | null
  started_at: string
  ended_at: string | null
  message_count: number
  satisfaction_rating: number | null
  feedback: string | null
}

export interface AgentAnalytics {
  id: string
  agent_id: string
  date: string
  total_conversations: number
  total_messages: number
  avg_response_time: number | null
  avg_satisfaction: number | null
  active_users: number
  tools_usage: any
  created_at: string
}

export interface WidgetConfig {
  id: string
  agent_id: string
  is_published: boolean
  embed_count: number
  config: any
  last_embed: string | null
  created_at: string
  updated_at: string
}
