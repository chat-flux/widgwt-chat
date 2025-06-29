"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Database, Key, Server, Copy, Eye, EyeOff, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchEnvStatus, type EnvStatus } from "@/lib/env-validation"

export function V0EnvDetector() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)
  const [showValues, setShowValues] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadEnvStatus()
  }, [])

  const loadEnvStatus = async () => {
    setIsLoading(true)
    try {
      const status = await fetchEnvStatus()
      setEnvStatus(status)
    } catch (error) {
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível verificar as variáveis de ambiente",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência`,
    })
  }

  const maskValue = (value: string) => {
    if (!showValues) {
      if (value.includes("://")) {
        const parts = value.split("://")
        return `${parts[0]}://***`
      }
      return `${value.substring(0, 8)}***`
    }
    return value
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2">Detectando variáveis do v0...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!envStatus) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erro ao carregar configurações</p>
            <Button onClick={loadEnvStatus} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Variáveis do v0 Detectadas
              </CardTitle>
              <CardDescription>Configurações automáticas disponíveis no ambiente v0</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowValues(!showValues)}>
                {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showValues ? "Ocultar" : "Mostrar"}
              </Button>
              <Button variant="outline" size="sm" onClick={loadEnvStatus}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OpenAI */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-blue-600" />
                <span className="font-medium">OpenAI API</span>
              </div>
              <Badge variant={envStatus.openai.configured ? "default" : "secondary"}>
                {envStatus.openai.configured ? "Disponível" : "Não configurado"}
              </Badge>
            </div>
            {envStatus.openai.configured && envStatus.openai.key ? (
              <div className="flex items-center justify-between">
                <code className="text-sm bg-white px-2 py-1 rounded">
                  OPENAI_API_KEY={maskValue(envStatus.openai.key)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(envStatus.openai.key!, "OpenAI API Key")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Adicione sua chave OpenAI nas configurações do projeto v0</p>
            )}
          </div>

          {/* Database */}
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-600" />
                <span className="font-medium">PostgreSQL Database</span>
              </div>
              <Badge variant={envStatus.database.configured ? "default" : "secondary"}>
                {envStatus.database.configured ? "Configurado" : "Não encontrado"}
              </Badge>
            </div>
            {envStatus.database.configured && envStatus.database.url ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <code className="text-sm bg-white px-2 py-1 rounded flex-1 mr-2">
                    DATABASE_URL={maskValue(envStatus.database.url)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(envStatus.database.url!, "Database URL")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {envStatus.database.available && (
                  <div className="text-xs text-gray-600">
                    <p>Variáveis disponíveis:</p>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {Object.entries(envStatus.database.available).map(([key, available]) => (
                        <span key={key} className={available ? "text-green-600" : "text-gray-400"}>
                          {available ? "✓" : "✗"} {key}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">Nenhuma variável de banco de dados encontrada</p>
            )}
          </div>

          {/* Redis/KV */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Redis/KV Storage</span>
              </div>
              <Badge variant={envStatus.redis.configured ? "default" : "secondary"}>
                {envStatus.redis.configured ? "Configurado" : "Não encontrado"}
              </Badge>
            </div>
            {envStatus.redis.configured && envStatus.redis.url ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <code className="text-sm bg-white px-2 py-1 rounded flex-1 mr-2">
                    REDIS_URL={maskValue(envStatus.redis.url)}
                  </code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(envStatus.redis.url!, "Redis URL")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {envStatus.redis.available && (
                  <div className="text-xs text-gray-600">
                    <p>Variáveis disponíveis:</p>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {Object.entries(envStatus.redis.available).map(([key, available]) => (
                        <span key={key} className={available ? "text-green-600" : "text-gray-400"}>
                          {available ? "✓" : "✗"} {key}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">Nenhuma variável de Redis/KV encontrada</p>
            )}
          </div>

          {/* Informações adicionais */}
          {envStatus.additional && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Variáveis Adicionais do v0:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(envStatus.additional).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={value ? "text-green-600" : "text-gray-400"}>{value ? "✓" : "✗"}</span>
                    <span className="text-gray-700">{key}</span>
                    {typeof value === "string" && value && (
                      <code className="text-xs bg-white px-1 rounded">{value}</code>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle>Como Usar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">1</span>
            </div>
            <div>
              <p className="font-medium">Configuração Automática</p>
              <p className="text-sm text-gray-600">O sistema detecta automaticamente as variáveis disponíveis no v0</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-green-600">2</span>
            </div>
            <div>
              <p className="font-medium">Sem Configuração Manual</p>
              <p className="text-sm text-gray-600">
                Não é necessário criar arquivo .env - tudo funciona automaticamente
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-purple-600">3</span>
            </div>
            <div>
              <p className="font-medium">Atualização em Tempo Real</p>
              <p className="text-sm text-gray-600">Use o botão de refresh para verificar mudanças nas configurações</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
