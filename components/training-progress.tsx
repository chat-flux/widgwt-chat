"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Brain, Play, Pause, CheckCircle, AlertCircle, FileText, Zap } from "lucide-react"

interface TrainingProgressProps {
  agentId: string
}

interface TrainingStatus {
  isTraining: boolean
  progress: number
  stage: string
  documentsProcessed: number
  totalDocuments: number
  functionsProcessed: number
  totalFunctions: number
  lastTraining?: string
  status: "idle" | "training" | "completed" | "error"
  error?: string
}

export function TrainingProgress({ agentId }: TrainingProgressProps) {
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>({
    isTraining: false,
    progress: 0,
    stage: "idle",
    documentsProcessed: 0,
    totalDocuments: 0,
    functionsProcessed: 0,
    totalFunctions: 0,
    status: "idle",
  })
  const [isStarting, setIsStarting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadTrainingStatus()
    const interval = setInterval(loadTrainingStatus, 2000) // Poll every 2 seconds
    return () => clearInterval(interval)
  }, [agentId])

  const loadTrainingStatus = async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/training-status`)
      if (response.ok) {
        const data = await response.json()
        setTrainingStatus(data.status)
      }
    } catch (error) {
      console.error("Error loading training status:", error)
    }
  }

  const startTraining = async () => {
    setIsStarting(true)
    try {
      const response = await fetch(`/api/agents/${agentId}/train`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Treinamento iniciado!",
          description: "O agente está sendo treinado com os documentos e functions disponíveis",
        })
        loadTrainingStatus()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha ao iniciar treinamento")
      }
    } catch (error) {
      toast({
        title: "Erro ao iniciar treinamento",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsStarting(false)
    }
  }

  const getStageDescription = (stage: string) => {
    switch (stage) {
      case "idle":
        return "Aguardando início do treinamento"
      case "analyzing_documents":
        return "Analisando documentos..."
      case "processing_functions":
        return "Processando functions..."
      case "building_knowledge":
        return "Construindo base de conhecimento..."
      case "optimizing":
        return "Otimizando modelo..."
      case "completed":
        return "Treinamento concluído com sucesso!"
      case "error":
        return "Erro durante o treinamento"
      default:
        return stage
    }
  }

  const getStatusIcon = () => {
    switch (trainingStatus.status) {
      case "training":
        return <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Brain className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = () => {
    switch (trainingStatus.status) {
      case "training":
        return <Badge className="bg-blue-100 text-blue-800">Treinando</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Erro</Badge>
      default:
        return <Badge variant="outline">Inativo</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Progresso do Treinamento
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>Acompanhe o progresso do treinamento do seu agente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Stage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{getStageDescription(trainingStatus.stage)}</span>
            <span className="text-sm text-gray-500">{trainingStatus.progress}%</span>
          </div>
          <Progress value={trainingStatus.progress} className="h-2" />
        </div>

        {/* Training Details */}
        {trainingStatus.isTraining && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Documentos</p>
                <p className="text-xs text-gray-600">
                  {trainingStatus.documentsProcessed} / {trainingStatus.totalDocuments}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <Zap className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Functions</p>
                <p className="text-xs text-gray-600">
                  {trainingStatus.functionsProcessed} / {trainingStatus.totalFunctions}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {trainingStatus.status === "error" && trainingStatus.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-900">Erro no Treinamento</span>
            </div>
            <p className="text-sm text-red-700">{trainingStatus.error}</p>
          </div>
        )}

        {/* Success Message */}
        {trainingStatus.status === "completed" && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-900">Treinamento Concluído</span>
            </div>
            <p className="text-sm text-green-700">Seu agente foi treinado com sucesso e está pronto para uso!</p>
            {trainingStatus.lastTraining && (
              <p className="text-xs text-green-600 mt-1">
                Último treinamento: {new Date(trainingStatus.lastTraining).toLocaleString("pt-BR")}
              </p>
            )}
          </div>
        )}

        {/* Training Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm font-medium text-gray-700">Total de Documentos</p>
            <p className="text-2xl font-bold text-blue-600">{trainingStatus.totalDocuments}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Total de Functions</p>
            <p className="text-2xl font-bold text-purple-600">{trainingStatus.totalFunctions}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          {!trainingStatus.isTraining ? (
            <Button onClick={startTraining} disabled={isStarting} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              {isStarting ? "Iniciando..." : "Iniciar Treinamento"}
            </Button>
          ) : (
            <Button variant="outline" disabled className="flex-1 bg-transparent">
              <Pause className="h-4 w-4 mr-2" />
              Treinamento em Andamento
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• O treinamento processa todos os documentos e functions do agente</p>
          <p>• O tempo de treinamento varia conforme a quantidade de dados</p>
          <p>• Você pode continuar usando outras funcionalidades durante o treinamento</p>
        </div>
      </CardContent>
    </Card>
  )
}
