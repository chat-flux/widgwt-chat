"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bot, MessageCircle, BookOpen, Settings, Code, Zap, BarChart3 } from "lucide-react"
import { ChatInterface } from "@/components/chat-interface"
import { WidgetBuilder } from "@/components/widget-builder"
import { DocumentUploader } from "@/components/document-uploader"
import { FunctionsManager } from "@/components/functions-manager"
import { KnowledgeBase } from "@/components/knowledge-base"
import { TrainingProgress } from "@/components/training-progress"
import { AgentAnalytics } from "@/components/agent-analytics"
import { AgentSettings } from "@/components/agent-settings"
import { fetchEnvStatus, type EnvStatus } from "@/lib/env-validation"

interface Agent {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  conversations: number
  lastActivity: string
  systemPrompt: string
  personality: string
  color: string
  documentsCount: number
  functionsCount: number
}

export default function AgentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("conversations")
  const [agent, setAgent] = useState<Agent | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [envStatusResult, agentResult] = await Promise.all([fetchEnvStatus(), fetch(`/api/agents/${params.id}`)])

        setEnvStatus(envStatusResult)

        if (agentResult.ok) {
          const agentData = await agentResult.json()
          setAgent(agentData.agent)
        } else {
          throw new Error("Agent not found")
        }
      } catch (error) {
        console.error("Error loading data:", error)
        router.push("/agents")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id, router])

  const canUseChat = envStatus?.openai.configured || false

  const handleCountChange = (type: "documents" | "functions", count: number) => {
    if (agent) {
      setAgent({
        ...agent,
        [`${type}Count`]: count,
      })
    }
  }

  const handleAgentUpdate = (updatedAgent: Partial<Agent>) => {
    if (agent) {
      setAgent({ ...agent, ...updatedAgent })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Agente não encontrado</h1>
          <Button onClick={() => router.push("/agents")}>Voltar para Agentes</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/agents")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
                  <p className="text-gray-600">{agent.description}</p>
                </div>
                <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                  {agent.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
                {canUseChat && <Badge className="bg-green-100 text-green-800">Chat Habilitado</Badge>}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-600">{agent.documentsCount}</div>
                <div className="text-gray-500">Documentos</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-purple-600">{agent.functionsCount}</div>
                <div className="text-gray-500">Functions</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-600">{agent.conversations}</div>
                <div className="text-gray-500">Conversas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="conversations" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Treinamento</span>
            </TabsTrigger>
            <TabsTrigger value="functions" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Functions</span>
            </TabsTrigger>
            <TabsTrigger value="widget" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Widget</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conversations" className="space-y-6">
            {canUseChat ? (
              <ChatInterface agentId={agent.id} agentName={agent.name} agentDescription={agent.description} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Chat Indisponível</CardTitle>
                  <CardDescription>Configure a chave da OpenAI para usar o chat</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 mb-4">
                      Para habilitar o chat, adicione a variável OPENAI_API_KEY nas configurações do projeto v0.
                    </p>
                    <Button onClick={() => router.push("/onboarding")}>Verificar Configurações</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <div className="grid gap-6">
              {/* Document Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload de Documentos</CardTitle>
                  <CardDescription>Faça upload de documentos para treinar seu agente</CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentUploader
                    agentId={agent.id}
                    onDocumentsChange={(count) => handleCountChange("documents", count)}
                  />
                </CardContent>
              </Card>

              {/* Knowledge Base */}
              <KnowledgeBase agentId={agent.id} />

              {/* Training Progress */}
              <TrainingProgress agentId={agent.id} />
            </div>
          </TabsContent>

          <TabsContent value="functions">
            <FunctionsManager agentId={agent.id} onFunctionsChange={(count) => handleCountChange("functions", count)} />
          </TabsContent>

          <TabsContent value="widget">
            <WidgetBuilder agent={agent} />
          </TabsContent>

          <TabsContent value="analytics">
            <AgentAnalytics agentId={agent.id} />
          </TabsContent>

          <TabsContent value="settings">
            <AgentSettings agent={agent} onAgentUpdate={handleAgentUpdate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
