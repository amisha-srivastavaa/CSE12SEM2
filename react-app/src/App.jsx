import React, { useState } from 'react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';

function App() {
  // Initial dummy data
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', course: 'Computer Science' },
    { id: 2, name: 'Bob Jones', email: 'bob@example.com', course: 'Mechanical Eng' },
  ]);

  const [editingStudent, setEditingStudent] = useState(null);

  const handleAddStudent = (studentData) => {
    const newStudent = {
      id: Date.now(),
      ...studentData
    };
    setStudents([...students, newStudent]);
  };

  const handleUpdateStudent = (updatedStudent) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setEditingStudent(null);
  };

  const handleDeleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
  };

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="fw-bold">Student Management Dashboard</h1>
          <p className="text-muted">Manage enrollments, update records, and monitor student data efficiently.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <StudentForm 
            onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
            editingStudent={editingStudent}
            onCancelEdit={() => setEditingStudent(null)}
          />
        </div>
        <div className="col-lg-8">
          <StudentList 
            students={students} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteStudent} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;
