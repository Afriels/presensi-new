import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { studentsOperations, classesOperations } from "@/db"
import type { Student, Class } from "@/db"

interface StudentFormData {
  name: string
  nis: string
  class_id: number
  phone?: string
  email?: string
}

const StudentsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [students, setStudents] = useState<(Student & { class_name: string, grade: string })[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [newStudent, setNewStudent] = useState<StudentFormData>({ name: "", nis: "", class_id: 0, phone: "", email: "" })
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load students
    const loadedStudents = studentsOperations.getAll()
    setStudents(loadedStudents)

    // Load classes
    const loadedClasses = classesOperations.getAll()
    setClasses(loadedClasses)
  }, []);

  const handleEditClick = (student: Student & { class_name: string, grade: string }) => {
    setEditingStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.nis && newStudent.class_id) {
      studentsOperations.create({
        name: newStudent.name,
        nis: newStudent.nis,
        class_id: Number(newStudent.class_id)
      })
      const updatedStudents = studentsOperations.getAll()
      setStudents(updatedStudents)
      setNewStudent({ name: "", nis: "", class_id: 0 })
    }
  }

  const handleSaveStudent = (id: number, data: StudentFormData) => {
    studentsOperations.update(id, {
      name: data.name,
      nis: data.nis,
      class_id: Number(data.class_id)
    })
    const updatedStudents = studentsOperations.getAll()
    setStudents(updatedStudents)
  };

  return (
    <Layout title="Manage Students" showBottomNav={false}>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Manage Students</h2>
          <Button 
            className="flex items-center gap-2"
            onClick={() => {
              setNewStudent({ name: "", nis: "", class_id: 0 });
              setIsAddDialogOpen(true);
            }}
          >
            <Plus size={16} /> Add Student
          </Button>
        </div>

        <Card>
          <div className="p-6">
            <div className="flex justify-between mb-4">
              <div className="relative w-64">
                <Input placeholder="Search students..." className="pl-8" />
              </div>
              <div className="flex gap-2">
                <select className="h-10 rounded-md border border-input px-3 py-2 text-sm">
                  <option value="">All Classes</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                      <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>NIS</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.grade}-{student.class_name}</TableCell>
                    <TableCell>{student.nis}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditClick(student)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nis">NIS</Label>
              <Input
                id="nis"
                value={newStudent.nis}
                onChange={(e) => setNewStudent({ ...newStudent, nis: e.target.value })}
                placeholder="Enter NIS"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="class_id">Class</Label>
              <select
                id="class_id"
                value={newStudent.class_id.toString()}
                onChange={(e) => setNewStudent({ ...newStudent, class_id: Number(e.target.value) })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddStudent}
            >
              Add Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-id">Student ID</Label>
              <Input
                id="edit-id"
                value={editingStudent?.id || ''}
                onChange={(e) => {
                  if (editingStudent) {
                    setEditingStudent({ ...editingStudent, id: e.target.value });
                  }
                }}
                placeholder="Enter student ID"
                disabled
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editingStudent?.name || ''}
                onChange={(e) => {
                  if (editingStudent) {
                    setEditingStudent({ ...editingStudent, name: e.target.value });
                  }
                }}
                placeholder="Enter full name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-class">Class</Label>
              <select
                id="edit-class"
                value={editingStudent?.class || ''}
                onChange={(e) => {
                  if (editingStudent) {
                    setEditingStudent({ ...editingStudent, class: e.target.value });
                  }
                }}
                className="h-10 rounded-md border border-input px-3 py-2"
              >
                <option value="">Select class</option>
                <option value="10-A">10-A</option>
                <option value="10-B">10-B</option>
                <option value="11-A">11-A</option>
                <option value="11-B">11-B</option>
                <option value="12-A">12-A</option>
                <option value="12-B">12-B</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={editingStudent?.phone || ''}
                onChange={(e) => {
                  if (editingStudent) {
                    setEditingStudent({ ...editingStudent, phone: e.target.value });
                  }
                }}
                placeholder="Enter phone number"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editingStudent?.email || ''}
                onChange={(e) => {
                  if (editingStudent) {
                    setEditingStudent({ ...editingStudent, email: e.target.value });
                  }
                }}
                placeholder="Enter email address"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingStudent) {
                  handleSaveStudent(editingStudent.id, newStudent);
                  setIsEditDialogOpen(false);
                  toast({
                    title: "Success",
                    description: "Student updated successfully",
                  });
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default StudentsPage;
