export interface Class {
  id: number;
  name: string;
  grade: string;
  year: string;
  created_at: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  created_at: string;
}

export interface Teacher {
  id: number;
  name: string;
  nip: string;
  subject_id: number;
  created_at: string;
  subject?: Subject;
}

export interface Student {
  id: number;
  name: string;
  nis: string;
  class_id: number;
  phone?: string;
  email?: string;
  created_at: string;
  class?: Class;
}

export interface AttendanceTime {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: number;
  student_id: number;
  class_id: number;
  subject_id: number;
  attendance_time_id: number;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  date: string;
  created_at: string;
  student_name?: string;
  class_name?: string;
  subject_name?: string;
}

export interface Schedule {
  id: number;
  class_id: number;
  subject_id: number;
  teacher_id: number;
  day: string;
  start_time: string;
  end_time: string;
  created_at: string;
  class?: Class;
  subject?: Subject;
  teacher?: Teacher;
}

export interface Attendance {
  id: number;
  student_id: number;
  schedule_id: number;
  date: string;
  status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpha';
  created_at: string;
  student?: Student;
  schedule?: Schedule;
}
