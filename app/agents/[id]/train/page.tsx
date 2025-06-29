"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, FileText, Brain, Zap } from "lucide-react"
import { DocumentUploader } from "@/components/document-uploader"
import { KnowledgeBase } from "@/components/knowledge-base"
import { FunctionsManager } from "@/components/functions-manager"
import { TrainingProgress } from "@/components/training-progress"

interface Agent {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  knowledgeBaseSize: number
  functionsCount: number
  lastTrained?: string
}

export default function AgentTrainingPage() {
  const params = useParams()
  const router = useRouter()
  const [agent, setAgent] = useState<Agent>({
    id: params.id as string,
    name: params.id === "1" ? "Assistente de Vendas" : "Suporte Técnico",
    description:
      params.id === "1" ? "Agente especializado em atendimento e vendas" : "Agente para resolver questões técnicas",
    status: "active",
    knowledgeBaseSize: 0,
    functionsCount: 0,
  })

  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push(`/agents/${agent.id}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Treinamento - {agent.name}</h1>
                  <p className="text-gray-600">Configure documentos, functions e conhecimento do agente</p>
                </div>
                <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                  {agent.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{agent.knowledgeBaseSize} documentos</Badge>
              <Badge variant="outline">{agent.functionsCount} functions</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Documentos</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Base de Conhecimento</span>
            </TabsTrigger>
            <TabsTrigger value="functions" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Functions</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Treinamento</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <DocumentUploader
              agentId={agent.id}
              onUploadComplete={(count) => setAgent({ ...agent, knowledgeBaseSize: count })}
            />
          </TabsContent>

          <TabsContent value="knowledge">
            <KnowledgeBase agentId={agent.id} />
          </TabsContent>

          <TabsContent value="functions">
            <FunctionsManager
              agentId={agent.id}
              onFunctionsChange={(count) => setAgent({ ...agent, functionsCount: count })}
            />
          </TabsContent>

          <TabsContent value="training">
            <TrainingProgress
              agentId={agent.id}
              isTraining={isTraining}
              progress={trainingProgress}
              onStartTraining={() => setIsTraining(true)}
              onTrainingComplete={() => {
                setIsTraining(false)
                setAgent({ ...agent, lastTrained: new Date().toISOString() })
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
