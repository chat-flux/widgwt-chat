const { neon } = require("@neondatabase/serverless")
const fs = require("fs")
const path = require("path")

async function resetDatabase() {
  try {
    console.log("🔄 Starting complete database reset...")

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
    }

    const sql = neon(process.env.DATABASE_URL)

    // Step 1: Clean database
    console.log("📄 Step 1: Cleaning existing database...")
    const cleanSqlPath = path.join(__dirname, "000-clean-database.sql")
    const cleanSql = fs.readFileSync(cleanSqlPath, "utf8")

    const cleanStatements = cleanSql
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

    for (const statement of cleanStatements) {
      try {
        await sql`${sql.unsafe(statement)}`
      } catch (error) {
        // Ignore errors for objects that don't exist
        if (!error.message.includes("does not exist")) {
          console.warn(`Warning: ${error.message}`)
        }
      }
    }
    console.log("✅ Database cleaned")

    // Step 2: Create tables
    console.log("📄 Step 2: Creating tables...")
    const createSqlPath = path.join(__dirname, "001-create-tables.sql")
    const createSql = fs.readFileSync(createSqlPath, "utf8")

    const createStatements = createSql
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

    for (let i = 0; i < createStatements.length; i++) {
      const statement = createStatements[i]
      console.log(`  ${i + 1}/${createStatements.length}: ${statement.substring(0, 50)}...`)
      await sql`${sql.unsafe(statement)}`
    }
    console.log("✅ Tables created")

    // Step 3: Seed data
    console.log("📄 Step 3: Seeding data...")
    const seedSqlPath = path.join(__dirname, "002-seed-data.sql")
    const seedSql = fs.readFileSync(seedSqlPath, "utf8")

    const seedStatements = seedSql
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

    for (let i = 0; i < seedStatements.length; i++) {
      const statement = seedStatements[i]
      console.log(`  ${i + 1}/${seedStatements.length}: ${statement.substring(0, 50)}...`)
      await sql`${sql.unsafe(statement)}`
    }
    console.log("✅ Data seeded")

    // Step 4: Verify tables
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

    console.log("🎉 Database reset completed successfully!")
  } catch (error) {
    console.error("❌ Error resetting database:", error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

resetDatabase()
