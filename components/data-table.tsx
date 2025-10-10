"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react"

interface DataTableProps {
  data: Array<{
    AssetExtra: number | null
    AssetName2: string | null
    AssetExtra2: number | null
    ArrivalDate: string | null
    DepartureTime: string | null
    DepartFrom: string | null
    Distance: number | null
  }>
}

const ITEMS_PER_PAGE = 10

type SortKey = keyof DataTableProps["data"][0]
type SortDirection = "asc" | "desc" | null

export function DataTable({ data }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>("AssetName2")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey || !sortDirection) return 0

    const aVal = a[sortKey]
    const bVal = b[sortKey]

    if (aVal === null && bVal === null) return 0
    if (aVal === null) return 1
    if (bVal === null) return -1

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentData = sortedData.slice(startIndex, endIndex)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
    setCurrentPage(1)
  }

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    )
  }

  return (
    <div>
      <div className="rounded-lg border border-[#E5E7EB] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F3F4F6] hover:bg-[#F3F4F6] border-b border-[#E5E7EB]">
                <TableHead 
                  className="text-[#374151] font-normal text-center w-[80px] h-10 cursor-pointer hover:bg-[#E5E7EB] transition-colors"
                  onClick={() => handleSort("AssetExtra")}
                >
                  AssetExtra {getSortIcon("AssetExtra")}
                </TableHead>
                <TableHead
                  className="text-[#374151] font-normal w-[280px] h-10 cursor-pointer hover:bg-[#E5E7EB] transition-colors"
                  onClick={() => handleSort("AssetName2")}
                >
                  AssetName2 {getSortIcon("AssetName2")}
                </TableHead>
                <TableHead
                  className="text-[#374151] font-normal text-center w-[120px] h-10 cursor-pointer hover:bg-[#E5E7EB] transition-colors"
                  onClick={() => handleSort("AssetExtra2")}
                >
                  AssetExtra2 {getSortIcon("AssetExtra2")}
                </TableHead>
                <TableHead
                  className="text-[#374151] font-normal text-center w-[110px] h-10 cursor-pointer hover:bg-[#E5E7EB] transition-colors"
                  onClick={() => handleSort("ArrivalDate")}
                >
                  ArrivalDate {getSortIcon("ArrivalDate")}
                </TableHead>
                <TableHead
                  className="text-[#374151] font-normal text-center w-[110px] h-10 cursor-pointer hover:bg-[#E5E7EB] transition-colors"
                  onClick={() => handleSort("DepartureTime")}
                >
                  DepartureTime {getSortIcon("DepartureTime")}
                </TableHead>
                <TableHead
                  className="text-[#374151] font-normal min-w-[400px] h-10 cursor-pointer hover:bg-[#E5E7EB] transition-colors"
                  onClick={() => handleSort("DepartFrom")}
                >
                  DepartFrom {getSortIcon("DepartFrom")}
                </TableHead>
                <TableHead
                  className="text-[#374151] font-normal text-right w-[100px] h-10 cursor-pointer hover:bg-[#E5E7EB] transition-colors"
                  onClick={() => handleSort("Distance")}
                >
                  Distance {getSortIcon("Distance")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row, index) => (
                <TableRow
                  key={index}
                  className="h-[40px] bg-white hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB]"
                >
                  <TableCell className="text-center">
                    {row.AssetExtra ?? <span className="text-[#9CA3AF]">NULL</span>}
                  </TableCell>
                  <TableCell>{row.AssetName2 ?? <span className="text-[#9CA3AF]">NULL</span>}</TableCell>
                  <TableCell className="text-center">
                    {row.AssetExtra2 ?? <span className="text-[#9CA3AF]">NULL</span>}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.ArrivalDate ? (
                      new Date(row.ArrivalDate).toISOString().split('T')[0]
                    ) : (
                      <span className="text-[#9CA3AF]">NULL</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.DepartureTime ?? <span className="text-[#9CA3AF]">NULL</span>}
                  </TableCell>
                  <TableCell>{row.DepartFrom ?? <span className="text-[#9CA3AF]">NULL</span>}</TableCell>
                  <TableCell className="text-right">
                    {row.Distance !== null ? row.Distance : <span className="text-[#9CA3AF]">NULL</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, sortedData.length)} de {sortedData.length} registros
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}