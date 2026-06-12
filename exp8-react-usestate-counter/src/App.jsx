import React, { useState } from 'react';

function App() {
  // Initialize state with 0
  const [count, setCount] = useState(0);

  // Event handlers
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  // Determine color based on value
  let counterClass = 'counter-value neutral';
  if (count > 0) counterClass = 'counter-value positive';
  if (count < 0) counterClass = 'counter-value negative';

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>React Counter</h1>
        <p>Experiment 8: State Management using <code>useState</code></p>
        <a href="../../index.html" className="back-link">Exit</a>
      </header>
      
      <main className="counter-card">
        <h2 className={counterClass}>{count}</h2>
        
        <div className="button-group">
          <button onClick={decrement} className="btn btn-danger">
            - Decrement
          </button>
          <button onClick={reset} className="btn btn-secondary">
            Reset
          </button>
          <button onClick={increment} className="btn btn-success">
            + Increment
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
