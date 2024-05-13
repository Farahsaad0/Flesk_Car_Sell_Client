import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/reset-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to reset password. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
      <div className="link-container">
        <a href="/forgot-password" className="forgot-password-link">
          Forgot Password?
        </a>
      </div>
    </div>
  );
};

export default ResetPassword;
