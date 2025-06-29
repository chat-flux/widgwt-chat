"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, AlertCircle } from "lucide-react"

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [apiStatus, setApiStatus] = useState<"connected" | "error" | "checking">("checking")

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Verificar status da API
    checkApiStatus()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const checkApiStatus = async () => {
    try {
      const response = await fetch("/api/health", { method: "GET" })
      setApiStatus(response.ok ? "connected" : "error")
    } catch (error) {
      setApiStatus("error")
    }
  }

  if (!isOnline) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <WifiOff className="h-3 w-3" />
        Offline
      </Badge>
    )
  }

  if (apiStatus === "error") {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        API Error
      </Badge>
    )
  }

  if (apiStatus === "checking") {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        Verificando...
      </Badge>
    )
  }

  return (
    <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
      <Wifi className="h-3 w-3" />
      Conectado
    </Badge>
  )
}
