import React from 'react';
import Student from './Student';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Student Roster</h1>
        <p>Experiment 7: React Components & Props</p>
        <a href="../../index.html" className="back-link">Exit</a>
      </header>
      
      <main className="student-grid">
        {/* Reusing the Student component with different props */}
        <Student 
          name="Amisha Srivastava" 
          course="B.Tech Computer Science" 
          marks={95} 
        />
        <Student 
          name="John Doe" 
          course="Mechanical Engineering" 
          marks={78} 
        />
        <Student 
          name="Jane Smith" 
          course="Electrical Engineering" 
          marks={88} 
        />
        <Student 
          name="Mark Johnson" 
          course="Civil Engineering" 
          marks={65} 
        />
      </main>
    </div>
  );
}

export default App;
