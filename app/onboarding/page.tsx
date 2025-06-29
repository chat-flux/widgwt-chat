"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Key, Database, Settings, ArrowRight, Zap, RefreshCw } from "lucide-react"
import { fetchEnvStatus, type EnvStatus } from "@/lib/env-validation"
import { V0EnvDetector } from "@/components/v0-env-detector"
import { ConfigReadyBanner } from "@/components/config-ready-banner"

const steps = [
  {
    id: 1,
    title: "OpenAI API Key",
    description: "Chave da API OpenAI para funcionalidades de IA",
    icon: Key,
    required: false,
    details: [
      "Opcional: Adicione nas configurações do projeto v0",
      "Necessário apenas para funcionalidades de chat",
      "Sem esta chave, outras funcionalidades continuam funcionando",
    ],
  },
  {
    id: 2,
    title: "Banco de Dados PostgreSQL",
    description: "Banco de dados para armazenar dados da aplicação",
    icon: Database,
    required: true,
    details: [
      "✅ Automaticamente configurado pelo v0",
      "✅ Múltiplas URLs disponíveis (pooled/unpooled)",
      "✅ Pronto para uso imediato",
    ],
  },
  {
    id: 3,
    title: "Redis/KV Storage",
    description: "Cache e armazenamento de sessões",
    icon: Settings,
    required: true,
    details: [
      "✅ KV Storage do Vercel configurado automaticamente",
      "✅ Redis URLs disponíveis para Celery",
      "✅ Tokens de acesso já configurados",
    ],
  },
]

export default function OnboardingPage() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [showV0Detector, setShowV0Detector] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    loadEnvStatus()
  }, [])

  const loadEnvStatus = async () => {
    setIsLoading(true)
    try {
      const status = await fetchEnvStatus()
      setEnvStatus(status)

      // Auto-complete steps based on env variables
      const autoCompleted: number[] = []

      // Step 1: OpenAI
      if (status.openai.configured) {
        autoCompleted.push(1)
      }

      // Step 2: Database
      if (status.database.configured) {
        autoCompleted.push(2)
      }

      // Step 3: Redis
      if (status.redis.configured) {
        autoCompleted.push(3)
      }

      setCompletedSteps(autoCompleted)
    } catch (error) {
      console.error("Erro ao carregar status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleStep = (stepId: number) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]))
  }

  // Pode prosseguir se pelo menos database e redis estiverem configurados
  const canProceed = completedSteps.includes(2) && completedSteps.includes(3)

  const handleContinue = () => {
    if (canProceed) {
      localStorage.setItem("onboardingCompleted", "true")
      router.push("/agents")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3">Verificando configurações do v0...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">Configuração Automática v0!</h1>
          </div>
          <p className="text-gray-600">Sua plataforma está sendo configurada automaticamente</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge className="bg-green-100 text-green-800">🚀 Detectando configurações do ambiente v0</Badge>
            <Button variant="outline" size="sm" onClick={loadEnvStatus}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Toggle para mostrar detector */}
        <div className="text-center mb-6">
          <Button variant="outline" onClick={() => setShowV0Detector(!showV0Detector)}>
            {showV0Detector ? "Ocultar" : "Ver"} Variáveis Detectadas
          </Button>
        </div>

        {/* Detector de variáveis v0 */}
        {showV0Detector && (
          <div className="mb-8">
            <V0EnvDetector />
          </div>
        )}

        {/* Banner de configuração completa */}
        {envStatus?.overall.allConfigured && (
          <div className="mb-8">
            <ConfigReadyBanner />
          </div>
        )}

        {/* Steps */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mb-8">
          {steps.map((step) => {
            const Icon = step.icon
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = currentStep === step.id

            return (
              <Card
                key={step.id}
                className={`cursor-pointer transition-all duration-200 ${
                  isCompleted
                    ? "ring-2 ring-green-500 bg-green-50"
                    : isCurrent
                      ? "ring-2 ring-blue-500"
                      : "hover:shadow-md"
                }`}
                onClick={() => setCurrentStep(step.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${isCompleted ? "bg-green-100" : "bg-blue-100"}`}>
                        <Icon className={`h-5 w-5 ${isCompleted ? "text-green-600" : "text-blue-600"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={isCompleted ? "default" : "secondary"}>
                            {step.required ? "Obrigatório" : "Opcional"}
                          </Badge>
                          {isCompleted && <Badge className="bg-green-100 text-green-800">✅ Configurado</Badge>}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!step.required) {
                          toggleStep(step.id)
                        }
                      }}
                      disabled={step.required}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                {currentStep === step.id && (
                  <CardContent>
                    <div className="space-y-4">
                      <ul className="space-y-2">
                        {step.details.map((detail, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{detail}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Status atual */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Status Atual:</h4>
                        {step.id === 1 && envStatus && (
                          <div className="text-sm space-y-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                envStatus.openai.configured
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {envStatus.openai.configured ? "✓ Configurado" : "⚠ Opcional"}
                            </span>
                            {envStatus.openai.configured ? (
                              <div className="mt-1">
                                <p className="text-xs text-gray-500">Chave: {envStatus.openai.key}</p>
                                <Badge variant="outline" className="text-xs">
                                  Fonte: {envStatus.openai.source === "v0" ? "Configurações v0" : "Arquivo local"}
                                </Badge>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500 mt-1">Chat será habilitado quando configurado</p>
                            )}
                          </div>
                        )}
                        {step.id === 2 && envStatus && (
                          <div className="text-sm space-y-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                envStatus.database.configured
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {envStatus.database.configured ? "✓ Configurado automaticamente" : "✗ Não encontrado"}
                            </span>
                            {envStatus.database.configured && (
                              <div className="mt-1">
                                <p className="text-xs text-gray-500 break-all">URL: {envStatus.database.url}</p>
                                <Badge variant="outline" className="text-xs">
                                  Fonte: {envStatus.database.source === "v0" ? "Ambiente v0" : "Configuração local"}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}
                        {step.id === 3 && envStatus && (
                          <div className="text-sm space-y-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                envStatus.redis.configured ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {envStatus.redis.configured ? "✓ Configurado automaticamente" : "✗ Não encontrado"}
                            </span>
                            {envStatus.redis.configured && (
                              <div className="mt-1">
                                <p className="text-xs text-gray-500">URL: {envStatus.redis.url}</p>
                                <Badge variant="outline" className="text-xs">
                                  Fonte: {envStatus.redis.source === "v0" ? "KV Storage v0" : "Redis local"}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Status geral */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="text-center">
              {canProceed ? (
                <div className="space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <h3 className="text-lg font-medium text-green-900">Configuração Completa!</h3>
                  <p className="text-green-700">Sua plataforma está pronta para uso com as configurações do v0</p>
                  {envStatus && !envStatus.openai.configured && (
                    <p className="text-sm text-yellow-700">
                      💡 Dica: Adicione uma chave OpenAI para habilitar o chat com IA
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                  <h3 className="text-lg font-medium text-gray-900">Detectando Configurações...</h3>
                  <p className="text-gray-600">Aguarde enquanto verificamos o ambiente v0</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Botão de continuar */}
        <div className="text-center">
          <Button onClick={handleContinue} disabled={!canProceed} size="lg" className="px-8">
            {canProceed ? "Continuar para o Dashboard" : "Aguardando configurações..."}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {!canProceed && (
            <p className="text-sm text-gray-500 mt-2">Aguardando detecção das configurações do ambiente v0</p>
          )}
        </div>
      </div>
    </div>
  )
}
