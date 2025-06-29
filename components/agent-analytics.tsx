"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, MessageCircle, Clock, Users, Zap } from "lucide-react"

interface AgentAnalyticsProps {
  agentId: string
}

interface AnalyticsData {
  summary: {
    totalMessages: number
    totalConversations: number
    avgResponseTime: number
    avgSatisfaction: number
    activeUsers: number
  }
  dailyData: Array<{
    date: string
    conversations: number
    messages: number
    responseTime: number
    satisfaction: number
    activeUsers: number
  }>
  satisfactionDistribution: { [key: number]: number }
  popularTopics: Array<{
    topic: string
    count: number
    percentage: number
  }>
  sentimentAnalysis: {
    positive: number
    neutral: number
    negative: number
  }
  topQuestions: Array<{
    question: string
    count: number
  }>
  topFunctions: Array<{
    name: string
    usage: number
  }>
}

export function AgentAnalytics({ agentId }: AgentAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    loadAnalytics()
  }, [agentId, timeRange])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/agents/${agentId}/analytics?days=${timeRange.replace("d", "")}`)

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      } else {
        throw new Error("Failed to load analytics")
      }
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando analytics...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Dados não disponíveis</h3>
          <p className="text-gray-500">Não foi possível carregar os dados de analytics</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics do Agente
              </CardTitle>
              <CardDescription>Métricas detalhadas de performance e engajamento</CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Conversas</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary.totalConversations.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Baseado no período selecionado
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação Média</CardTitle>
            <Badge className="bg-green-100 text-green-800">{analytics.summary.avgSatisfaction}/5</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary.avgSatisfaction}</div>
            <div className="text-xs text-muted-foreground">
              {Object.values(analytics.satisfactionDistribution).reduce((a, b) => a + b, 0)} avaliações
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary.avgResponseTime.toFixed(1)}s</div>
            <div className="text-xs text-muted-foreground">Tempo médio de resposta</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary.activeUsers}</div>
            <div className="text-xs text-muted-foreground">No período selecionado</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Satisfação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.satisfactionDistribution)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([rating, count]) => {
                  const total = Object.values(analytics.satisfactionDistribution).reduce((a, b) => a + b, 0)
                  const percentage = total > 0 ? (count / total) * 100 : 0
                  return (
                    <div key={rating} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{rating} estrelas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Functions Mais Utilizadas</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topFunctions.length > 0 ? (
              <div className="space-y-3">
                {analytics.topFunctions.map((func, index) => (
                  <div key={func.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">{func.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <span className="text-sm text-gray-600">{func.usage}x</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Zap className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Nenhuma function utilizada ainda</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Topics and Questions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tópicos Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.popularTopics.map((topic) => (
                <div key={topic.topic} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{topic.topic}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${topic.percentage}%` }} />
                    </div>
                    <span className="text-sm text-gray-600">{topic.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topQuestions.map((question, index) => (
                <div key={question.question} className="flex items-start justify-between">
                  <span className="text-sm flex-1 mr-2">{question.question}</span>
                  <Badge variant="outline" className="text-xs">
                    {question.count}x
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Sentimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.sentimentAnalysis.positive}%</div>
              <div className="text-sm text-gray-600">Positivo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{analytics.sentimentAnalysis.neutral}%</div>
              <div className="text-sm text-gray-600">Neutro</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{analytics.sentimentAnalysis.negative}%</div>
              <div className="text-sm text-gray-600">Negativo</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
