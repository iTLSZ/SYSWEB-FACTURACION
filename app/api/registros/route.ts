import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        nequipo AS AssetExtra, 
        dconductor AS AssetName2,
        nconductor AS AssetExtra2,
        fecha AS ArrivalDate,
        hm AS DepartureTime,
        nompuni AS DepartFrom,
        km AS Distance
      FROM NEWRECIBE
      ORDER BY ArrivalDate DESC, DepartureTime DESC
      LIMIT 1000`,
    )

    return NextResponse.json({ data: rows }, { status: 200 })
  } catch (error) {
    console.error("Error al obtener registros:", error)
    return NextResponse.json(
      {
        error: "Error al obtener los registros",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
  

}