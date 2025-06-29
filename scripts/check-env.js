const fs = require("fs")
const path = require("path")

function checkEnvironmentVariables() {
  console.log("🔍 Checking environment variables...")

  const requiredVars = ["DATABASE_URL", "OPENAI_API_KEY"]

  const missingVars = []
  const presentVars = []

  requiredVars.forEach((varName) => {
    if (process.env[varName]) {
      presentVars.push(varName)
      console.log(`✅ ${varName}: Set`)
    } else {
      missingVars.push(varName)
      console.log(`❌ ${varName}: Missing`)
    }
  })

  console.log("\n📋 Summary:")
  console.log(`✅ Present: ${presentVars.length}/${requiredVars.length}`)
  console.log(`❌ Missing: ${missingVars.length}/${requiredVars.length}`)

  if (missingVars.length > 0) {
    console.log("\n🚨 Missing environment variables:")
    missingVars.forEach((varName) => {
      console.log(`  - ${varName}`)
    })

    console.log("\n💡 Please set these environment variables before running the application.")
    console.log("You can create a .env.local file in the project root with:")
    missingVars.forEach((varName) => {
      console.log(`${varName}=your_value_here`)
    })

    process.exit(1)
  } else {
    console.log("\n🎉 All required environment variables are set!")
  }
}

checkEnvironmentVariables()
