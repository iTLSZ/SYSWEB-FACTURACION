"use client"

import { useState, useEffect } from "react"

// Custom hook to handle hydration-safe client-only rendering
function useIsomorphicLayoutEffect(effect: () => void | (() => void), deps?: React.DependencyList) {
  useEffect(effect, deps)
}

// Hook para detectar dispositivos móviles
function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
      setIsMobile(isMobileDevice)
    }
    
    checkMobile()
  }, [])

  return { isMobile }
}

function useHydrationSafeDate() {
  const [date, setDate] = useState<Date | null>(null)
  const [hasMounted, setHasMounted] = useState(false)

  useIsomorphicLayoutEffect(() => {
    setHasMounted(true)
    setDate(new Date())
  }, [])

  useEffect(() => {
    if (!hasMounted) return

    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [hasMounted])

  return { date, hasMounted }
}

export function LiveClock() {
  const { date, hasMounted } = useHydrationSafeDate()
  const { isMobile } = useDeviceDetection()

  const formatTime = (date: Date) => {
    // Forzar configuración específica para consistencia cross-platform
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "America/Bogota" // Asegurar zona horaria consistente
    })
  }

  const formatDate = (dateObj: Date) => {
    // Forzar configuración específica para consistencia cross-platform
    return dateObj.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Bogota" // Asegurar zona horaria consistente
    })
  }

  // Estilos específicos para móviles para asegurar consistencia
  const containerClass = `text-white text-center space-y-1 sm:space-y-2 select-none live-clock ${
    isMobile ? 'touch-manipulation' : ''
  }`
  
  const dateClass = `text-sm sm:text-base md:text-lg font-quicksand font-medium capitalize opacity-90 px-4 leading-tight whitespace-nowrap overflow-hidden ${
    isMobile ? 'text-shadow-sm' : ''
  }`
  
  const timeClass = `text-2xl sm:text-3xl md:text-4xl font-poppins font-bold tracking-wider leading-tight whitespace-nowrap ${
    isMobile ? 'text-shadow-md' : ''
  }`

  // Show placeholder during SSR and initial client render to prevent hydration mismatch
  if (!hasMounted || !date) {
    return (
      <div className={containerClass}>
        <div className={dateClass}>
          <span className="invisible whitespace-nowrap">miércoles, 10 de octubre de 2025</span>
        </div>
        <div className={timeClass}>
          <span className="invisible whitespace-nowrap">00:00:00 a. m.</span>
        </div>
      </div>
    )
  }

  return (
    <div className={containerClass}>
      <div className={dateClass}>
        {formatDate(date)}
      </div>
      <div className={timeClass}>
        {formatTime(date)}
      </div>
    </div>
  )
}
