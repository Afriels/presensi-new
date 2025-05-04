-- Tabel Siswa
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  nis TEXT NOT NULL UNIQUE,
  class_id INTEGER,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- Tabel untuk waktu presensi
CREATE TABLE IF NOT EXISTS attendance_times (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk laporan presensi
CREATE TABLE IF NOT EXISTS attendance_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  class_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  attendance_time_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('hadir', 'izin', 'sakit', 'alpha')),
  date TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  FOREIGN KEY (attendance_time_id) REFERENCES attendance_times(id)
);
