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

async function executeSQL(filename, description) {
  console.log(`📄 ${description}...`)

  const sqlContent = fs.readFileSync(path.join(__dirname, filename), "utf8")

  // Split SQL into individual statements
  const statements = sqlContent
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

  console.log(`  Executing ${statements.length} statements...`)

  const sql = neon(process.env.DATABASE_URL)

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    try {
      console.log(`  ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`)
      await sql.unsafe(statement)
    } catch (error) {
      if (filename === "000-clean-database.sql" && error.message.includes("does not exist")) {
        // Ignore "does not exist" errors during cleanup
        continue
      }
      console.error(`❌ Error on statement ${i + 1}:`, error.message)
      console.error(`Statement: ${statement}`)
      throw error
    }
  }
}

async function verifyTables() {
  console.log("🔍 Verifying tables...")

  const sql = neon(process.env.DATABASE_URL)
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `

  console.log("📋 Created tables:")
  tables.forEach((table) => {
    console.log(`  ✓ ${table.table_name}`)
  })

  return tables.length
}

async function resetDatabase() {
  try {
    console.log("🔄 Starting complete database reset...")

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set. Please check your .env file.")
    }

    // Step 1: Clean existing database
    await executeSQL("000-clean-database.sql", "Step 1: Cleaning existing database")
    console.log("✅ Database cleaned")

    // Step 2: Create tables
    await executeSQL("001-create-tables.sql", "Step 2: Creating tables")
    console.log("✅ Tables created")

    // Step 3: Seed data
    await executeSQL("002-seed-data.sql", "Step 3: Seeding data")
    console.log("✅ Data seeded")

    // Step 4: Verify
    const tableCount = await verifyTables()

    if (tableCount > 0) {
      console.log("🎉 Database reset completed successfully!")
      console.log(`📊 Total tables created: ${tableCount}`)
    } else {
      console.log("⚠️  Warning: No tables found after reset")
    }
  } catch (error) {
    console.error("❌ Error during database reset:", error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

resetDatabase()
