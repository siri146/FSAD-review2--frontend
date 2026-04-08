import { useState } from 'react';

function AdminDashboard({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('add-activity');
  const [activities, setActivities] = useState(() => {
    // Load activities from localStorage or initialize with sample data
    const storedActivities = JSON.parse(localStorage.getItem('adminActivities') || '[]');
    if (storedActivities.length === 0) {
      // Initialize with sample activities
      const sampleActivities = [
        { id: 1, title: 'Robotics Club Showcase', type: 'Club', date: '2026-03-12' },
        { id: 2, title: 'Campus Marathon Training', type: 'Sports', date: '2026-03-18' },
        { id: 3, title: 'Art & Design Hackathon', type: 'Event', date: '2026-03-22' }
      ];
      localStorage.setItem('adminActivities', JSON.stringify(sampleActivities));
      return sampleActivities;
    }
    return storedActivities;
  });
  const [newActivity, setNewActivity] = useState({
    title: '',
    type: '',
    date: ''
  });
  const [students] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', activities: 2 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', activities: 1 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', activities: 3 }
  ]);

  const addActivity = () => {
    if (!newActivity.title || !newActivity.type || !newActivity.date) {
      alert('Please fill in all fields.');
      return;
    }

    const activity = {
      id: Date.now(),
      ...newActivity
    };

    const updatedActivities = [...activities, activity];
    setActivities(updatedActivities);
    localStorage.setItem('adminActivities', JSON.stringify(updatedActivities));

    // Clear form
    setNewActivity({ title: '', type: '', date: '' });
    alert('Activity added successfully!');
  };

  const deleteActivity = (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      const updatedActivities = activities.filter(activity => activity.id !== id);
      setActivities(updatedActivities);
      localStorage.setItem('adminActivities', JSON.stringify(updatedActivities));
    }
  };

  const renderAddActivity = () => (
    <section id="add-activity-section" className="content-section active">
      <h2>Add Activity</h2>
      <div className="form-container">
        <input
          type="text"
          placeholder="Title"
          value={newActivity.title}
          onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
        />
        <input
          type="text"
          placeholder="Type"
          value={newActivity.type}
          onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
        />
        <input
          type="date"
          placeholder="Date"
          value={newActivity.date}
          onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
        />
        <button onClick={addActivity}>Add</button>
      </div>
    </section>
  );

  const renderViewActivities = () => (
    <section id="view-activities-section" className="content-section active">
      <h2>Current Activities</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(activity => (
            <tr key={activity.id}>
              <td>{activity.title}</td>
              <td>{activity.type}</td>
              <td>{activity.date}</td>
              <td>
                <button
                  onClick={() => deleteActivity(activity.id)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  const renderManageStudents = () => (
    <section id="manage-students-section" className="content-section active">
      <h2>Manage Students</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Activities</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.activities}</td>
              <td>
                <button
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '4px'
                  }}
                >
                  View
                </button>
                <button
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  const renderReports = () => (
    <section className="content-section active">
      <h2>Reports</h2>
      <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h3>Activity Statistics</h3>
        <p>Total Activities: {activities.length}</p>
        <p>Total Students: {students.length}</p>
        <p>Average Activities per Student: {(students.reduce((sum, s) => sum + s.activities, 0) / students.length).toFixed(1)}</p>
      </div>
    </section>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'add-activity':
        return renderAddActivity();
      case 'view-activities':
        return renderViewActivities();
      case 'manage-students':
        return renderManageStudents();
      case 'reports':
        return renderReports();
      default:
        return renderAddActivity();
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">Extracurricular Platform</div>
        <nav className="main-nav">
          <ul>
            <li>
              <a
                href="#"
                className={activeSection === 'add-activity' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('add-activity');
                }}
              >
                Add Activity
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeSection === 'view-activities' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('view-activities');
                }}
              >
                View Activities
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeSection === 'manage-students' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('manage-students');
                }}
              >
                Manage Students
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeSection === 'reports' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('reports');
                }}
              >
                Reports
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="user-info">Welcome, {user.name}!</div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

export default AdminDashboard;