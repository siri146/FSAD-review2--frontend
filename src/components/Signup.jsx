import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function Signup({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();


  const showMessage = (text, type = 'error') => {
    setMessage({ text, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      showMessage('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      showMessage('Password should be at least 6 characters.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await response.json();
      onLogin(data);
      navigate('/student');
    } catch (error) {
      console.error(error);
      showMessage(error.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand-header">
          <div className="brand-mark">E</div>
          <div>
            <h1>Extracurricular Platform</h1>
            <p>Create your account to join student activities and events.</p>
          </div>
        </div>

        <div className="auth-card">
          <h2>Signup</h2>
          <p className="auth-subtitle">Fill in your details below to create an account.</p>

          {message && (
            <div className={`message-box ${message.type}`}>
              {message.text}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </label>

            <label className="form-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label className="form-field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </label>

            <label className="form-field">
              <span>Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
              />
            </label>

            <button type="submit" className="primary-button">
              Create Account
            </button>
          </form>

          <div className="auth-footer">
            <span>Already have an account?</span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Signup;
