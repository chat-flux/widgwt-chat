import { neon } from "@neondatabase/serverless"
import fs from "fs"
import path from "path"

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function executeSQL(filename, description) {
  console.log(`📄 ${description}...`)

  const sqlContent = fs.readFileSync(path.join(process.cwd(), "scripts", filename), "utf8")

  // Split SQL into individual statements
  const statements = sqlContent
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

  console.log(`  Executing ${statements.length} statements...`)

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    if (statement.trim()) {
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
}

async function verifyTables() {
  console.log("🔍 Verifying tables...")

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

    // Step 1: Clean existing database
    console.log("📄 Step 1: Cleaning existing database...")
    await executeSQL("000-clean-database.sql", "Cleaning database")
    console.log("✅ Database cleaned")

    // Step 2: Create tables
    console.log("📄 Step 2: Creating tables...")
    await executeSQL("001-create-tables.sql", "Creating tables")
    console.log("✅ Tables created")

    // Step 3: Seed data
    console.log("📄 Step 3: Seeding data...")
    await executeSQL("002-seed-data.sql", "Seeding data")
    console.log("✅ Data seeded")

    // Step 4: Verify
    const tableCount = await verifyTables()

    if (tableCount > 0) {
      console.log("🎉 Database reset completed successfully!")
    } else {
      console.log("⚠️  Warning: No tables found after reset")
    }
  } catch (error) {
    console.error("❌ Error during database reset:", error)
    process.exit(1)
  }
}

resetDatabase()
