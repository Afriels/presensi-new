import Database from 'better-sqlite3';
import path from 'path';

// Inisialisasi database
const db = new Database(path.join(process.cwd(), 'src/db/hadir-saja.db'));

// Buat tabel jika belum ada
db.exec(`
  -- Tabel Kelas
  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    year TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabel Mata Pelajaran
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabel Guru
  CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nip TEXT NOT NULL UNIQUE,
    subject_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
  );

  -- Tabel Siswa
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nis TEXT NOT NULL UNIQUE,
    class_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id)
  );

  -- Tabel Waktu Presensi
  CREATE TABLE IF NOT EXISTS attendance_times (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabel Laporan Presensi
  CREATE TABLE IF NOT EXISTS attendance_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    attendance_time_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('hadir', 'izin', 'sakit', 'alpha')),
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (attendance_time_id) REFERENCES attendance_times(id)
  );

  -- Tabel Jadwal
  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER,
    subject_id INTEGER,
    teacher_id INTEGER,
    day TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
  );

  -- Tabel Absensi
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    schedule_id INTEGER,
    date DATE NOT NULL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (schedule_id) REFERENCES schedules(id)
  );
`);

// Insert data dummy
function insertDummyData() {
  // Cek apakah data sudah ada di tabel attendance_times
  const result = db.prepare('SELECT COUNT(*) as count FROM attendance_times').get() as { count: number };
  const attendanceTimesCount = result.count;

  if (attendanceTimesCount > 0) {
    return; // Data sudah ada, tidak perlu insert lagi
  }

  // Reset auto-increment
  db.exec('DELETE FROM sqlite_sequence');

  // Insert Kelas
  const classes = db.prepare(`
    INSERT INTO classes (name, grade, year) VALUES (?, ?, ?)
  `);
  
  [
    ['A', 'X', '2024/2025'],
    ['B', 'X', '2024/2025'],
    ['A', 'XI', '2024/2025'],
    ['B', 'XI', '2024/2025'],
    ['A', 'XII', '2024/2025'],
    ['B', 'XII', '2024/2025'],
  ].forEach(([name, grade, year]) => {
    classes.run(name, grade, year);
  });

  // Insert Mata Pelajaran
  const subjects = db.prepare(`
    INSERT INTO subjects (name, code) VALUES (?, ?)
  `);
  
  [
    ['Matematika', 'MTK'],
    ['Bahasa Indonesia', 'BIN'],
    ['Bahasa Inggris', 'BIG'],
    ['Fisika', 'FIS'],
    ['Kimia', 'KIM'],
    ['Biologi', 'BIO'],
  ].forEach(([name, code]) => {
    subjects.run(name, code);
  });

  // Insert Guru
  const teachers = db.prepare(`
    INSERT INTO teachers (name, nip, subject_id) VALUES (?, ?, ?)
  `);
  
  [
    ['Budi Santoso', '198501012010011001', 1],
    ['Siti Rahayu', '198601022010012002', 2],
    ['Ahmad Hidayat', '198701032010011003', 3],
    ['Dewi Sartika', '198801042010012004', 4],
    ['Rudi Hermawan', '198901052010011005', 5],
    ['Nina Wulandari', '199001062010012006', 6],
  ].forEach(([name, nip, subject_id]) => {
    teachers.run(name, nip, subject_id);
  });

  // Insert Siswa
  const students = db.prepare(`
    INSERT INTO students (name, nis, class_id) VALUES (?, ?, ?)
  `);
  
  [
    ['Andi Pratama', '2024001', 1],
    ['Budi Setiawan', '2024002', 1],
    ['Citra Dewi', '2024003', 1],
    ['Dian Safitri', '2024004', 2],
    ['Eko Prasetyo', '2024005', 2],
    ['Fitri Handayani', '2024006', 2],
  ].forEach(([name, nis, class_id]) => {
    students.run(name, nis, class_id);
  });

  // Insert Jadwal
  const schedules = db.prepare(`
    INSERT INTO schedules (class_id, subject_id, teacher_id, day, start_time, end_time)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  [
    [1, 1, 1, 'Senin', '07:00', '08:30'],
    [1, 2, 2, 'Senin', '08:30', '10:00'],
    [2, 3, 3, 'Selasa', '07:00', '08:30'],
    [2, 4, 4, 'Selasa', '08:30', '10:00'],
    [3, 5, 5, 'Rabu', '07:00', '08:30'],
    [3, 6, 6, 'Rabu', '08:30', '10:00'],
  ].forEach(([class_id, subject_id, teacher_id, day, start_time, end_time]) => {
    schedules.run(class_id, subject_id, teacher_id, day, start_time, end_time);
  });

  // Insert Absensi
  const attendance = db.prepare(`
    INSERT INTO attendance (student_id, schedule_id, date, status)
    VALUES (?, ?, ?, ?)
  `);
  
  const today = new Date().toISOString().split('T')[0];
  
  [
    [1, 1, today, 'Hadir'],
    [2, 1, today, 'Hadir'],
    [3, 1, today, 'Izin'],
    [4, 2, today, 'Hadir'],
    [5, 2, today, 'Sakit'],
    [6, 2, today, 'Hadir'],
  ].forEach(([student_id, schedule_id, date, status]) => {
    attendance.run(student_id, schedule_id, date, status);
  });
}

// Jalankan insert data dummy
insertDummyData();

// Ekspor instance database
export { db };
