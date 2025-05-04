import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash } from 'lucide-react';
import { useState, useEffect } from "react"
import { classesOperations } from "@/db"
import type { Class } from "@/db"

interface ClassFormData {
  name: string
  grade: string
  year: string
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [newClass, setNewClass] = useState<ClassFormData>({ name: "", grade: "", year: "" })
  const [editingClass, setEditingClass] = useState<Class | null>(null)

  useEffect(() => {
    const loadedClasses = classesOperations.getAll()
    setClasses(loadedClasses)
  }, [])

  const handleAddClass = () => {
    if (newClass.name && newClass.grade && newClass.year) {
      classesOperations.create(newClass)
      const updatedClasses = classesOperations.getAll()
      setClasses(updatedClasses)
      setNewClass({ name: "", grade: "", year: "" })
    }
  }

  const handleEdit = (cls: Class) => {
    setEditingClass(cls)
    setNewClass({ name: cls.name, grade: cls.grade, year: cls.year })
  }

  const handleUpdate = () => {
    if (editingClass && newClass.name && newClass.grade && newClass.year) {
      classesOperations.update(editingClass.id, newClass)
      const updatedClasses = classesOperations.getAll()
      setClasses(updatedClasses)
      setEditingClass(null)
      setNewClass({ name: "", grade: "", year: "" })
    }
  }

  const handleDelete = (id: number) => {
    classesOperations.delete(id)
    const updatedClasses = classesOperations.getAll()
    setClasses(updatedClasses)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Manajemen Kelas</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Kelas</label>
          <Input
            placeholder="Contoh: A"
            value={newClass.name}
            onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tingkat</label>
          <Input
            placeholder="Contoh: X"
            value={newClass.grade}
            onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tahun Ajaran</label>
          <Input
            placeholder="Contoh: 2024/2025"
            value={newClass.year}
            onChange={(e) => setNewClass({ ...newClass, year: e.target.value })}
          />
        </div>
        <Button onClick={editingClass ? handleUpdate : handleAddClass}>
          {editingClass ? 'Update Kelas' : 'Tambah Kelas'}
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"><Plus className="w-4 h-4" />No</TableHead>
              <TableHead className="w-[150px]">Nama Kelas</TableHead>
              <TableHead className="w-[100px]">Tingkat</TableHead>
              <TableHead className="w-[150px]">Tahun Ajaran</TableHead>
              <TableHead className="w-[200px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((cls, index) => (
              <TableRow key={cls.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{cls.grade}</TableCell>
                <TableCell>{cls.year}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(cls)}
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(cls.id)}
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
