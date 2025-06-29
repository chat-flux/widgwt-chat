const { neon } = require("@neondatabase/serverless")
const fs = require("fs")
const path = require("path")

async function runSqlFile(sqlFilePath) {
  try {
    console.log(`📄 Running SQL file: ${sqlFilePath}`)

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
    }

    const sql = neon(process.env.DATABASE_URL)

    // Check if file exists
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL file not found: ${sqlFilePath}`)
    }

    // Read SQL file
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8")

    // Split SQL into individual statements and execute them
    const statements = sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

    console.log(`📊 Found ${statements.length} SQL statements to execute`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`  ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`)
      await sql`${sql.unsafe(statement)}`
    }

    console.log("✅ SQL file executed successfully!")
  } catch (error) {
    console.error("❌ Error executing SQL file:", error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// Get SQL file path from command line arguments
const sqlFilePath = process.argv[2]

if (!sqlFilePath) {
  console.error("❌ Please provide a SQL file path as an argument")
  console.error("Usage: node run-sql.js <path-to-sql-file>")
  process.exit(1)
}

// Resolve relative path
const resolvedPath = path.resolve(sqlFilePath)
runSqlFile(resolvedPath)
