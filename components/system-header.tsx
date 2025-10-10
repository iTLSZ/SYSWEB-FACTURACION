"use client"

import { Building2, Settings, HelpCircle } from "lucide-react"

export function SystemHeader() {
  return (
    <header className="w-full bg-gradient-to-r from-[#0d3a6b] via-[#134686] to-[#1A2A80] border-b border-white/10 shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left section - System branding */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-[#33A1E0]" />
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg tracking-wide">SYSWEB</span>
              <span className="text-[#33A1E0] text-xs font-medium">Sistema de Facturación</span>
            </div>
          </div>
        </div>

        {/* Right section - System info */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-white/80 text-sm">
            <span className="font-medium">COPETRAN</span>
            <span className="text-white/40">|</span>
            <span>Portal Administrativo</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Ayuda">
              <HelpCircle className="h-5 w-5 text-white/70 hover:text-white" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Configuración">
              <Settings className="h-5 w-5 text-white/70 hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
