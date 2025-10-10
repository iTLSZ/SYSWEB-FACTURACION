"use client"

import { useState } from "react"
import { Upload, FileText, CheckCircle2, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FileUploadZone } from "@/components/file-upload-zone"
import { DataTable } from "@/components/data-table"
import { Toaster } from "@/components/ui/toaster"

interface UploadedRecord {
  AssetExtra: number | null
  AssetName2: string | null
  AssetExtra2: number | null
  ArrivalDate: string | null
  DepartureTime: string | null
  DepartFrom: string | null
  Distance: number | null
}

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedData, setUploadedData] = useState<UploadedRecord[]>([])
  const [recordCount, setRecordCount] = useState(0)
  const { toast } = useToast()

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setUploadedData([])
    setRecordCount(0)
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No hay archivo",
        description: "Por favor selecciona un archivo CSV primero",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-csv", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al procesar el archivo")
      }

      setRecordCount(result.insertedCount)

      const dataResponse = await fetch("/api/registros")
      const dataResult = await dataResponse.json()

      if (!dataResponse.ok) {
        throw new Error(dataResult.error || "Error al obtener los datos")
      }

      setUploadedData(dataResult.data)

      toast({
        title: "¡Éxito!",
        description: result.message,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setUploadedData([])
    setRecordCount(0)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Sistema de Carga de Datos</h1>
          </div>
          <p className="text-muted-foreground">Importa archivos CSV con información de rutas y conductores</p>
        </div>

        {/* Upload Section */}
        {uploadedData.length === 0 ? (
          <Card className="p-8 bg-card border-border">
            <div className="max-w-2xl mx-auto">
              <FileUploadZone onFileSelect={handleFileSelect} selectedFile={file} />

              {file && (
                <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button onClick={handleUpload} disabled={isUploading} size="lg" className="w-full">
                    {isUploading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Procesar y Guardar
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <>
            {/* Success Message */}
            <Card className="p-6 bg-card border-border mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Datos cargados exitosamente</h3>
                    <p className="text-sm text-muted-foreground">Se procesaron {recordCount} registros correctamente</p>
                  </div>
                </div>
                <Button onClick={handleReset} variant="outline">
                  Cargar otro archivo
                </Button>
              </div>
            </Card>

            {/* Data Preview */}
            <Card className="p-6 bg-card border-border">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-1">Vista Previa de Datos</h3>
                <p className="text-sm text-muted-foreground">Mostrando los primeros 50 registros del archivo cargado</p>
              </div>
              <DataTable data={uploadedData} />
            </Card>
          </>
        )}
      </div>
      <Toaster />
    </div>
  )
}
