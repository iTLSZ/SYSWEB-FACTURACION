"use client"

import type React from "react"

import { useCallback } from "react"
import { Upload, FileSpreadsheet } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
}

export function FileUploadZone({ onFileSelect, selectedFile }: FileUploadZoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile && droppedFile.name.endsWith(".csv")) {
        onFileSelect(droppedFile)
      }
    },
    [onFileSelect],
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileSelect(selectedFile)
    }
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={cn(
        "relative border-2 border-dashed rounded-xl p-16 text-center transition-all duration-200 cursor-pointer",
        "hover:border-primary hover:bg-primary/5 hover:shadow-md",
        selectedFile ? "border-primary bg-primary/5 shadow-md" : "border-border bg-secondary/20",
      )}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="flex flex-col items-center gap-6">
        <div className={cn("p-6 rounded-2xl transition-colors", selectedFile ? "bg-primary/15" : "bg-primary/10")}>
          {selectedFile ? (
            <FileSpreadsheet className="h-16 w-16 text-primary" />
          ) : (
            <Upload className="h-16 w-16 text-primary" />
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {selectedFile ? "Archivo seleccionado" : "Arrastra tu archivo CSV aquí"}
          </h3>
          <p className="text-muted-foreground text-lg">
            {selectedFile ? selectedFile.name : "o haz clic para seleccionar un archivo"}
          </p>
        </div>
      </div>
    </div>
  )
}