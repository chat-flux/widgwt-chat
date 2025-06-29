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

async function resetDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }

  const sql = neon(process.env.DATABASE_URL)

  console.log("🔄 Starting complete database reset...")

  // Step 1: Clean database
  console.log("\n📄 Step 1: Cleaning existing database...")
  await cleanDatabase(sql)

  // Step 2: Create tables
  console.log("\n📄 Step 2: Creating tables...")
  await createTables(sql)

  // Step 3: Seed data
  console.log("\n📄 Step 3: Seeding data...")
  await seedData(sql)

  // Step 4: Verify tables
  console.log("\n🔍 Verifying tables...")
  await verifyTables(sql)

  console.log("\n🎉 Database reset completed successfully!")
}

async function cleanDatabase(sql) {
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

  console.log(`  Executing ${cleanupStatements.length} statements...`)

  for (let i = 0; i < cleanupStatements.length; i++) {
    const statement = cleanupStatements[i]
    const shortStatement = statement.length > 50 ? statement.substring(0, 47) + "..." : statement
    console.log(`  ${i + 1}/${cleanupStatements.length}: ${shortStatement}`)

    try {
      await sql`${statement}`
    } catch (error) {
      // Ignore errors for objects that don't exist
      if (!error.message.includes("does not exist")) {
        throw error
      }
    }
  }

  console.log("✅ Database cleaned")
}

async function createTables(sql) {
  const createTablesPath = path.join(__dirname, "001-create-tables.sql")
  const createTablesSQL = fs.readFileSync(createTablesPath, "utf8")

  // Execute the entire SQL file as one statement for CREATE operations
  console.log("  Creating database schema...")

  try {
    await sql`${createTablesSQL}`
    console.log("✅ Tables created")
  } catch (error) {
    console.error(`❌ Error creating tables: ${error.message}`)
    throw error
  }
}

async function seedData(sql) {
  const seedDataPath = path.join(__dirname, "002-seed-data.sql")
  const seedDataSQL = fs.readFileSync(seedDataPath, "utf8")

  // Split into individual INSERT statements for better error handling
  const statements = seedDataSQL
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0 && stmt.toUpperCase().startsWith("INSERT"))

  console.log(`  Executing ${statements.length} statements...`)

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    const shortStatement = statement.length > 50 ? statement.substring(0, 47) + "..." : statement
    console.log(`  ${i + 1}/${statements.length}: ${shortStatement}`)

    try {
      await sql`${statement}`
    } catch (error) {
      console.error(`❌ Error executing statement ${i + 1}: ${error.message}`)
      throw error
    }
  }

  console.log("✅ Data seeded")
}

async function verifyTables(sql) {
  try {
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

    console.log(`📊 Total tables created: ${tables.length}`)
  } catch (error) {
    console.error("❌ Error verifying tables:", error.message)
  }
}

// Run reset if called directly
if (require.main === module) {
  resetDatabase().catch((error) => {
    console.error("❌ Error resetting database:", error.message)
    process.exit(1)
  })
}

module.exports = { resetDatabase }
