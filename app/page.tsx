"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    const onboardingCompleted = localStorage.getItem("onboardingCompleted")

    if (!user) {
      router.push("/login")
    } else if (!onboardingCompleted) {
      router.push("/onboarding")
    } else {
      router.push("/agents")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
}
