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

function checkEnvironmentVariables() {
  console.log("🔍 Checking environment variables...\n")

  const requiredVars = ["DATABASE_URL", "OPENAI_API_KEY"]

  const optionalVars = [
    "KV_URL",
    "KV_REST_API_TOKEN",
    "KV_REST_API_URL",
    "POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
    "NEXT_PUBLIC_STACK_PROJECT_ID",
  ]

  console.log("📋 Required Environment Variables:\n")

  let allRequiredSet = true

  requiredVars.forEach((varName) => {
    const value = process.env[varName]
    if (value) {
      const maskedValue = value.length > 20 ? value.substring(0, 17) + "..." : value
      console.log(`  ✅ ${varName}: ${maskedValue}`)
    } else {
      console.log(`  ❌ ${varName}: Not set`)
      allRequiredSet = false
    }
  })

  console.log("\n📋 Optional Environment Variables:\n")

  optionalVars.forEach((varName) => {
    const value = process.env[varName]
    if (value) {
      const maskedValue = value.length > 20 ? value.substring(0, 17) + "..." : value
      console.log(`  ✅ ${varName}: ${maskedValue}`)
    } else {
      console.log(`  ⚠️  ${varName}: Not set`)
    }
  })

  console.log("\n" + "=".repeat(50))

  if (allRequiredSet) {
    console.log("\n🎉 All required environment variables are set!")
    console.log("✅ Your application should work correctly.")
  } else {
    console.log("\n❌ Some required environment variables are missing!")
    console.log("⚠️  Your application may not work correctly.")
  }

  return allRequiredSet
}

async function testDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    console.log("\n❌ Cannot test database connection: DATABASE_URL not set")
    return false
  }

  try {
    console.log("\n🔗 Testing database connection...")
    const sql = neon(process.env.DATABASE_URL)

    const result = await sql`SELECT 1 as test`

    if (result && result.length > 0 && result[0].test === 1) {
      console.log("✅ Database connection successful!")
      return true
    } else {
      console.log("❌ Database connection failed: Unexpected response")
      return false
    }
  } catch (error) {
    console.log(`❌ Database connection failed: ${error.message}`)
    return false
  }
}

// Run checks if called directly
if (require.main === module) {
  async function runChecks() {
    const envOk = checkEnvironmentVariables()

    if (envOk) {
      await testDatabaseConnection()
    }
  }

  runChecks().catch((error) => {
    console.error("❌ Error running checks:", error.message)
    process.exit(1)
  })
}

module.exports = { checkEnvironmentVariables, testDatabaseConnection }
