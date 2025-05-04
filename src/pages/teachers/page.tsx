import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash } from 'lucide-react';
import { useState, useEffect } from "react"
import { teachersOperations, subjectsOperations } from "@/db"
import type { Teacher } from "@/db"

interface TeacherFormData {
  name: string
  nip: string
  subject_id: number
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<(Teacher & { subject_name: string })[]>([])
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([])
  const [newTeacher, setNewTeacher] = useState<TeacherFormData>({ name: "", nip: "", subject_id: 0 })
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)

  useEffect(() => {
    // Load teachers
    const loadedTeachers = teachersOperations.getAll()
    setTeachers(loadedTeachers)

    // Load subjects
    const loadedSubjects = subjectsOperations.getAll()
    setSubjects(loadedSubjects)
  }, [])

  const handleAddTeacher = () => {
    if (newTeacher.name && newTeacher.nip && newTeacher.subject_id) {
      teachersOperations.create(newTeacher)
      const updatedTeachers = teachersOperations.getAll()
      setTeachers(updatedTeachers)
      setNewTeacher({ name: "", nip: "", subject_id: 0 })
    }
  }

  const handleEdit = (teacher: Teacher & { subject_name: string }) => {
    setEditingTeacher(teacher)
    setNewTeacher({ name: teacher.name, nip: teacher.nip, subject_id: teacher.subject_id })
  }

  const handleUpdate = () => {
    if (editingTeacher && newTeacher.name && newTeacher.nip && newTeacher.subject_id) {
      teachersOperations.update(editingTeacher.id, newTeacher)
      const updatedTeachers = teachersOperations.getAll()
      setTeachers(updatedTeachers)
      setEditingTeacher(null)
      setNewTeacher({ name: "", nip: "", subject_id: 0 })
    }
  }

  const handleDelete = (id: number) => {
    teachersOperations.delete(id)
    const updatedTeachers = teachersOperations.getAll()
    setTeachers(updatedTeachers)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Manajemen Guru</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Guru</label>
          <Input
            placeholder="Contoh: Budi Santoso"
            value={newTeacher.name}
            onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">NIP</label>
          <Input
            placeholder="Contoh: 198501012010011001"
            value={newTeacher.nip}
            onChange={(e) => setNewTeacher({ ...newTeacher, nip: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Mata Pelajaran</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={newTeacher.subject_id}
            onChange={(e) => setNewTeacher({ ...newTeacher, subject_id: Number(e.target.value) })}
          >
            <option value={0}>Pilih Mata Pelajaran</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>
        <Button onClick={editingTeacher ? handleUpdate : handleAddTeacher}>
          {editingTeacher ? 'Update Guru' : 'Tambah Guru'}
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"><Plus className="w-4 h-4" />No</TableHead>
              <TableHead className="w-[200px]">Nama</TableHead>
              <TableHead className="w-[200px]">NIP</TableHead>
              <TableHead className="w-[200px]">Mata Pelajaran</TableHead>
              <TableHead className="w-[200px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher, index) => (
              <TableRow key={teacher.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.nip}</TableCell>
                <TableCell>{teacher.subject_name}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(teacher)}
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(teacher.id)}
                    >
                      <Trash className="w-4 h-4" /> Hapus
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
