"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap, Database, Key, Server } from "lucide-react"
import { fetchEnvStatus, type EnvStatus } from "@/lib/env-validation"

export function ConfigReadyBanner() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const status = await fetchEnvStatus()
        setEnvStatus(status)
      } catch (error) {
        console.error("Erro ao carregar status:", error)
      }
    }

    loadStatus()
    const interval = setInterval(loadStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  const allReady = envStatus?.overall.allConfigured

  if (!allReady) return null

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Configuração Completa!
              </h3>
              <p className="text-green-700">Todas as configurações estão prontas para uso</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="grid grid-cols-3 gap-2">
              <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                <Key className="h-3 w-3" />
                OpenAI
              </Badge>
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <Database className="h-3 w-3" />
                PostgreSQL
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                <Server className="h-3 w-3" />
                Redis/KV
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-800">Chat IA Habilitado</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-800">Banco de Dados Conectado</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-800">Cache Configurado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
