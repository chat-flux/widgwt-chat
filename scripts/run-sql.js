import { neon } from "@neondatabase/serverless"
import fs from "fs"
import path from "path"

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function runSQL(filename) {
  try {
    console.log(`🔄 Running SQL file: ${filename}`)

    const filePath = path.resolve(filename)

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`)
      process.exit(1)
    }

    const sqlContent = fs.readFileSync(filePath, "utf8")

    // Split SQL into individual statements
    const statements = sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

    console.log(`📄 Executing ${statements.length} statements...`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          console.log(`  ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`)
          await sql.unsafe(statement)
        } catch (error) {
          console.error(`❌ Error on statement ${i + 1}:`, error.message)
          console.error(`Statement: ${statement}`)
          throw error
        }
      }
    }

    console.log("✅ SQL execution completed successfully!")
  } catch (error) {
    console.error("❌ Error running SQL:", error)
    process.exit(1)
  }
}

// Get filename from command line arguments
const filename = process.argv[2]

if (!filename) {
  console.error("❌ Please provide a SQL file path")
  console.log("Usage: node scripts/run-sql.js <path-to-sql-file>")
  process.exit(1)
}

runSQL(filename)
