import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captcha, setCaptcha] = useState(() => generateCaptchaValue());
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  function generateCaptchaValue() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let newCaptcha = "";
    for (let i = 0; i < 5; i++) {
      newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return newCaptcha;
  }

  const showMessage = (text, type = 'error') => {
    setMessage({ text, type });
  };

  const generateCaptcha = () => {
    setCaptcha(generateCaptchaValue());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !captchaInput) {
      showMessage('Please complete all fields.');
      return;
    }

    if (captchaInput.toUpperCase() !== captcha) {
      showMessage('CAPTCHA does not match.');
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      // ✅ Backend returns user → store in frontend
      const userData = {
        token: "dummy-token",
        role: data.role || "student",
        email: data.email,
        name: data.name || data.email.split('@')[0]
      };

      onLogin(userData);
      showMessage('Login successful!', 'success');
      navigate(userData.role === 'admin' ? '/admin' : '/student');

    } catch (error) {
      showMessage('Login failed. Check email/password.');
      generateCaptcha();
      setCaptchaInput('');
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand-header">
          <div className="brand-mark">E</div>
          <div>
            <h1>Extracurricular Platform</h1>
            <p>Manage student activities, registrations, and notifications.</p>
          </div>
        </div>

        <div className="auth-card">
          <h2>Login</h2>
          <p className="auth-subtitle">
            Enter your email and password to continue.
          </p>

          {message && (
            <div className={`message-box ${message.type}`}>
              {message.text}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="Enter password"
              />
            </label>

            <div className="captcha-row">
              <div className="captcha-box">{captcha}</div>
              <button
                type="button"
                className="icon-button"
                onClick={generateCaptcha}
              >
                ↻
              </button>
            </div>

            <label className="form-field">
              <span>CAPTCHA</span>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter CAPTCHA"
              />
            </label>

            <button type="submit" className="primary-button">
              Log In
            </button>
          </form>

          <div className="auth-footer">
            <span>New here?</span>
            <Link to="/signup">Create an account</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;