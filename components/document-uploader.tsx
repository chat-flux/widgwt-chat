"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, File, X, CheckCircle, AlertCircle, Brain } from "lucide-react"

interface DocumentUploaderProps {
  agentId: string
  onUploadComplete: (count: number) => void
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  error?: string
  chunks?: number
  embeddings?: number
}

export function DocumentUploader({ agentId, onUploadComplete }: DocumentUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }, [])

  const handleFiles = async (fileList: File[]) => {
    const validTypes = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/markdown",
    ]
    const maxSize = 10 * 1024 * 1024 // 10MB

    for (const file of fileList) {
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Tipo de arquivo não suportado",
          description: `${file.name} - Suportamos apenas PDF, TXT, DOCX e MD`,
          variant: "destructive",
        })
        continue
      }

      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} - Tamanho máximo: 10MB`,
          variant: "destructive",
        })
        continue
      }

      const uploadFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
      }

      setFiles((prev) => [...prev, uploadFile])
      await uploadDocument(file, uploadFile.id)
    }
  }

  const uploadDocument = async (file: File, fileId: string) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("agentId", agentId)

      // Simulate upload progress
      const updateProgress = (progress: number, status: UploadedFile["status"]) => {
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress, status } : f)))
      }

      updateProgress(20, "uploading")

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Falha no upload")
      }

      updateProgress(50, "processing")

      const result = await response.json()

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      updateProgress(100, "completed")

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                chunks: result.chunks,
                embeddings: result.embeddings,
              }
            : f,
        ),
      )

      toast({
        title: "Documento processado!",
        description: `${file.name} foi adicionado à base de conhecimento`,
      })

      // Update parent component
      const completedFiles = files.filter((f) => f.status === "completed").length + 1
      onUploadComplete(completedFiles)
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "error",
                error: error instanceof Error ? error.message : "Erro desconhecido",
              }
            : f,
        ),
      )

      toast({
        title: "Erro no upload",
        description: `Falha ao processar ${file.name}`,
        variant: "destructive",
      })
    }
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
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
    if (type.includes("text")) return <File className="h-5 w-5 text-gray-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Documentos
          </CardTitle>
          <CardDescription>
            Faça upload de documentos para treinar seu agente. Suportamos PDF, TXT, DOCX e MD (máx. 10MB cada)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Arraste arquivos aqui ou clique para selecionar</h3>
            <p className="text-gray-500 mb-4">PDF, TXT, DOCX, MD - Máximo 10MB por arquivo</p>
            <input
              type="file"
              multiple
              accept=".pdf,.txt,.docx,.md"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Selecionar Arquivos
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Arquivos em Processamento</CardTitle>
            <CardDescription>Acompanhe o progresso do upload e processamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">{getFileIcon(file.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            file.status === "completed"
                              ? "default"
                              : file.status === "error"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {file.status === "uploading" && "Enviando"}
                          {file.status === "processing" && "Processando"}
                          {file.status === "completed" && "Concluído"}
                          {file.status === "error" && "Erro"}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <span>{formatFileSize(file.size)}</span>
                      {file.status === "completed" && (
                        <span>
                          {file.chunks} chunks • {file.embeddings} embeddings
                        </span>
                      )}
                    </div>

                    {file.status !== "completed" && file.status !== "error" && (
                      <Progress value={file.progress} className="h-2" />
                    )}

                    {file.status === "error" && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{file.error}</span>
                      </div>
                    )}

                    {file.status === "completed" && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Documento processado e indexado</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Como Funciona o Processamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">1. Upload</h3>
              <p className="text-sm text-gray-600">Arquivo é enviado e validado</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-2">2. Processamento</h3>
              <p className="text-sm text-gray-600">Texto é extraído e dividido em chunks</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-2">3. Indexação</h3>
              <p className="text-sm text-gray-600">Embeddings são gerados para busca semântica</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
