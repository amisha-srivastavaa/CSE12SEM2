import React from 'react';

function Student({ name, course, marks }) {
  // Determine color based on marks
  let marksColor = '#10b981'; // Green for high marks
  if (marks < 75) marksColor = '#f59e0b'; // Yellow for medium
  if (marks < 60) marksColor = '#ef4444'; // Red for low

  return (
    <div className="student-card">
      <div className="student-avatar">
        {name.charAt(0)}
      </div>
      <div className="student-info">
        <h2>{name}</h2>
        <p className="course">{course}</p>
        <div className="marks-container">
          <span>Marks:</span>
          <strong style={{ color: marksColor }}>{marks}/100</strong>
        </div>
      </div>
    </div>
  );
}

export default Student;
