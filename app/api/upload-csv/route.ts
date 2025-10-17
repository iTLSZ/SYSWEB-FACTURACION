import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { parse } from "csv-parse/sync"

function parseDate(dateStr: string | undefined | null): string | null {
  if (!dateStr || dateStr.trim() === "") return null

  // Formato esperado: DD/MM/YYYY
  const parts = dateStr.trim().split("/")
  if (parts.length !== 3) return null

  const [day, month, year] = parts

  // Validar partes
  if (!day || !month || !year) return null

  // Retornar en formato MySQL: YYYY-MM-DD
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ error: "El archivo debe ser un CSV" }, { status: 400 })
    }

    // Leer contenido del archivo
    const fileContent = await file.text()

    // Analizar CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    let insertedCount = 0

    for (const row of records) {
      const rowData = row as any;
      const {
        AssetExtra, // número de bus (INT)
        AssetName2, // nombre del conductor (VARCHAR)
        AssetExtra2, // cédula del conductor (BIGINT)
        ArrivalDate, // fecha del viaje (DATE) - formato DD/MM/YYYY en CSV
        DepartureTime, // hora de salida (TIME)
        DepartFrom, // punto de salida (VARCHAR)
        ArrivalTime, // hora de llegada (TIME)
        ArriveAt, // punto de llegada (VARCHAR)
        Distance, // distancia en km (DECIMAL)
      } = rowData

      // Función auxiliar para analizar números de forma segura
      const parseNumber = (value: string | undefined | null): number | null => {
        if (!value || value.trim() === "") return null
        const parsed = Number(value)
        return isNaN(parsed) ? null : parsed
      }

      const formattedDate = parseDate(ArrivalDate)

      await pool.execute(
        `INSERT INTO NEWRECIBE 
         (nequipo, dconductor, nconductor, fecha, hm, nompuni , km, sentido) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          parseNumber(AssetExtra),
          AssetName2 || null,
          parseNumber(AssetExtra2),
          formattedDate,
          DepartureTime || null,
          DepartFrom || null,
          parseNumber(Distance), 
          "i", // Indicar que es un registro de salida
        ],
      )
      insertedCount++

      await pool.execute(
        `INSERT INTO NEWRECIBE 
         (nequipo, dconductor, nconductor, fecha, hm, nompuni, km, sentido) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          parseNumber(AssetExtra),
          AssetName2 || null,
          parseNumber(AssetExtra2),
          formattedDate,
          ArrivalTime || null, // La hora de llegada del CSV va en la columna DepartureTime
          ArriveAt || null, // El punto de llegada del CSV va en la columna DepartFrom
          null, // No asignamos el campo Distance (km) para el registro de llegada
          "f", // Indicar que es un registro de llegada
        ],
      )
      insertedCount++
    }

    return NextResponse.json(
      {
        message: `Se cargaron ${insertedCount} registros correctamente`,
        insertedCount,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error al procesar CSV:", error)
    return NextResponse.json(
      {
        error: "Error al procesar el archivo CSV",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}

// Retornar 405 para métodos que no sean POST
export async function GET() {
  return NextResponse.json({ error: "Método no permitido. Use POST." }, { status: 405 })
  
}