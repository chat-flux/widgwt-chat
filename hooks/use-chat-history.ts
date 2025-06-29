"use client"

import { useState, useEffect } from "react"

export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  agentId: string
}

export function useChatHistory(agentId: string) {
  const [history, setHistory] = useState<ChatMessage[]>([])

  useEffect(() => {
    loadHistory()
  }, [agentId])

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem(`chat-history-${agentId}`)
      if (saved) {
        const parsedHistory = JSON.parse(saved).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setHistory(parsedHistory)
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error)
    }
  }

  const saveMessage = (message: ChatMessage) => {
    try {
      const newHistory = [...history, message]
      setHistory(newHistory)
      localStorage.setItem(`chat-history-${agentId}`, JSON.stringify(newHistory))
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error)
    }
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(`chat-history-${agentId}`)
  }

  const exportHistory = () => {
    const chatText = history
      .map((msg) => `[${msg.timestamp.toLocaleString()}] ${msg.role === "user" ? "Você" : "Bot"}: ${msg.content}`)
      .join("\n")

    const blob = new Blob([chatText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-${agentId}-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    history,
    saveMessage,
    clearHistory,
    exportHistory,
    totalMessages: history.length,
  }
}
