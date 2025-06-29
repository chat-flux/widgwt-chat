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

async function runSQLFile(filePath) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }

  const sql = neon(process.env.DATABASE_URL)

  const fullPath = path.resolve(filePath)

  if (!fs.existsSync(fullPath)) {
    throw new Error(`SQL file not found: ${fullPath}`)
  }

  console.log(`📄 Running SQL file: ${fullPath}`)

  const sqlContent = fs.readFileSync(fullPath, "utf8")

  // For CREATE operations, execute as single statement
  if (sqlContent.includes("CREATE TABLE") || sqlContent.includes("CREATE FUNCTION")) {
    console.log("📊 Executing SQL schema file...")
    try {
      await sql`${sqlContent}`
      console.log("✅ SQL file executed successfully!")
    } catch (error) {
      console.error(`❌ Error executing SQL file: ${error.message}`)
      throw error
    }
    return
  }

  // For INSERT/UPDATE/DELETE operations, split into statements
  const statements = sqlContent
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0)

  console.log(`📊 Found ${statements.length} SQL statements to execute`)

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    const shortStatement = statement.length > 50 ? statement.substring(0, 47) + "..." : statement
    console.log(`  ${i + 1}/${statements.length}: ${shortStatement}`)

    try {
      await sql`${statement}`
    } catch (error) {
      console.error(`❌ Error executing statement ${i + 1}: ${error.message}`)
      console.error(`Statement: ${statement}`)
      throw error
    }
  }

  console.log("✅ SQL file executed successfully!")
}

// Run if called directly
if (require.main === module) {
  const filePath = process.argv[2]

  if (!filePath) {
    console.error("❌ Please provide a SQL file path")
    console.error("Usage: node run-sql.js <path-to-sql-file>")
    process.exit(1)
  }

  runSQLFile(filePath).catch((error) => {
    console.error("❌ Error running SQL file:", error.message)
    process.exit(1)
  })
}

module.exports = { runSQLFile }
