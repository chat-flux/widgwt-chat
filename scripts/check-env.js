const fs = require("fs")
const path = require("path")

console.log("🔍 Verificando configurações do ambiente v0...\n")

// Verificar se .env existe
const envPath = path.join(process.cwd(), ".env")
const hasLocalEnv = fs.existsSync(envPath)

if (hasLocalEnv) {
  console.log("📁 Arquivo .env local encontrado")
  require("dotenv").config()
} else {
  console.log("🚀 Usando configurações do ambiente v0")
}

// Configurações detectadas
const configs = [
  {
    name: "OpenAI API",
    env: "OPENAI_API_KEY",
    value: process.env.OPENAI_API_KEY,
    required: false, // Mudando para true já que está configurado
    description: "✅ Configurado - Chat IA habilitado",
  },
  {
    name: "PostgreSQL Database",
    env: "DATABASE_URL / POSTGRES_URL",
    value: process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL,
    required: true,
    description: "Banco de dados principal da aplicação",
  },
  {
    name: "Redis/KV Storage",
    env: "REDIS_URL / KV_REST_API_URL",
    value: process.env.REDIS_URL || process.env.KV_REST_API_URL || process.env.KV_URL,
    required: true,
    description: "Cache e armazenamento de sessões",
  },
]

console.log("📋 Configurações Detectadas:\n")

let missingRequired = 0
let availableConfigs = 0

configs.forEach((config) => {
  const hasValue = !!config.value
  const source = hasValue ? (hasLocalEnv ? "📁 Local" : "🚀 v0") : "❌ Ausente"

  console.log(`${hasValue ? "✅" : "❌"} ${config.name}`)
  console.log(`   Variável: ${config.env}`)
  console.log(`   Status: ${hasValue ? "Configurado" : "Não configurado"}`)
  console.log(`   Fonte: ${source}`)
  console.log(`   Descrição: ${config.description}`)

  if (hasValue) {
    console.log(`   Valor: ${config.value.substring(0, 20)}...`)
    availableConfigs++
  }

  if (config.required && !hasValue) {
    missingRequired++
  }

  console.log("")
})

// Variáveis adicionais do v0
console.log("🔧 Variáveis Adicionais do v0:")
const additionalVars = [
  "POSTGRES_PRISMA_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
  "KV_REST_API_TOKEN",
  "KV_REST_API_READ_ONLY_TOKEN",
  "PGHOST",
  "PGUSER",
  "PGDATABASE",
]

additionalVars.forEach((varName) => {
  const value = process.env[varName]
  if (value) {
    console.log(`   ✅ ${varName}: ${value.substring(0, 15)}...`)
  }
})

console.log("\n📊 Resumo:")
console.log(`   Configurações disponíveis: ${availableConfigs}/${configs.length}`)
console.log(`   Configurações obrigatórias faltando: ${missingRequired}`)

if (missingRequired === 0) {
  console.log("\n🎉 Todas as configurações obrigatórias estão disponíveis!")
  console.log("🚀 Você pode executar: npm run dev")

  if (!configs[0].value) {
    console.log("\n💡 Dica: Adicione OPENAI_API_KEY para habilitar o chat IA")
  }
} else {
  console.log(`\n❌ ${missingRequired} configuração(ões) obrigatória(s) faltando`)
  console.log("📖 Verifique se está executando no ambiente v0 correto")
}

console.log("\n🔗 Ambiente detectado:", process.env.NODE_ENV || "development")
