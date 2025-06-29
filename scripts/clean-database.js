const { neon } = require("@neondatabase/serverless")
const fs = require("fs")
const path = require("path")

async function cleanDatabase() {
  try {
    console.log("🧹 Starting database cleanup...")

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
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

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      try {
        console.log(`  ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`)
        await sql`${sql.unsafe(statement)}`
      } catch (error) {
        // Ignore errors for objects that don't exist
        if (!error.message.includes("does not exist")) {
          console.warn(`Warning: ${error.message}`)
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
