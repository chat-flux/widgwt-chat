const fs = require("fs")
const path = require("path")

// Load environment variables from .env file
function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env")
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8")
    const lines = envContent.split("\n")

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...valueParts] = trimmedLine.split("=")
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=")
          process.env[key] = value
        }
      }
    }
  }
}

// Load .env file first
loadEnvFile()

const { neon } = require("@neondatabase/serverless")

async function cleanDatabase() {
  try {
    console.log("🧹 Starting database cleanup...")

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set. Please check your .env file.")
    }

    const sql = neon(process.env.DATABASE_URL)

    // Read and execute the clean SQL file
    const cleanSqlPath = path.join(__dirname, "000-clean-database.sql")
    const cleanSql = fs.readFileSync(cleanSqlPath, "utf8")

    // Split SQL into individual statements and execute them
    const statements = cleanSql
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

    console.log(`📄 Executing ${statements.length} cleanup statements...`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      try {
        console.log(`  ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`)
        await sql.unsafe(statement)
      } catch (error) {
        // Ignore errors for objects that don't exist
        if (!error.message.includes("does not exist")) {
          console.warn(`⚠️  Warning: ${error.message}`)
        }
      }
    }

    console.log("✅ Database cleaned successfully!")
  } catch (error) {
    console.error("❌ Error cleaning database:", error.message)
    process.exit(1)
  }
}

cleanDatabase()
