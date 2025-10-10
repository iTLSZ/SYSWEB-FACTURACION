import { LoginForm } from "@/components/login-form"
import { LiveClock } from "@/components/live-clock"
import { SystemHeader } from "@/components/system-header"

export default function LoginPage() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#0d3a6b] via-[#134686] to-[#1A2A80] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#33A1E0]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <SystemHeader />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 overflow-y-auto">
        <div className="w-full max-w-md lg:max-w-lg">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 sm:w-64 sm:h-64 bg-[#33A1E0] rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          <div className="relative z-10 space-y-4 sm:space-y-6 lg:space-y-4">
            {/* Logo */}
            <div className="flex justify-center mb-3 sm:mb-4 lg:mb-3">
              <div className="w-full max-w-[280px] sm:max-w-[350px] lg:max-w-[320px] drop-shadow-2xl transition-transform duration-300 hover:scale-105">
                <img
                  src="/copetran-logo-white.png"
                  alt="Copetran SYSWEB Facturación Logo"
                  className="w-full h-auto object-contain filter brightness-0 invert"
                />
              </div>
            </div>

            {/* Login Form */}
            <div className="w-full">
              <LoginForm />
            </div>

            {/* Clock and Date */}
            <div className="pt-2 sm:pt-3 lg:pt-2">
              <LiveClock />
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#0d3a6b]/80 backdrop-blur-sm border-t border-white/10 py-2 sm:py-3 lg:py-2 relative z-10 flex-shrink-0">
        <div className="text-center space-y-1">
          <p className="text-white/90 text-xs sm:text-sm font-medium px-4">
            Powered by Copetran ©2025 – Derechos reservados
          </p>
          <p className="text-white/70 text-[10px] sm:text-xs px-4">Desarrollador - Ing Luis Lopez</p>
        </div>
      </footer>
    </div>
  )
}
