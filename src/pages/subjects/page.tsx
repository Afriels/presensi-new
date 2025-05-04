import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash } from 'lucide-react';
import { useState, useEffect } from "react"
import { subjectsOperations } from "@/db"
import type { Subject } from "@/db"

interface SubjectFormData {
  name: string
  code: string
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [newSubject, setNewSubject] = useState<SubjectFormData>({ name: "", code: "" })
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)

  useEffect(() => {
    const loadedSubjects = subjectsOperations.getAll()
    setSubjects(loadedSubjects)
  }, [])

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.code) {
      subjectsOperations.create(newSubject)
      const updatedSubjects = subjectsOperations.getAll()
      setSubjects(updatedSubjects)
      setNewSubject({ name: "", code: "" })
    }
  }

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setNewSubject({ name: subject.name, code: subject.code })
  }

  const handleUpdate = () => {
    if (editingSubject && newSubject.name && newSubject.code) {
      subjectsOperations.update(editingSubject.id, newSubject)
      const updatedSubjects = subjectsOperations.getAll()
      setSubjects(updatedSubjects)
      setEditingSubject(null)
      setNewSubject({ name: "", code: "" })
    }
  }

  const handleDelete = (id: number) => {
    subjectsOperations.delete(id)
    const updatedSubjects = subjectsOperations.getAll()
    setSubjects(updatedSubjects)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Manajemen Pelajaran</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Pelajaran</label>
          <Input
            placeholder="Contoh: Matematika"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Kode</label>
          <Input
            placeholder="Contoh: MTK"
            value={newSubject.code}
            onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
          />
        </div>
        <Button onClick={editingSubject ? handleUpdate : handleAddSubject}>
          {editingSubject ? 'Update Pelajaran' : 'Tambah Pelajaran'}
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"><Plus className="w-4 h-4" /> No</TableHead>
              <TableHead>Nama Pelajaran</TableHead>
              <TableHead className="w-[100px]">Kode</TableHead>
              <TableHead className="w-[200px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject, index) => (
              <TableRow key={subject.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.code}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(subject)}
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(subject.id)}
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
