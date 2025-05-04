import { db } from './database';
import { Class, Subject, Teacher, Student, Schedule, Attendance, AttendanceTime, AttendanceRecord } from './types';

// Classes Operations
export const classesOperations = {
  getAll: (): Class[] => {
    return db.prepare('SELECT * FROM classes ORDER BY grade, name').all() as Class[];
  },
  
  getById: (id: number): Class | undefined => {
    return db.prepare('SELECT * FROM classes WHERE id = ?').get(id) as Class | undefined;
  },
  
  create: (data: Omit<Class, 'id' | 'created_at'>): Class => {
    const result = db.prepare(
      'INSERT INTO classes (name, grade, year) VALUES (?, ?, ?)'
    ).run(data.name, data.grade, data.year);
    return { id: result.lastInsertRowid as number, ...data, created_at: new Date().toISOString() };
  },
  
  update: (id: number, data: Partial<Class>): boolean => {
    const result = db.prepare(
      'UPDATE classes SET name = ?, grade = ?, year = ? WHERE id = ?'
    ).run(data.name, data.grade, data.year, id);
    return result.changes > 0;
  },
  
  delete: (id: number): boolean => {
    const result = db.prepare('DELETE FROM classes WHERE id = ?').run(id);
    return result.changes > 0;
  }
};

// Subjects Operations
export const subjectsOperations = {
  getAll: (): Subject[] => {
    return db.prepare('SELECT * FROM subjects ORDER BY name').all() as Subject[];
  },
  
  getById: (id: number): Subject | undefined => {
    return db.prepare('SELECT * FROM subjects WHERE id = ?').get(id) as Subject | undefined;
  },
  
  create: (data: Omit<Subject, 'id' | 'created_at'>): Subject => {
    const result = db.prepare(
      'INSERT INTO subjects (name, code) VALUES (?, ?)'
    ).run(data.name, data.code);
    return { id: result.lastInsertRowid as number, ...data, created_at: new Date().toISOString() };
  },
  
  update: (id: number, data: Partial<Subject>): boolean => {
    const result = db.prepare(
      'UPDATE subjects SET name = ?, code = ? WHERE id = ?'
    ).run(data.name, data.code, id);
    return result.changes > 0;
  },
  
  delete: (id: number): boolean => {
    const result = db.prepare('DELETE FROM subjects WHERE id = ?').run(id);
    return result.changes > 0;
  }
};

// Teachers Operations
export const teachersOperations = {
  getAll: (): (Teacher & { subject_name: string })[] => {
    return db.prepare(`
      SELECT t.*, s.name as subject_name 
      FROM teachers t
      LEFT JOIN subjects s ON t.subject_id = s.id
      ORDER BY t.name
    `).all() as (Teacher & { subject_name: string })[];
  },
  
  getById: (id: number): (Teacher & { subject_name: string }) | undefined => {
    return db.prepare(`
      SELECT t.*, s.name as subject_name 
      FROM teachers t
      LEFT JOIN subjects s ON t.subject_id = s.id
      WHERE t.id = ?
    `).get(id) as (Teacher & { subject_name: string }) | undefined;
  },
  
  create: (data: Omit<Teacher, 'id' | 'created_at'>): Teacher => {
    const result = db.prepare(
      'INSERT INTO teachers (name, nip, subject_id) VALUES (?, ?, ?)'
    ).run(data.name, data.nip, data.subject_id);
    return { id: result.lastInsertRowid as number, ...data, created_at: new Date().toISOString() };
  },
  
  update: (id: number, data: Partial<Teacher>): boolean => {
    const result = db.prepare(
      'UPDATE teachers SET name = ?, nip = ?, subject_id = ? WHERE id = ?'
    ).run(data.name, data.nip, data.subject_id, id);
    return result.changes > 0;
  },
  
  delete: (id: number): boolean => {
    const result = db.prepare('DELETE FROM teachers WHERE id = ?').run(id);
    return result.changes > 0;
  }
};

// Students Operations
export const studentsOperations = {
  getAll: (): (Student & { class_name: string, grade: string })[] => {
    return db.prepare(`
      SELECT s.*, c.name as class_name, c.grade 
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      ORDER BY s.name
    `).all() as (Student & { class_name: string; grade: string })[];
  },
  
  getById: (id: number): (Student & { class_name: string, grade: string }) | undefined => {
    return db.prepare(`
      SELECT s.*, c.name as class_name, c.grade 
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE s.id = ?
    `).get(id) as (Student & { class_name: string; grade: string }) | undefined;
  },
  
  create: (data: Omit<Student, 'id' | 'created_at'>): Student => {
    const result = db.prepare(
      'INSERT INTO students (name, nis, class_id, phone, email) VALUES (?, ?, ?, ?, ?)'
    ).run(data.name, data.nis, data.class_id, data.phone, data.email);
    return { id: result.lastInsertRowid as number, ...data, created_at: new Date().toISOString() };
  },
  
  update: (id: number, data: Partial<Student>): boolean => {
    const result = db.prepare(
      'UPDATE students SET name = COALESCE(?, name), nis = COALESCE(?, nis), class_id = COALESCE(?, class_id), phone = COALESCE(?, phone), email = COALESCE(?, email) WHERE id = ?'
    ).run(data.name, data.nis, data.class_id, data.phone, data.email, id);
    return result.changes > 0;
  },
  
  delete: (id: number): boolean => {
    const result = db.prepare('DELETE FROM students WHERE id = ?').run(id);
    return result.changes > 0;
  }
};

// Schedules Operations
export const schedulesOperations = {
  getAll: (): (Schedule & { 
    class_name: string,
    subject_name: string,
    teacher_name: string 
  })[] => {
    return db.prepare(`
      SELECT 
        sch.*,
        c.name as class_name,
        s.name as subject_name,
        t.name as teacher_name
      FROM schedules sch
      LEFT JOIN classes c ON sch.class_id = c.id
      LEFT JOIN subjects s ON sch.subject_id = s.id
      LEFT JOIN teachers t ON sch.teacher_id = t.id
      ORDER BY sch.day, sch.start_time
    `).all() as (Schedule & { class_name: string; subject_name: string; teacher_name: string })[];
  },
  
  getById: (id: number): (Schedule & { 
    class_name: string,
    subject_name: string,
    teacher_name: string 
  }) | undefined => {
    return db.prepare(`
      SELECT 
        sch.*,
        c.name as class_name,
        s.name as subject_name,
        t.name as teacher_name
      FROM schedules sch
      LEFT JOIN classes c ON sch.class_id = c.id
      LEFT JOIN subjects s ON sch.subject_id = s.id
      LEFT JOIN teachers t ON sch.teacher_id = t.id
      WHERE sch.id = ?
    `).get(id) as (Schedule & { class_name: string; subject_name: string; teacher_name: string }) | undefined;
  },
  
  create: (data: Omit<Schedule, 'id' | 'created_at'>): Schedule => {
    const result = db.prepare(`
      INSERT INTO schedules (
        class_id, subject_id, teacher_id, day, start_time, end_time
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      data.class_id,
      data.subject_id,
      data.teacher_id,
      data.day,
      data.start_time,
      data.end_time
    );
    return { id: result.lastInsertRowid as number, ...data, created_at: new Date().toISOString() };
  },
  
  update: (id: number, data: Partial<Schedule>): boolean => {
    const result = db.prepare(`
      UPDATE schedules SET 
        class_id = ?, subject_id = ?, teacher_id = ?,
        day = ?, start_time = ?, end_time = ?
      WHERE id = ?
    `).run(
      data.class_id,
      data.subject_id,
      data.teacher_id,
      data.day,
      data.start_time,
      data.end_time,
      id
    );
    return result.changes > 0;
  },
  
  delete: (id: number): boolean => {
    const result = db.prepare('DELETE FROM schedules WHERE id = ?').run(id);
    return result.changes > 0;
  }
};

// Attendance Operations
// Attendance Times Operations
export const attendanceTimesOperations = {
  getAll: (): AttendanceTime[] => {
    return db.prepare('SELECT * FROM attendance_times ORDER BY created_at DESC').all() as AttendanceTime[];
  },

  create: (data: Omit<AttendanceTime, 'id' | 'created_at'>): AttendanceTime => {
    const result = db
      .prepare('INSERT INTO attendance_times (name, start_time, end_time) VALUES (?, ?, ?)')
      .run(data.name, data.start_time, data.end_time);
    return { id: result.lastInsertRowid as number, ...data, created_at: new Date().toISOString() };
  },

  update: (id: number, data: Partial<AttendanceTime>): void => {
    const sets: string[] = [];
    const values: any[] = [];
    
    if (data.name !== undefined) {
      sets.push('name = ?');
      values.push(data.name);
    }
    if (data.start_time !== undefined) {
      sets.push('start_time = ?');
      values.push(data.start_time);
    }
    if (data.end_time !== undefined) {
      sets.push('end_time = ?');
      values.push(data.end_time);
    }

    if (sets.length > 0) {
      values.push(id);
      db.prepare(`UPDATE attendance_times SET ${sets.join(', ')} WHERE id = ?`).run(...values);
    }
  },

  delete: (id: number): void => {
    db.prepare('DELETE FROM attendance_times WHERE id = ?').run(id);
  }
};

// Attendance Records Operations
export const attendanceRecordsOperations = {
  getAll: (): AttendanceRecord[] => {
    return db.prepare(`
      SELECT 
        ar.*,
        s.name as student_name,
        c.name as class_name,
        sub.name as subject_name
      FROM attendance_records ar
      LEFT JOIN students s ON ar.student_id = s.id
      LEFT JOIN classes c ON ar.class_id = c.id
      LEFT JOIN subjects sub ON ar.subject_id = sub.id
      ORDER BY ar.date DESC, ar.created_at DESC
    `).all() as AttendanceRecord[];
  },

  create: (data: Omit<AttendanceRecord, 'id' | 'created_at' | 'student_name' | 'class_name' | 'subject_name'>): AttendanceRecord => {
    const result = db
      .prepare('INSERT INTO attendance_records (student_id, class_id, subject_id, attendance_time_id, status, date) VALUES (?, ?, ?, ?, ?, ?)')
      .run(data.student_id, data.class_id, data.subject_id, data.attendance_time_id, data.status, data.date);
    return { id: result.lastInsertRowid as number, ...data, created_at: new Date().toISOString() } as AttendanceRecord;
  },

  update: (id: number, data: Partial<AttendanceRecord>): void => {
    const sets: string[] = [];
    const values: any[] = [];
    
    if (data.status !== undefined) {
      sets.push('status = ?');
      values.push(data.status);
    }
    if (data.date !== undefined) {
      sets.push('date = ?');
      values.push(data.date);
    }

    if (sets.length > 0) {
      values.push(id);
      db.prepare(`UPDATE attendance_records SET ${sets.join(', ')} WHERE id = ?`).run(...values);
    }
  },

  delete: (id: number): void => {
    db.prepare('DELETE FROM attendance_records WHERE id = ?').run(id);
  },

  getByDateRange: (startDate: string, endDate: string): AttendanceRecord[] => {
    return db.prepare(`
      SELECT 
        ar.*,
        s.name as student_name,
        c.name as class_name,
        sub.name as subject_name
      FROM attendance_records ar
      LEFT JOIN students s ON ar.student_id = s.id
      LEFT JOIN classes c ON ar.class_id = c.id
      LEFT JOIN subjects sub ON ar.subject_id = sub.id
      WHERE ar.date BETWEEN ? AND ?
      ORDER BY ar.date ASC, ar.created_at ASC
    `).all(startDate, endDate) as AttendanceRecord[];
  }
};

// Attendance Operations
export const attendanceOperations = {
  getAll: (): (Attendance & {
    student_name: string,
    class_name: string,
    subject_name: string
  })[] => {
    return db.prepare(`
      SELECT 
        a.*,
        st.name as student_name,
        c.name as class_name,
        su.name as subject_name
      FROM attendance a
      LEFT JOIN students st ON a.student_id = st.id
      LEFT JOIN schedules sch ON a.schedule_id = sch.id
      LEFT JOIN classes c ON sch.class_id = c.id
      LEFT JOIN subjects su ON sch.subject_id = su.id
      ORDER BY a.date DESC, st.name
    `).all() as (Attendance & { student_name: string; class_name: string; subject_name: string })[];
  },
  
  getByDate: (date: string): (Attendance & {
    student_name: string,
    class_name: string,
    subject_name: string
  })[] => {
    return db.prepare(`
      SELECT 
        a.*,
        st.name as student_name,
        c.name as class_name,
        su.name as subject_name
      FROM attendance a
      LEFT JOIN students st ON a.student_id = st.id
      LEFT JOIN schedules sch ON a.schedule_id = sch.id
      LEFT JOIN classes c ON sch.class_id = c.id
      LEFT JOIN subjects su ON sch.subject_id = su.id
      WHERE a.date = ?
      ORDER BY st.name
    `).all(date) as (Attendance & { student_name: string; class_name: string; subject_name: string })[];
  },
  
  create: (data: Omit<Attendance, 'id' | 'created_at'>): Attendance => {
    const result = db.prepare(`
      INSERT INTO attendance (student_id, schedule_id, date, status)
      VALUES (?, ?, ?, ?)
    `).run(
      data.student_id,
      data.schedule_id,
      data.date,
      data.status
    );
    return { id: result.lastInsertRowid as number, ...data, created_at: new Date().toISOString() };
  },
  
  update: (id: number, data: Partial<Attendance>): boolean => {
    const result = db.prepare(`
      UPDATE attendance SET 
        student_id = ?, schedule_id = ?, date = ?, status = ?
      WHERE id = ?
    `).run(
      data.student_id,
      data.schedule_id,
      data.date,
      data.status,
      id
    );
    return result.changes > 0;
  },
  
  delete: (id: number): boolean => {
    const result = db.prepare('DELETE FROM attendance WHERE id = ?').run(id);
    return result.changes > 0;
  }
};
