import React, { useState, useEffect } from 'react';

function StudentForm({ onSubmit, editingStudent, onCancelEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: ''
  });

  useEffect(() => {
    if (editingStudent) {
      setFormData(editingStudent);
    } else {
      setFormData({ name: '', email: '', course: '' });
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.course) return;
    
    onSubmit(formData);
    
    // Reset form if not editing
    if (!editingStudent) {
      setFormData({ name: '', email: '', course: '' });
    }
  };

  return (
    <div className="dashboard-card mb-4">
      <div className="card-header-custom">
        {editingStudent ? 'Edit Student Record' : 'Add New Student'}
      </div>
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-control form-control-custom" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control form-control-custom" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Course</label>
            <select 
              className="form-select form-control-custom" 
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a course</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mechanical Eng">Mechanical Eng</option>
              <option value="Electrical Eng">Electrical Eng</option>
              <option value="Civil Eng">Civil Eng</option>
              <option value="Business Admin">Business Admin</option>
            </select>
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary-custom">
              {editingStudent ? 'Update Student' : 'Add Student'}
            </button>
            {editingStudent && (
              <button type="button" className="btn btn-light rounded-3 fw-bold" onClick={onCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
