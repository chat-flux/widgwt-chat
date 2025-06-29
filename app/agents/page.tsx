"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Bot,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  MessageCircle,
  Settings,
  BookOpen,
  BarChart3,
  Star,
  Activity,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AgentAnalytics } from "@/components/agent-analytics"

interface Agent {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "training"
  conversations: number
  lastActivity: string
  assistantId?: string
  knowledgeBaseSize: number
  functionsCount: number
  mcpToolsCount: number
  analytics: {
    totalMessages: number
    avgResponseTime: number
    satisfactionRate: number
    activeUsers: number
    popularTopics: string[]
    weeklyGrowth: number
  }
  widgetConfig: {
    isPublished: boolean
    embedCount: number
    lastEmbed?: string
  }
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newAgent, setNewAgent] = useState({ name: "", description: "" })
  const [viewMode, setViewMode] = useState<"grid" | "analytics">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check authentication and onboarding
    const user = localStorage.getItem("user")
    const onboardingCompleted = localStorage.getItem("onboardingCompleted")

    if (!user) {
      router.push("/login")
    } else if (!onboardingCompleted) {
      router.push("/onboarding")
    } else {
      loadAgents()
    }
  }, [router])

  const loadAgents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/agents?userId=user_1")

      if (response.ok) {
        const data = await response.json()
        setAgents(data.agents)
      } else {
        throw new Error("Failed to load agents")
      }
    } catch (error) {
      console.error("Error loading agents:", error)
      toast({
        title: "Erro ao carregar agentes",
        description: "Não foi possível carregar a lista de agentes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateAgent = async () => {
    if (newAgent.name && newAgent.description) {
      try {
        const response = await fetch("/api/agents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newAgent.name,
            description: newAgent.description,
            userId: "user_1",
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setAgents([...agents, data.agent])
          setNewAgent({ name: "", description: "" })
          setIsCreateDialogOpen(false)
          toast({
            title: "Agente criado com sucesso!",
            description: `${data.agent.name} foi adicionado à sua lista de agentes.`,
          })
        } else {
          throw new Error("Failed to create agent")
        }
      } catch (error) {
        toast({
          title: "Erro ao criar agente",
          description: "Não foi possível criar o agente",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteAgent = async (agentId: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAgents(agents.filter((agent) => agent.id !== agentId))
        toast({
          title: "Agente removido",
          description: "O agente foi removido com sucesso.",
        })
      } else {
        throw new Error("Failed to delete agent")
      }
    } catch (error) {
      toast({
        title: "Erro ao remover agente",
        description: "Não foi possível remover o agente",
        variant: "destructive",
      })
    }
  }

  const toggleAgentStatus = async (agentId: string) => {
    try {
      const agent = agents.find((a) => a.id === agentId)
      if (!agent) return

      const newStatus = agent.status === "active" ? "inactive" : "active"

      const response = await fetch(`/api/agents/${agentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setAgents(agents.map((agent) => (agent.id === agentId ? { ...agent, status: newStatus } : agent)))
      } else {
        throw new Error("Failed to update agent status")
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do agente",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "training":
        return "bg-blue-100 text-blue-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Estatísticas gerais
  const totalAgents = agents.length
  const activeAgents = agents.filter((a) => a.status === "active").length
  const totalConversations = agents.reduce((sum, a) => sum + a.conversations, 0)
  const avgSatisfaction =
    agents.length > 0 ? agents.reduce((sum, a) => sum + a.analytics.satisfactionRate, 0) / agents.length : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meus Agentes</h1>
              <p className="text-gray-600">Gerencie seus agentes de IA e acompanhe performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <TabsList>
                  <TabsTrigger value="grid">Grade</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
              </Tabs>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Agente
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Agente</DialogTitle>
                    <DialogDescription>Preencha as informações básicas do seu agente de IA</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome do Agente</Label>
                      <Input
                        id="name"
                        placeholder="Ex: Assistente de Vendas"
                        value={newAgent.name}
                        onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        placeholder="Descreva a função e especialidade do agente..."
                        value={newAgent.description}
                        onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleCreateAgent} className="w-full">
                      Criar Agente
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Agentes</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAgents}</p>
                </div>
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Agentes Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{activeAgents}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversas Totais</p>
                  <p className="text-2xl font-bold text-purple-600">{totalConversations}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfação Média</p>
                  <p className="text-2xl font-bold text-yellow-600">{avgSatisfaction.toFixed(1)}%</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {viewMode === "analytics" ? (
          <AgentAnalytics agents={agents} />
        ) : (
          <>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar agentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Agents Grid */}
            {filteredAgents.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "Nenhum agente encontrado" : "Nenhum agente criado"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Tente ajustar sua busca ou criar um novo agente"
                    : "Comece criando seu primeiro agente de IA"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Agente
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAgents.map((agent) => (
                  <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Bot className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <div className="flex gap-2 mt-1">
                              <Badge className={getStatusColor(agent.status)}>
                                {agent.status === "active" && "Ativo"}
                                {agent.status === "inactive" && "Inativo"}
                                {agent.status === "training" && "Treinando"}
                              </Badge>
                              {agent.assistantId && <Badge className="bg-purple-100 text-purple-800">OpenAI</Badge>}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/agents/${agent.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleAgentStatus(agent.id)}>
                              <Settings className="h-4 w-4 mr-2" />
                              {agent.status === "active" ? "Desativar" : "Ativar"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteAgent(agent.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription>{agent.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Estatísticas principais */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Conversas</span>
                            <span className="font-medium">{agent.conversations}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Satisfação</span>
                            <span className="font-medium">{agent.analytics.satisfactionRate}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Documentos</span>
                            <span className="font-medium">{agent.knowledgeBaseSize}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">MCP Tools</span>
                            <span className="font-medium">{agent.mcpToolsCount}</span>
                          </div>
                        </div>

                        {/* Performance indicators */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Tempo de Resposta</span>
                          <span className="font-medium">{agent.analytics.avgResponseTime}s</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Crescimento Semanal</span>
                          <span
                            className={`font-medium ${
                              agent.analytics.weeklyGrowth > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {agent.analytics.weeklyGrowth > 0 ? "+" : ""}
                            {agent.analytics.weeklyGrowth}%
                          </span>
                        </div>

                        {/* Widget status */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Widget</span>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={agent.widgetConfig.isPublished ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {agent.widgetConfig.isPublished ? "Publicado" : "Rascunho"}
                            </Badge>
                            <span className="text-xs text-gray-500">{agent.widgetConfig.embedCount} embeds</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => router.push(`/agents/${agent.id}`)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => router.push(`/agents/${agent.id}?tab=training`)}
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            Treinar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/agents/${agent.id}?tab=analytics`)}
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
