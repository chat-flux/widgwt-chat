"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Zap, Edit, Trash2, Code, Database, Globe, Calculator } from "lucide-react"

interface FunctionDefinition {
  id: string
  name: string
  description: string
  category: "api" | "database" | "calculation" | "custom"
  parameters: {
    type: "object"
    properties: Record<
      string,
      {
        type: string
        description: string
        required?: boolean
      }
    >
    required: string[]
  }
  implementation: string
  enabled: boolean
  lastUsed?: string
  usageCount: number
}

interface FunctionsManagerProps {
  agentId: string
  onFunctionsChange: (count: number) => void
}

const FUNCTION_TEMPLATES = {
  weather: {
    name: "get_weather",
    description: "Obter informações meteorológicas para uma localização",
    category: "api" as const,
    parameters: {
      type: "object" as const,
      properties: {
        location: {
          type: "string",
          description: "Nome da cidade ou localização",
        },
        unit: {
          type: "string",
          description: "Unidade de temperatura (celsius ou fahrenheit)",
        },
      },
      required: ["location"],
    },
    implementation: `async function get_weather({ location, unit = "celsius" }) {
  // Implementação da API de clima
  const response = await fetch(\`https://api.weather.com/v1/current?location=\${location}&unit=\${unit}\`);
  const data = await response.json();
  return {
    location: data.location,
    temperature: data.temperature,
    condition: data.condition,
    humidity: data.humidity
  };
}`,
  },
  calculator: {
    name: "calculate",
    description: "Realizar cálculos matemáticos",
    category: "calculation" as const,
    parameters: {
      type: "object" as const,
      properties: {
        expression: {
          type: "string",
          description: "Expressão matemática para calcular",
        },
      },
      required: ["expression"],
    },
    implementation: `async function calculate({ expression }) {
  // Implementação segura de calculadora
  try {
    const result = eval(expression.replace(/[^0-9+\\-*/().\\s]/g, ''));
    return {
      expression,
      result,
      success: true
    };
  } catch (error) {
    return {
      expression,
      error: "Expressão inválida",
      success: false
    };
  }
}`,
  },
  database_query: {
    name: "query_database",
    description: "Consultar base de dados do cliente",
    category: "database" as const,
    parameters: {
      type: "object" as const,
      properties: {
        table: {
          type: "string",
          description: "Nome da tabela",
        },
        filters: {
          type: "object",
          description: "Filtros para a consulta",
        },
      },
      required: ["table"],
    },
    implementation: `async function query_database({ table, filters = {} }) {
  // Implementação de consulta ao banco
  const query = buildQuery(table, filters);
  const results = await database.query(query);
  return {
    table,
    count: results.length,
    data: results
  };
}`,
  },
}

const useTemplate = (templateKey: keyof typeof FUNCTION_TEMPLATES) => {
  const { toast } = useToast()
  const template = FUNCTION_TEMPLATES[templateKey]
  return {
    name: template.name,
    description: template.description,
    category: template.category,
    parameters: JSON.stringify(template.parameters, null, 2),
    implementation: template.implementation,
  }
}

export function FunctionsManager({ agentId, onFunctionsChange }: FunctionsManagerProps) {
  const [functions, setFunctions] = useState<FunctionDefinition[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingFunction, setEditingFunction] = useState<FunctionDefinition | null>(null)
  const [newFunction, setNewFunction] = useState({
    name: "",
    description: "",
    category: "custom" as const,
    parameters: "",
    implementation: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadFunctions()
  }, [agentId])

  const loadFunctions = async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/functions`)
      if (response.ok) {
        const data = await response.json()
        setFunctions(data.functions || [])
        onFunctionsChange(data.functions?.length || 0)
      }
    } catch (error) {
      console.error("Erro ao carregar functions:", error)
    }
  }

  const createFunction = async () => {
    try {
      let parameters
      try {
        parameters = JSON.parse(newFunction.parameters || '{"type":"object","properties":{},"required":[]}')
      } catch {
        toast({
          title: "Erro na definição",
          description: "Parâmetros devem estar em formato JSON válido",
          variant: "destructive",
        })
        return
      }

      const functionDef: Omit<FunctionDefinition, "id"> = {
        name: newFunction.name,
        description: newFunction.description,
        category: newFunction.category,
        parameters,
        implementation: newFunction.implementation,
        enabled: true,
        usageCount: 0,
      }

      const response = await fetch(`/api/agents/${agentId}/functions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(functionDef),
      })

      if (response.ok) {
        const result = await response.json()
        setFunctions((prev) => [...prev, result.function])
        setIsCreateDialogOpen(false)
        setNewFunction({
          name: "",
          description: "",
          category: "custom",
          parameters: "",
          implementation: "",
        })
        onFunctionsChange(functions.length + 1)
        toast({
          title: "Function criada!",
          description: `${functionDef.name} foi adicionada ao agente`,
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao criar function",
        description: "Verifique os dados e tente novamente",
        variant: "destructive",
      })
    }
  }

  const toggleFunction = async (functionId: string) => {
    try {
      const func = functions.find((f) => f.id === functionId)
      if (!func) return

      const response = await fetch(`/api/agents/${agentId}/functions/${functionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !func.enabled }),
      })

      if (response.ok) {
        setFunctions((prev) => prev.map((f) => (f.id === functionId ? { ...f, enabled: !f.enabled } : f)))
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar function",
        variant: "destructive",
      })
    }
  }

  const deleteFunction = async (functionId: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/functions/${functionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setFunctions((prev) => prev.filter((f) => f.id !== functionId))
        onFunctionsChange(functions.length - 1)
        toast({
          title: "Function removida",
          description: "A function foi removida do agente",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao remover function",
        variant: "destructive",
      })
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "api":
        return <Globe className="h-4 w-4" />
      case "database":
        return <Database className="h-4 w-4" />
      case "calculation":
        return <Calculator className="h-4 w-4" />
      default:
        return <Code className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "api":
        return "bg-blue-100 text-blue-800"
      case "database":
        return "bg-green-100 text-green-800"
      case "calculation":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                OpenAI Functions
              </CardTitle>
              <CardDescription>
                Configure functions personalizadas para expandir as capacidades do seu agente
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Function
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Nova Function</DialogTitle>
                  <DialogDescription>Defina uma function personalizada para seu agente usar</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Templates */}
                  <div>
                    <Label className="text-base font-medium">Templates Prontos</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {Object.entries(FUNCTION_TEMPLATES).map(([key, template]) => (
                        <Button
                          key={key}
                          variant="outline"
                          size="sm"
                          onClick={() => setNewFunction(useTemplate(key as keyof typeof FUNCTION_TEMPLATES))}
                          className="justify-start"
                        >
                          {getCategoryIcon(template.category)}
                          <span className="ml-2">{template.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome da Function</Label>
                      <Input
                        id="name"
                        value={newFunction.name}
                        onChange={(e) => setNewFunction({ ...newFunction, name: e.target.value })}
                        placeholder="ex: get_weather"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select
                        value={newFunction.category}
                        onValueChange={(value: any) => setNewFunction({ ...newFunction, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="api">API Externa</SelectItem>
                          <SelectItem value="database">Banco de Dados</SelectItem>
                          <SelectItem value="calculation">Cálculo</SelectItem>
                          <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={newFunction.description}
                      onChange={(e) => setNewFunction({ ...newFunction, description: e.target.value })}
                      placeholder="Descreva o que esta function faz"
                    />
                  </div>

                  <div>
                    <Label htmlFor="parameters">Parâmetros (JSON Schema)</Label>
                    <Textarea
                      id="parameters"
                      value={newFunction.parameters}
                      onChange={(e) => setNewFunction({ ...newFunction, parameters: e.target.value })}
                      placeholder='{"type":"object","properties":{"param1":{"type":"string","description":"Descrição"}},"required":["param1"]}'
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="implementation">Implementação (JavaScript)</Label>
                    <Textarea
                      id="implementation"
                      value={newFunction.implementation}
                      onChange={(e) => setNewFunction({ ...newFunction, implementation: e.target.value })}
                      placeholder="async function nome_da_function({ parametros }) { /* implementação */ }"
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </div>

                  <Button onClick={createFunction} className="w-full">
                    Criar Function
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Functions List */}
      {functions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma Function Configurada</h3>
            <p className="text-gray-500 mb-4">
              Functions permitem que seu agente execute ações específicas como consultar APIs, fazer cálculos ou acessar
              bases de dados.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Function
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {functions.map((func) => (
            <Card key={func.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(func.category)}
                        <h3 className="font-semibold text-lg">{func.name}</h3>
                      </div>
                      <Badge className={getCategoryColor(func.category)}>{func.category}</Badge>
                      <Badge variant={func.enabled ? "default" : "secondary"}>
                        {func.enabled ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-4">{func.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Parâmetros:</span>
                        <div className="mt-1">
                          {func.parameters.required.map((param) => (
                            <Badge key={param} variant="outline" className="mr-1 mb-1">
                              {param}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Uso:</span>
                        <p className="text-gray-500">
                          {func.usageCount} vezes
                          {func.lastUsed && ` • Último uso: ${new Date(func.lastUsed).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => toggleFunction(func.id)}>
                      {func.enabled ? "Desativar" : "Ativar"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingFunction(func)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteFunction(func.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Como Funcionam as OpenAI Functions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">O que são Functions?</h4>
              <p className="text-sm text-gray-600">
                Functions permitem que o modelo GPT execute código personalizado, consulte APIs externas, acesse bancos
                de dados e realize tarefas específicas baseadas no contexto da conversa.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Como Usar?</h4>
              <p className="text-sm text-gray-600">
                O agente automaticamente decide quando usar cada function baseado na conversa. Você só precisa definir
                os parâmetros e a implementação.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
