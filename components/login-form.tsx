"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { User, Lock, Loader2, CheckCircle, XCircle } from "lucide-react"

interface AuthResponse {
  success: boolean
  message: string
  data?: any
}

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    setMessageType("")

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      })

      const data: AuthResponse = await response.json()

      if (data.success) {
        setMessage(data.message)
        setMessageType("success")
        // Aquí puedes redirigir al usuario o realizar otras acciones después del login exitoso
        console.log("Login exitoso:", data)
        
        // Opcional: Redirigir después de un delay
        setTimeout(() => {
          // window.location.href = '/dashboard' // Descomenta si tienes una página de dashboard
        }, 2000)
      } else {
        setMessage(data.message)
        setMessageType("error")
      }
    } catch (error) {
      console.error('Error en el login:', error)
      setMessage("Error de conexión. Por favor, intenta nuevamente.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-white/98 backdrop-blur-md shadow-2xl rounded-2xl sm:rounded-3xl border border-white/20 overflow-hidden w-full max-w-md mx-auto transition-all duration-300 hover:shadow-[0_20px_60px_rgba(19,70,134,0.3)]">
      <CardContent className="p-6 sm:p-8 md:p-10">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#134686] mb-2 sm:mb-3 tracking-tight">
            BIENVENIDO
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#134686]/70 font-light">Ingresa tus credenciales</p>
        </div>

        <form onSubmit={handleSubmit} className="sm:space-y-3 tracking-normal leading-3 border-0 py-0 px-0">
          {/* Mensaje de estado */}
          {message && (
            <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
              messageType === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {messageType === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          <div className="space-y-2">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#134686]/60 transition-all duration-200 group-focus-within:text-[#33A1E0] group-focus-within:scale-110" />
              <Input
                id="username"
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-12 pr-4 h-14 sm:h-16 border-2 border-gray-200/80 focus:border-[#33A1E0] focus:ring-4 focus:ring-[#33A1E0]/20 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 placeholder:text-gray-400 bg-gray-50/50 focus:bg-white hover:border-gray-300"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#134686]/60 transition-all duration-200 group-focus-within:text-[#33A1E0] group-focus-within:scale-110" />
              <Input
                id="password"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-4 h-14 sm:h-16 border-2 border-gray-200/80 focus:border-[#33A1E0] focus:ring-4 focus:ring-[#33A1E0]/20 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 placeholder:text-gray-400 bg-gray-50/50 focus:bg-white hover:border-gray-300"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-8 bg-gradient-to-r from-[#134686] via-[#1A2A80] to-[#134686] hover:from-[#1A2A80] hover:via-[#134686] hover:to-[#1A2A80] text-white font-bold text-base sm:text-lg md:text-xl rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] h-14 sm:h-16 w-full bg-[length:200%_100%] hover:bg-right disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verificando credenciales...
              </>
            ) : (
              "Ingresar Portal"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
