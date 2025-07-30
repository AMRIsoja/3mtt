import React, { useState } from 'react';
import './App.css';

function App() {
  // 1. useState to track counter value
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  // 2. Function to increase counter
  const handleIncrease = () => {
    if (count >= 10) {
      setMessage("You've reached the limit!");
      return;
    }
    setCount(count + 1);
    setMessage(''); // Clear message
  };

  // 3. Function to decrease counter
  const handleDecrease = () => {
    if (count > 0) {
      setCount(count - 1);
      setMessage('');
    } else {
      setMessage("Counter can't go below 0!");
    }
  };

  return (
    <div className="App">
      <h1>React Counter App</h1>
      <h2>Count: {count}</h2>

      <div>
        <button onClick={handleIncrease}>Increase</button>
        <button onClick={handleDecrease}>Decrease</button>
      </div>

      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}

export default App;
