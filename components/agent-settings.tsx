"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Settings, Save, Trash2, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Agent {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  systemPrompt: string
  personality: string
  color: string
  conversations: number
  documentsCount: number
  functionsCount: number
}

interface AgentSettingsProps {
  agent: Agent
  onAgentUpdate: (updatedAgent: Partial<Agent>) => void
}

export function AgentSettings({ agent, onAgentUpdate }: AgentSettingsProps) {
  const [formData, setFormData] = useState({
    name: agent.name,
    description: agent.description,
    systemPrompt: agent.systemPrompt,
    personality: agent.personality,
    color: agent.color,
    status: agent.status,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          system_prompt: formData.systemPrompt,
          personality: formData.personality,
          color: formData.color,
          status: formData.status,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        onAgentUpdate(data.agent)

        toast({
          title: "Configurações salvas!",
          description: "As configurações do agente foram atualizadas com sucesso",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha ao salvar configurações")
      }
    } catch (error) {
      console.error("Error updating agent:", error)
      toast({
        title: "Erro ao salvar configurações",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Agente excluído!",
          description: "O agente foi removido permanentemente",
        })
        // Redirect to agents list
        window.location.href = "/agents"
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha ao excluir agente")
      }
    } catch (error) {
      toast({
        title: "Erro ao excluir agente",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
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
            <Settings className="h-5 w-5" />
            Configurações do Agente
          </CardTitle>
          <CardDescription>Personalize o comportamento e aparência do seu agente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Agente</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do agente"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do agente"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="systemPrompt">Prompt do Sistema</Label>
            <Textarea
              id="systemPrompt"
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              placeholder="Instruções detalhadas para o comportamento do agente..."
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="personality">Personalidade</Label>
            <Input
              id="personality"
              value={formData.personality}
              onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              placeholder="Ex: Amigável e prestativo"
            />
          </div>

          <div>
            <Label>Cor do Agente</Label>
            <div className="flex gap-2 mt-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-8 h-8 rounded-full ${color.class} ${
                    formData.color === color.value ? "ring-2 ring-offset-2 ring-gray-400" : ""
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas do Agente</CardTitle>
          <CardDescription>Métricas de uso e performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{agent.conversations}</div>
              <div className="text-sm text-blue-700">Conversas</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{agent.documentsCount}</div>
              <div className="text-sm text-green-700">Documentos</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{agent.functionsCount}</div>
              <div className="text-sm text-purple-700">Functions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>Ações irreversíveis que afetam permanentemente o agente</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Agente Permanentemente
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza que deseja excluir este agente?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente o agente "{agent.name}" e todos os
                  dados associados, incluindo:
                  <br />
                  <br />• {agent.conversations} conversas
                  <br />• {agent.documentsCount} documentos
                  <br />• {agent.functionsCount} functions personalizadas
                  <br />• Configurações do widget
                  <br />• Histórico de treinamento
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                  {isDeleting ? "Excluindo..." : "Sim, excluir permanentemente"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
