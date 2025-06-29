"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function TestOpenAIPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; response?: string } | null>(null)
  const [testPrompt, setTestPrompt] = useState("Olá! Como você está?")

  const testOpenAI = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: testPrompt,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: "OpenAI API funcionando perfeitamente!",
          response: data.response,
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Erro ao testar OpenAI API",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Erro de conexão com a API",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teste da OpenAI API</h1>
          <p className="text-gray-600">Verificar se a integração está funcionando corretamente</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Teste de Conexão</CardTitle>
            <CardDescription>Digite uma mensagem para testar a API da OpenAI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Mensagem de teste:</label>
              <Input
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="mt-1"
              />
            </div>

            <Button onClick={testOpenAI} disabled={isLoading || !testPrompt.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                "Testar OpenAI API"
              )}
            </Button>

            {result && (
              <div className="mt-6">
                <div
                  className={`p-4 rounded-lg ${
                    result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "Sucesso" : "Erro"}
                    </Badge>
                  </div>
                  <p className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                    {result.message}
                  </p>
                  {result.response && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-sm font-medium text-gray-700 mb-1">Resposta da IA:</p>
                      <p className="text-gray-900">{result.response}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Informações da API:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Chave OpenAI: Configurada ✅</p>
                <p>• Modelo: GPT-3.5-turbo</p>
                <p>• Endpoint: /api/test-openai</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
