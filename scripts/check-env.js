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

// Required environment variables
const REQUIRED_VARS = ["DATABASE_URL", "OPENAI_API_KEY"]

// Optional environment variables
const OPTIONAL_VARS = [
  "KV_URL",
  "KV_REST_API_TOKEN",
  "KV_REST_API_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "NEXT_PUBLIC_STACK_PROJECT_ID",
]

function maskValue(value) {
  if (!value) return "Not set"
  if (value.length <= 8) return value
  return value.substring(0, 8) + "..."
}

function checkEnvironmentVariables() {
  console.log("🔍 Checking environment variables...")
  console.log()

  let allRequiredSet = true

  // Check required variables
  console.log("📋 Required Environment Variables:")
  REQUIRED_VARS.forEach((varName) => {
    const value = process.env[varName]
    const status = value ? "✅" : "❌"
    const maskedValue = value ? maskValue(value) : "Not set"

    console.log(`  ${status} ${varName}: ${maskedValue}`)

    if (!value) {
      allRequiredSet = false
    }
  })

  console.log()

  // Check optional variables
  console.log("📋 Optional Environment Variables:")
  OPTIONAL_VARS.forEach((varName) => {
    const value = process.env[varName]
    const status = value ? "✅" : "⚪"
    const maskedValue = value ? maskValue(value) : "Not set"

    console.log(`  ${status} ${varName}: ${maskedValue}`)
  })

  console.log()
  console.log("=".repeat(50))

  if (allRequiredSet) {
    console.log("🎉 All required environment variables are set!")
    console.log("✅ Your application should work correctly.")
  } else {
    console.log("❌ Some required environment variables are missing!")
    console.log("⚠️  Please check your .env file.")
    return false
  }

  return true
}

async function testDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    console.log("⚠️  Skipping database test - DATABASE_URL not set")
    return false
  }

  try {
    console.log("🔗 Testing database connection...")
    const sql = neon(process.env.DATABASE_URL)

    const result = await sql`SELECT 1 as test`

    if (result && result.length > 0) {
      console.log("✅ Database connection successful!")
      return true
    } else {
      console.log("❌ Database connection failed - no result")
      return false
    }
  } catch (error) {
    console.log(`❌ Database connection failed: ${error.message}`)
    return false
  }
}

async function main() {
  const envCheck = checkEnvironmentVariables()

  if (envCheck) {
    console.log()
    await testDatabaseConnection()
  }
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Error checking environment:", error.message)
    process.exit(1)
  })
}

module.exports = { checkEnvironmentVariables, testDatabaseConnection }
