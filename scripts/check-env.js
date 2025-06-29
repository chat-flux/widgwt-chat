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

function checkEnvironmentVariables() {
  console.log("🔍 Checking environment variables...")

  const requiredVars = ["DATABASE_URL", "OPENAI_API_KEY"]

  const optionalVars = [
    "KV_URL",
    "KV_REST_API_TOKEN",
    "KV_REST_API_URL",
    "POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
    "NEXT_PUBLIC_STACK_PROJECT_ID",
  ]

  let allGood = true

  console.log("\n📋 Required Environment Variables:")
  for (const varName of requiredVars) {
    const value = process.env[varName]
    if (value) {
      console.log(`  ✅ ${varName}: ${value.substring(0, 20)}...`)
    } else {
      console.log(`  ❌ ${varName}: NOT SET`)
      allGood = false
    }
  }

  console.log("\n📋 Optional Environment Variables:")
  for (const varName of optionalVars) {
    const value = process.env[varName]
    if (value) {
      console.log(`  ✅ ${varName}: ${value.substring(0, 20)}...`)
    } else {
      console.log(`  ⚠️  ${varName}: NOT SET`)
    }
  }

  console.log("\n" + "=".repeat(50))

  if (allGood) {
    console.log("🎉 All required environment variables are set!")
    console.log("✅ Your application should work correctly.")
  } else {
    console.log("❌ Some required environment variables are missing!")
    console.log("📝 Please check your .env file and add the missing variables.")
    process.exit(1)
  }

  // Test database connection if DATABASE_URL is available
  if (process.env.DATABASE_URL) {
    testDatabaseConnection()
  }
}

async function testDatabaseConnection() {
  try {
    console.log("\n🔗 Testing database connection...")

    const { neon } = require("@neondatabase/serverless")
    const sql = neon(process.env.DATABASE_URL)

    const result = await sql`SELECT 1 as test`

    if (result && result.length > 0) {
      console.log("✅ Database connection successful!")
    } else {
      console.log("⚠️  Database connection returned unexpected result")
    }
  } catch (error) {
    console.log("❌ Database connection failed:", error.message)
  }
}

checkEnvironmentVariables()
