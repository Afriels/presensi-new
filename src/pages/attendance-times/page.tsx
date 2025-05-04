import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash } from 'lucide-react';
import { useState, useEffect } from "react"
import { attendanceTimesOperations } from "@/db"
import type { AttendanceTime } from "@/db"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AttendanceTimesPage() {
  const [attendanceTimes, setAttendanceTimes] = useState<AttendanceTime[]>([])
  const [newAttendanceTime, setNewAttendanceTime] = useState<Omit<AttendanceTime, 'id' | 'created_at'>>({
    name: '',
    start_time: '',
    end_time: ''
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    loadAttendanceTimes()
  }, [])

  const loadAttendanceTimes = () => {
    const times = attendanceTimesOperations.getAll()
    setAttendanceTimes(times)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      attendanceTimesOperations.update(editingId, newAttendanceTime)
      setEditingId(null)
    } else {
      attendanceTimesOperations.create(newAttendanceTime)
    }
    setNewAttendanceTime({ name: '', start_time: '', end_time: '' })
    loadAttendanceTimes()
  }

  const handleEdit = (time: AttendanceTime) => {
    setEditingId(time.id)
    setNewAttendanceTime({
      name: time.name,
      start_time: time.start_time,
      end_time: time.end_time
    })
  }

  const handleDelete = (id: number) => {
    attendanceTimesOperations.delete(id)
    loadAttendanceTimes()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Waktu Presensi</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Waktu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Waktu Presensi' : 'Tambah Waktu Presensi'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label>Nama Waktu</label>
                <Input
                  required
                  value={newAttendanceTime.name}
                  onChange={(e) => setNewAttendanceTime({ ...newAttendanceTime, name: e.target.value })}
                  placeholder="Contoh: Pagi, Siang, dll"
                />
              </div>
              <div>
                <label>Waktu Mulai</label>
                <Input
                  required
                  type="time"
                  value={newAttendanceTime.start_time}
                  onChange={(e) => setNewAttendanceTime({ ...newAttendanceTime, start_time: e.target.value })}
                />
              </div>
              <div>
                <label>Waktu Selesai</label>
                <Input
                  required
                  type="time"
                  value={newAttendanceTime.end_time}
                  onChange={(e) => setNewAttendanceTime({ ...newAttendanceTime, end_time: e.target.value })}
                />
              </div>
              <Button type="submit">
                {editingId ? 'Update' : 'Simpan'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Waktu Mulai</TableHead>
              <TableHead>Waktu Selesai</TableHead>
              <TableHead className="w-[200px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceTimes.map((time, index) => (
              <TableRow key={time.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{time.name}</TableCell>
                <TableCell>{time.start_time}</TableCell>
                <TableCell>{time.end_time}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(time)}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(time.id)}
                    >
                      <Trash className="w-4 h-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
