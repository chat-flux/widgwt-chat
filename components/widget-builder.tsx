"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Code, Eye, Copy, Settings, MessageCircle, Mic, MicOff } from "lucide-react"

interface Agent {
  id: string
  name: string
  description: string
  color: string
}

interface WidgetConfig {
  title: string
  subtitle: string
  primaryColor: string
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  showAvatar: boolean
  enableVoice: boolean
  welcomeMessage: string
  placeholder: string
  height: number
  width: number
}

interface WidgetBuilderProps {
  agent: Agent
}

export function WidgetBuilder({ agent }: WidgetBuilderProps) {
  const [config, setConfig] = useState<WidgetConfig>({
    title: agent.name,
    subtitle: agent.description,
    primaryColor: agent.color,
    position: "bottom-right",
    showAvatar: true,
    enableVoice: false,
    welcomeMessage: `Olá! Sou ${agent.name}. Como posso ajudar você hoje?`,
    placeholder: "Digite sua mensagem...",
    height: 600,
    width: 400,
  })
  const [activeTab, setActiveTab] = useState("config")
  const [isSaving, setIsSaving] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadWidgetConfig()
  }, [agent.id])

  const loadWidgetConfig = async () => {
    try {
      const response = await fetch(`/api/agents/${agent.id}/widget-config`)
      if (response.ok) {
        const data = await response.json()
        if (data.config) {
          setConfig({ ...config, ...data.config })
        }
      }
    } catch (error) {
      console.error("Error loading widget config:", error)
    }
  }

  const saveConfig = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/agents/${agent.id}/widget-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        toast({
          title: "Configurações salvas!",
          description: "As configurações do widget foram atualizadas",
        })
      } else {
        throw new Error("Falha ao salvar configurações")
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações do widget",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const generateEmbedCode = () => {
    return `<!-- Widget do Agente ${agent.name} -->
<div id="ai-agent-widget-${agent.id}"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/widget.js';
    script.onload = function() {
      AIAgentWidget.init({
        agentId: '${agent.id}',
        apiUrl: '${window.location.origin}/api/widget-chat',
        config: ${JSON.stringify(config, null, 2)}
      });
    };
    document.head.appendChild(script);
  })();
</script>`
  }

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode())
    toast({
      title: "Código copiado!",
      description: "O código de incorporação foi copiado para a área de transferência",
    })
  }

  const colorOptions = [
    { value: "#3B82F6", name: "Azul", class: "bg-blue-500" },
    { value: "#10B981", name: "Verde", class: "bg-green-500" },
    { value: "#8B5CF6", name: "Roxo", class: "bg-purple-500" },
    { value: "#F59E0B", name: "Amarelo", class: "bg-yellow-500" },
    { value: "#EF4444", name: "Vermelho", class: "bg-red-500" },
    { value: "#6B7280", name: "Cinza", class: "bg-gray-500" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Widget Builder
          </CardTitle>
          <CardDescription>Configure e personalize o widget de chat para seu site</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="config">
                <Settings className="h-4 w-4 mr-2" />
                Configuração
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="embed">
                <Code className="h-4 w-4 mr-2" />
                Código
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título do Widget</Label>
                  <Input
                    id="title"
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtítulo</Label>
                  <Input
                    id="subtitle"
                    value={config.subtitle}
                    onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
                <Textarea
                  id="welcomeMessage"
                  value={config.welcomeMessage}
                  onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="placeholder">Placeholder do Input</Label>
                <Input
                  id="placeholder"
                  value={config.placeholder}
                  onChange={(e) => setConfig({ ...config, placeholder: e.target.value })}
                />
              </div>

              <div>
                <Label>Cor Primária</Label>
                <div className="flex gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setConfig({ ...config, primaryColor: color.value })}
                      className={`w-8 h-8 rounded-full ${color.class} ${
                        config.primaryColor === color.value ? "ring-2 ring-offset-2 ring-gray-400" : ""
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Posição na Tela</Label>
                  <select
                    id="position"
                    value={config.position}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        position: e.target.value as "bottom-right" | "bottom-left" | "top-right" | "top-left",
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="bottom-right">Inferior Direita</option>
                    <option value="bottom-left">Inferior Esquerda</option>
                    <option value="top-right">Superior Direita</option>
                    <option value="top-left">Superior Esquerda</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showAvatar">Mostrar Avatar</Label>
                    <Switch
                      id="showAvatar"
                      checked={config.showAvatar}
                      onCheckedChange={(checked) => setConfig({ ...config, showAvatar: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableVoice">Entrada de Voz</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Em Desenvolvimento
                      </Badge>
                      <Switch
                        id="enableVoice"
                        checked={config.enableVoice}
                        onCheckedChange={(checked) => setConfig({ ...config, enableVoice: checked })}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Largura (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={config.width}
                    onChange={(e) => setConfig({ ...config, width: Number.parseInt(e.target.value) || 400 })}
                    min="300"
                    max="600"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Altura (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={config.height}
                    onChange={(e) => setConfig({ ...config, height: Number.parseInt(e.target.value) || 600 })}
                    min="400"
                    max="800"
                  />
                </div>
              </div>

              <Button onClick={saveConfig} disabled={isSaving} className="w-full">
                {isSaving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </TabsContent>

            <TabsContent value="preview" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Preview do Widget</h3>
                  <Button variant="outline" onClick={() => setIsPreviewOpen(!isPreviewOpen)}>
                    {isPreviewOpen ? "Fechar Preview" : "Abrir Preview"}
                  </Button>
                </div>

                {isPreviewOpen && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div
                      className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
                      style={{
                        width: config.width,
                        height: config.height,
                        maxWidth: "100%",
                      }}
                    >
                      {/* Widget Header */}
                      <div className="p-4 text-white" style={{ backgroundColor: config.primaryColor }}>
                        <div className="flex items-center gap-3">
                          {config.showAvatar && (
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                              <MessageCircle className="h-4 w-4" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium">{config.title}</h4>
                            <p className="text-sm opacity-90">{config.subtitle}</p>
                          </div>
                        </div>
                      </div>

                      {/* Chat Area */}
                      <div className="flex-1 p-4 space-y-4" style={{ height: config.height - 140 }}>
                        <div className="flex items-start gap-2">
                          {config.showAvatar && (
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                              style={{ backgroundColor: config.primaryColor }}
                            >
                              AI
                            </div>
                          )}
                          <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                            <p className="text-sm">{config.welcomeMessage}</p>
                          </div>
                        </div>

                        <div className="text-center text-gray-500 text-sm">
                          <Badge variant="outline">Preview Mode</Badge>
                          <p className="mt-2">Este é apenas um preview visual do widget</p>
                        </div>
                      </div>

                      {/* Input Area */}
                      <div className="border-t p-4">
                        <div className="flex gap-2">
                          <Input placeholder={config.placeholder} disabled className="flex-1" />
                          {config.enableVoice ? (
                            <Button size="sm" variant="outline" disabled>
                              <Mic className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              <MicOff className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" style={{ backgroundColor: config.primaryColor }} disabled>
                            Enviar
                          </Button>
                        </div>
                        {config.enableVoice && (
                          <p className="text-xs text-gray-500 mt-2">⚠️ Entrada de voz em desenvolvimento</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-600 space-y-2">
                  <p>• O widget será posicionado no canto {config.position.replace("-", " ")} da tela</p>
                  <p>
                    • Dimensões: {config.width}px × {config.height}px
                  </p>
                  <p>• Cor primária: {config.primaryColor}</p>
                  <p>• Avatar: {config.showAvatar ? "Habilitado" : "Desabilitado"}</p>
                  <p>• Entrada de voz: {config.enableVoice ? "Habilitada (em desenvolvimento)" : "Desabilitada"}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="embed" className="mt-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Código de Incorporação</Label>
                    <Button variant="outline" size="sm" onClick={copyEmbedCode}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Código
                    </Button>
                  </div>
                  <Textarea value={generateEmbedCode()} readOnly rows={15} className="font-mono text-sm" />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Como usar:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Copie o código acima</li>
                    <li>2. Cole no HTML da sua página, antes do fechamento da tag &lt;/body&gt;</li>
                    <li>3. O widget aparecerá automaticamente na posição configurada</li>
                    <li>4. Os usuários poderão conversar com seu agente diretamente no site</li>
                  </ol>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-900 mb-2">Requisitos:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Seu site deve ter acesso à internet para carregar o widget</li>
                    <li>• O agente deve estar ativo para responder às mensagens</li>
                    <li>• Configure a chave OpenAI para habilitar as respostas</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
