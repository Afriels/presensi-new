
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Filter, Search, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface StudentAttendance {
  id: number;
  name: string;
  status: 'present' | 'absent' | 'late';
  time: string;
}

interface AttendanceRecord {
  id: number;
  date: string;
  class: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  students?: StudentAttendance[];
}

const AttendancePage = () => {
  const [dateFilter, setDateFilter] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock attendance data with student details
  const attendanceData: AttendanceRecord[] = [
    { 
      id: 1, 
      date: '2024-05-03', 
      class: 'Mathematics 101', 
      total: 35, 
      present: 32, 
      absent: 2, 
      late: 1,
      students: [
        { id: 1, name: 'Ahmad Rizki', status: 'present', time: '08:00' },
        { id: 2, name: 'Budi Santoso', status: 'present', time: '08:02' },
        { id: 3, name: 'Citra Dewi', status: 'absent', time: '-' },
        { id: 4, name: 'Dian Pratama', status: 'late', time: '08:15' }
      ]
    },
    { id: 2, date: '2024-05-03', class: 'Physics 101', total: 30, present: 28, absent: 1, late: 1 },
    { id: 3, date: '2024-05-03', class: 'Chemistry 101', total: 32, present: 29, absent: 3, late: 0 },
    { id: 4, date: '2024-05-02', class: 'Biology 101', total: 34, present: 30, absent: 2, late: 2 },
    { id: 5, date: '2024-05-02', class: 'History 101', total: 36, present: 33, absent: 1, late: 2 },
    { id: 6, date: '2024-05-01', class: 'Mathematics 101', total: 35, present: 31, absent: 3, late: 1 },
    { id: 7, date: '2024-05-01', class: 'Physics 101', total: 30, present: 29, absent: 1, late: 0 },
  ];

  return (
    <Layout title="Attendance Reports" showBottomNav={false}>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Attendance Reports</h2>
          <Button className="flex items-center gap-2" variant="outline">
            <Download size={16} /> Export Data
          </Button>
        </div>

        <Card>
          <div className="p-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by class..." className="pl-8" />
              </div>
              
              <div className="relative w-52">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="date" 
                  className="pl-8"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              
              <Button variant="outline" className="gap-2">
                <Filter size={16} /> More Filters
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Total Students</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData
                  .filter(record => !dateFilter || record.date === dateFilter)
                  .map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.class}</TableCell>
                    <TableCell>{record.total}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                        {record.present}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">
                        {record.absent}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                        {record.late}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowDetails(true);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Attendance Details</DialogTitle>
              <DialogDescription>
                {selectedRecord?.class} - {selectedRecord?.date}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedRecord?.students?.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={{
                            'present': 'bg-green-100 text-green-800',
                            'absent': 'bg-red-100 text-red-800',
                            'late': 'bg-yellow-100 text-yellow-800'
                          }[student.status]}
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AttendancePage;
