import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Sidebar } from '@/components/sidebar';
import StudentsPage from '@/pages/students/page';
import AttendancePage from '@/pages/attendance/page';
import QRCodesPage from '@/pages/qr-codes/page';
import DashboardPage from '@/pages/dashboard/page';
import SubjectsPage from '@/pages/subjects/page';
import ClassesPage from '@/pages/classes/page';
import TeachersPage from '@/pages/teachers/page';
import AttendanceTimesPage from '@/pages/attendance-times/page';
import ReportsPage from '@/pages/reports/page';

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <main className="relative flex-1 overflow-y-auto focus:outline-none md:ml-64 bg-gray-50">
            <div className="py-6">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/students" element={<StudentsPage />} />
                  <Route path="/attendance" element={<AttendancePage />} />
                  <Route path="/qr-codes" element={<QRCodesPage />} />
                  <Route path="/subjects" element={<SubjectsPage />} />
                  <Route path="/classes" element={<ClassesPage />} />
                  <Route path="/teachers" element={<TeachersPage />} />
                  <Route path="/attendance-times" element={<AttendanceTimesPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                </Routes>
              </div>
            </div>
          </main>
        </div>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
