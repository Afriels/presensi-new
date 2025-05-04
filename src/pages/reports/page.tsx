import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileSpreadsheet, Search } from 'lucide-react';
import { useState } from "react"
import { attendanceRecordsOperations } from "@/db"
import type { AttendanceRecord } from "@/db"
import * as XLSX from 'xlsx';

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [records, setRecords] = useState<AttendanceRecord[]>([])

  const handleSearch = () => {
    if (startDate && endDate) {
      const results = attendanceRecordsOperations.getByDateRange(startDate, endDate)
      setRecords(results)
    }
  }

  const handleExport = () => {
    if (records.length === 0) return

    const data = records.map((record) => ({
      'Tanggal': record.date,
      'Nama Siswa': record.student_name,
      'Kelas': record.class_name,
      'Mata Pelajaran': record.subject_name,
      'Status': record.status.toUpperCase(),
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Presensi')

    // Mengatur lebar kolom
    const colWidths = [
      { wch: 12 }, // Tanggal
      { wch: 25 }, // Nama Siswa
      { wch: 15 }, // Kelas
      { wch: 20 }, // Mata Pelajaran
      { wch: 10 }, // Status
    ]
    ws['!cols'] = colWidths

    // Mengatur style header
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + '1'
      if (!ws[address]) continue
      ws[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "CCCCCC" } }
      }
    }

    XLSX.writeFile(wb, `Laporan_Presensi_${startDate}_${endDate}.xlsx`)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Laporan Presensi</h1>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm mb-1">Tanggal Mulai</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Tanggal Selesai</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Cari
          </Button>
          {records.length > 0 && (
            <Button variant="secondary" onClick={handleExport}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          )}
        </div>
      </div>

      {records.length > 0 && (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={record.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.student_name}</TableCell>
                  <TableCell>{record.class_name}</TableCell>
                  <TableCell>{record.subject_name}</TableCell>
                  <TableCell className="uppercase">{record.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
