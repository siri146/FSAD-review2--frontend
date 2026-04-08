import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Login from './components/Login';
import Signup from './components/Signup';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';

import './styles.css';

function App() {

  //  Load user from localStorage (persist login)
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');

    if (token && role && email) {
      return { token, role, email, name };
    }
    return null;
  });

  // ✅ FIXED login function
  const login = (userData) => {
    setUser(userData);

    localStorage.setItem('userToken', userData.token || "dummy-token"); // fix
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', userData.name);
  };

  // ✅ logout
  const logout = () => {
    setUser(null);

    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  };

  return (
    <Router>
      <div className="App">
        <Routes>

          {/* Default Route */}
          <Route
            path="/"
            element={
              user ? (
                user.role === 'admin' ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/student" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Login */}
          <Route
            path="/login"
            element={
              user ? (
                user.role === 'admin' ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/student" />
                )
              ) : (
                <Login onLogin={login} />
              )
            }
          />

          {/* Signup */}
          <Route
            path="/signup"
            element={
              user ? (
                user.role === 'admin' ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/student" />
                )
              ) : (
                <Signup onLogin={login} />
              )
            }
          />

          {/* Student Dashboard */}
          <Route
            path="/student"
            element={
              user && user.role === 'student' ? (
                <StudentDashboard user={user} onLogout={logout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              user && user.role === 'admin' ? (
                <AdminDashboard user={user} onLogout={logout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;