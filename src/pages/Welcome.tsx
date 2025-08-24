import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Welcome = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = username.trim();
    if (trimmedName && trimmedName.length <= 20) {
      localStorage.setItem('matladu_username', trimmedName);
      navigate('/chat');
    }
  };

  return (
    <div className="intro-container">
      <h1>Welcome to matladu.com</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
          required
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default Welcome;