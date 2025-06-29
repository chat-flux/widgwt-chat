"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { MessageCircle, Users, Clock, Star, Activity, ThumbsUp, ThumbsDown, Minus } from "lucide-react"

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
  topTools: Array<{
    name: string
    usage: number
  }>
  topFunctions: Array<{
    name: string
    usage: number
  }>
}

export default function AgentAnalyticsPage() {
  const params = useParams()
  const agentId = params.id as string
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7")

  useEffect(() => {
    loadAnalytics()
  }, [agentId, timeRange])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/agents/${agentId}/analytics?days=${timeRange}`)

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar analytics</h3>
          <p className="text-gray-500">Não foi possível carregar os dados de analytics</p>
        </div>
      </div>
    )
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics do Agente</h1>
              <p className="text-gray-600">Métricas detalhadas de performance e engajamento</p>
            </div>
            <div className="flex items-center space-x-4">
              <Tabs value={timeRange} onValueChange={setTimeRange}>
                <TabsList>
                  <TabsTrigger value="7">7 dias</TabsTrigger>
                  <TabsTrigger value="30">30 dias</TabsTrigger>
                  <TabsTrigger value="90">90 dias</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mensagens</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.summary.totalMessages}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfação</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.summary.avgSatisfaction}/5</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-purple-600">{analytics.summary.activeUsers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo Resposta</p>
                  <p className="text-2xl font-bold text-orange-600">{analytics.summary.avgResponseTime}s</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversas</p>
                  <p className="text-2xl font-bold text-indigo-600">{analytics.summary.totalConversations}</p>
                </div>
                <Activity className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Daily Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Diária</CardTitle>
              <CardDescription>Conversas e mensagens por dia</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversations" stroke="#8884d8" name="Conversas" />
                  <Line type="monotone" dataKey="messages" stroke="#82ca9d" name="Mensagens" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Satisfaction Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Satisfação</CardTitle>
              <CardDescription>Avaliações dos usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(analytics.satisfactionDistribution).map(([rating, count]) => ({
                    rating: `${rating} estrelas`,
                    count,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Topics and Sentiment */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Popular Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Tópicos Populares</CardTitle>
              <CardDescription>Assuntos mais discutidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.popularTopics.map((topic, index) => (
                  <div key={topic.topic} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">{topic.topic}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress value={topic.percentage} className="w-20" />
                      <span className="text-sm text-gray-500">{topic.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Análise de Sentimento</CardTitle>
              <CardDescription>Distribuição emocional das conversas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    <span>Positivo</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress value={analytics.sentimentAnalysis.positive} className="w-20" />
                    <span className="text-sm font-medium">{analytics.sentimentAnalysis.positive}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Minus className="h-4 w-4 text-gray-600" />
                    <span>Neutro</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress value={analytics.sentimentAnalysis.neutral} className="w-20" />
                    <span className="text-sm font-medium">{analytics.sentimentAnalysis.neutral}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ThumbsDown className="h-4 w-4 text-red-600" />
                    <span>Negativo</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress value={analytics.sentimentAnalysis.negative} className="w-20" />
                    <span className="text-sm font-medium">{analytics.sentimentAnalysis.negative}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Top Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>Questões mais comuns dos usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topQuestions.map((question, index) => (
                  <div key={question.question} className="flex items-start space-x-3">
                    <Badge variant="outline" className="mt-1">
                      {index + 1}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{question.question}</p>
                      <p className="text-xs text-gray-500">{question.count} vezes</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Tools */}
          <Card>
            <CardHeader>
              <CardTitle>MCP Tools Mais Usadas</CardTitle>
              <CardDescription>Ferramentas mais utilizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topTools.map((tool, index) => (
                  <div key={tool.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="text-sm font-medium">{tool.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{tool.usage}x</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Functions */}
          <Card>
            <CardHeader>
              <CardTitle>Functions Mais Usadas</CardTitle>
              <CardDescription>Funções customizadas mais executadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topFunctions.map((func, index) => (
                  <div key={func.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="text-sm font-medium">{func.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{func.usage}x</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
