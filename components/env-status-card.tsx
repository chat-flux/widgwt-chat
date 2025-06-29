"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Info } from "lucide-react"
import { getEnvStatus } from "@/lib/env-validation"

export function EnvStatusCard() {
  const [envStatus, setEnvStatus] = useState(getEnvStatus())

  useEffect(() => {
    const checkStatus = () => {
      setEnvStatus(getEnvStatus())
    }

    checkStatus()
    const interval = setInterval(checkStatus, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "local":
        return (
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
            📁 Local .env
          </Badge>
        )
      case "v0":
        return (
          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
            🚀 v0 Environment
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            ❓ Desconhecido
          </Badge>
        )
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {envStatus.overall.allConfigured ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              Status das Configurações
            </CardTitle>
            <CardDescription>Variáveis de ambiente detectadas automaticamente</CardDescription>
          </div>
          {envStatus.overall.source === "v0" && (
            <Badge className="bg-purple-100 text-purple-800">🚀 Usando v0 Environment</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* OpenAI */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${envStatus.openai.configured ? "bg-green-500" : "bg-red-500"}`} />
            <div>
              <p className="font-medium text-sm">OpenAI API</p>
              {envStatus.openai.configured && <p className="text-xs text-gray-500">{envStatus.openai.key}</p>}
            </div>
          </div>
          {envStatus.openai.configured && getSourceBadge(envStatus.openai.source)}
        </div>

        {/* Database */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${envStatus.database.configured ? "bg-green-500" : "bg-red-500"}`} />
            <div>
              <p className="font-medium text-sm">Database</p>
              {envStatus.database.configured && (
                <p className="text-xs text-gray-500 truncate max-w-48">{envStatus.database.url}</p>
              )}
            </div>
          </div>
          {envStatus.database.configured && getSourceBadge(envStatus.database.source)}
        </div>

        {/* Redis */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${envStatus.redis.configured ? "bg-green-500" : "bg-red-500"}`} />
            <div>
              <p className="font-medium text-sm">Redis/Cache</p>
              {envStatus.redis.configured && (
                <p className="text-xs text-gray-500 truncate max-w-48">{envStatus.redis.url}</p>
              )}
            </div>
          </div>
          {envStatus.redis.configured && getSourceBadge(envStatus.redis.source)}
        </div>

        {/* Info sobre fallback */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Sistema Inteligente de Configuração</p>
            <p className="text-xs mt-1">
              A aplicação busca primeiro no arquivo .env local, e se não encontrar, utiliza automaticamente as variáveis
              de ambiente do v0.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
