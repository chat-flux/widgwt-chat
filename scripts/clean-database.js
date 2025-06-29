const fs = require("fs")
const path = require("path")

// Load environment variables from .env file
function loadEnvFile() {
  const envPath = path.join(__dirname, "..", ".env")
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8")
    const lines = envContent.split("\n")

    lines.forEach((line) => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...valueParts] = trimmedLine.split("=")
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=")
          process.env[key.trim()] = value.trim()
        }
      }
    })
  }
}

// Load environment variables
loadEnvFile()

const { neon } = require("@neondatabase/serverless")

async function cleanDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }

  const sql = neon(process.env.DATABASE_URL)

  console.log("🧹 Starting database cleanup...")

  const cleanupStatements = [
    "DROP TABLE IF EXISTS function_calls CASCADE",
    "DROP TABLE IF EXISTS messages CASCADE",
    "DROP TABLE IF EXISTS conversations CASCADE",
    "DROP TABLE IF EXISTS widget_configs CASCADE",
    "DROP TABLE IF EXISTS documents CASCADE",
    "DROP TABLE IF EXISTS functions CASCADE",
    "DROP TABLE IF EXISTS agent_analytics CASCADE",
    "DROP TABLE IF EXISTS mcp_tools CASCADE",
    "DROP TABLE IF EXISTS agents CASCADE",
    "DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE",
  ]

  console.log(`📄 Executing ${cleanupStatements.length} cleanup statements...`)

  for (let i = 0; i < cleanupStatements.length; i++) {
    const statement = cleanupStatements[i]
    const shortStatement = statement.length > 50 ? statement.substring(0, 47) + "..." : statement
    console.log(`  ${i + 1}/${cleanupStatements.length}: ${shortStatement}`)

    try {
      await sql`${statement}`
    } catch (error) {
      // Ignore errors for objects that don't exist
      if (!error.message.includes("does not exist")) {
        console.error(`❌ Error executing statement ${i + 1}: ${error.message}`)
        throw error
      }
    }
  }

  console.log("✅ Database cleaned successfully!")
}

// Run cleanup if called directly
if (require.main === module) {
  cleanDatabase().catch((error) => {
    console.error("❌ Error cleaning database:", error.message)
    process.exit(1)
  })
}

module.exports = { cleanDatabase }
