"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, FileText, Trash2, Download, Eye, Brain } from "lucide-react"

interface Document {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedAt: string
  chunks: number
  embeddings: number
  status: "processing" | "processed" | "error"
}

interface KnowledgeBaseProps {
  agentId: string
}

export function KnowledgeBase({ agentId }: KnowledgeBaseProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadDocuments()
  }, [agentId])

  const loadDocuments = async () => {
    setIsLoading(true)
    try {
      // Simular carregamento de documentos
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Dados simulados
      const mockDocuments: Document[] = [
        {
          id: "1",
          fileName: "Manual_Vendas_2024.pdf",
          fileSize: 2048576,
          fileType: "application/pdf",
          uploadedAt: "2024-01-15T10:30:00Z",
          chunks: 45,
          embeddings: 45,
          status: "processed",
        },
        {
          id: "2",
          fileName: "FAQ_Produtos.txt",
          fileSize: 512000,
          fileType: "text/plain",
          uploadedAt: "2024-01-14T15:20:00Z",
          chunks: 23,
          embeddings: 23,
          status: "processed",
        },
        {
          id: "3",
          fileName: "Politicas_Empresa.docx",
          fileSize: 1024000,
          fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          uploadedAt: "2024-01-13T09:15:00Z",
          chunks: 32,
          embeddings: 32,
          status: "processed",
        },
      ]

      setDocuments(mockDocuments)
    } catch (error) {
      toast({
        title: "Erro ao carregar documentos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteDocument = async (documentId: string) => {
    try {
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
      toast({
        title: "Documento removido",
        description: "O documento foi removido da base de conhecimento",
      })
    } catch (error) {
      toast({
        title: "Erro ao remover documento",
        variant: "destructive",
      })
    }
  }

  const searchDocuments = async () => {
    if (!searchTerm.trim()) return

    try {
      // Simular busca semântica
      toast({
        title: "Busca realizada",
        description: `Encontrados resultados para "${searchTerm}"`,
      })
    } catch (error) {
      toast({
        title: "Erro na busca",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />
    if (type.includes("word")) return <FileText className="h-5 w-5 text-blue-500" />
    if (type.includes("text")) return <FileText className="h-5 w-5 text-gray-500" />
    return <FileText className="h-5 w-5 text-gray-500" />
  }

  const filteredDocuments = documents.filter((doc) => doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalChunks = documents.reduce((sum, doc) => sum + doc.chunks, 0)
  const totalEmbeddings = documents.reduce((sum, doc) => sum + doc.embeddings, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Base de Conhecimento
          </CardTitle>
          <CardDescription>Gerencie os documentos que alimentam o conhecimento do seu agente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{documents.length}</p>
              <p className="text-sm text-blue-800">Documentos</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{totalChunks}</p>
              <p className="text-sm text-green-800">Chunks</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{totalEmbeddings}</p>
              <p className="text-sm text-purple-800">Embeddings</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Buscar na base de conhecimento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchDocuments()}
              className="flex-1"
            />
            <Button onClick={searchDocuments}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Carregando documentos...</p>
          </CardContent>
        </Card>
      ) : filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "Nenhum documento encontrado" : "Nenhum documento na base"}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Tente ajustar sua busca ou adicionar novos documentos"
                : "Faça upload de documentos na aba 'Documentos' para começar"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0">{getFileIcon(doc.fileType)}</div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-lg mb-2">{doc.fileName}</h3>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Tamanho:</span> {formatFileSize(doc.fileSize)}
                        </div>
                        <div>
                          <span className="font-medium">Upload:</span> {new Date(doc.uploadedAt).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Chunks:</span> {doc.chunks}
                        </div>
                        <div>
                          <span className="font-medium">Embeddings:</span> {doc.embeddings}
                        </div>
                      </div>

                      <Badge variant={doc.status === "processed" ? "default" : "secondary"}>
                        {doc.status === "processed" ? "Processado" : "Processando"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteDocument(doc.id)}
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

      <Card>
        <CardHeader>
          <CardTitle>Como Funciona a Base de Conhecimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">1. Processamento</h3>
              <p className="text-sm text-gray-600">Documentos são divididos em chunks menores para melhor busca</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-2">2. Embeddings</h3>
              <p className="text-sm text-gray-600">Cada chunk é convertido em embeddings para busca semântica</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-2">3. Busca Inteligente</h3>
              <p className="text-sm text-gray-600">O agente encontra informações relevantes automaticamente</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
