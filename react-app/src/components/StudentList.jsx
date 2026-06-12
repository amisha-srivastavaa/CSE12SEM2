import React from 'react';

function StudentList({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="dashboard-card p-5 text-center">
        <h4 className="text-muted">No students found.</h4>
        <p className="text-muted mb-0">Use the form to add a new student.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="card-header-custom d-flex justify-content-between align-items-center">
        <span>Enrolled Students</span>
        <span className="badge bg-primary rounded-pill">{students.length} Total</span>
      </div>
      <div className="table-responsive">
        <table className="table table-custom table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>
                  <span className="badge-course">{student.course}</span>
                </td>
                <td className="text-end">
                  <button 
                    className="btn-icon edit me-2" 
                    onClick={() => onEdit(student)}
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="btn-icon delete" 
                    onClick={() => onDelete(student.id)}
                    title="Delete"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentList;
