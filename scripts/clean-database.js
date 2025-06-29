import { neon } from "@neondatabase/serverless"
import fs from "fs"
import path from "path"

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function cleanDatabase() {
  try {
    console.log("🧹 Starting database cleanup...")

    const cleanScript = fs.readFileSync(path.join(process.cwd(), "scripts", "000-clean-database.sql"), "utf8")

    // Split SQL into individual statements and filter out empty ones
    const statements = cleanScript
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

    console.log(`📄 Executing ${statements.length} cleanup statements...`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          console.log(`  ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`)
          await sql.unsafe(statement)
        } catch (error) {
          // Ignore errors for objects that don't exist
          if (!error.message.includes("does not exist")) {
            console.warn(`⚠️  Warning on statement ${i + 1}: ${error.message}`)
          }
        }
      }
    }

    console.log("✅ Database cleanup completed!")
  } catch (error) {
    console.error("❌ Error during database cleanup:", error)
    process.exit(1)
  }
}

cleanDatabase()
