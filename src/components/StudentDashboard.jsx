import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const API_BACKEND_HOSTS = [
  API_BASE_URL,
  'http://127.0.0.1:2006/api'
];

const fetchWithFallback = async (path, options = {}) => {
  let lastError;
  for (const base of API_BACKEND_HOSTS) {
    try {
      const response = await fetch(`${base}${path}`, options);
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

const activities = [
  {
    id: 'activity-1',
    title: 'Robotics Club Showcase',
    type: 'Club',
    level: 'Beginner',
    date: '2026-03-12T17:00:00',
    capacity: 40,
    registered: 28,
    description: 'Showcase intelligent robotics projects and demos.',
    venue: 'Innovation Hub Auditorium',
    address: '123 Tech Street, University Campus',
    location: 'Building A, Room 301',
    time: '5:00 PM - 7:00 PM',
    organizer: 'Robotics Club'
  },
  {
    id: 'activity-2',
    title: 'Campus Marathon Training',
    type: 'Sports',
    level: 'Intermediate',
    date: '2026-03-18T06:30:00',
    capacity: 60,
    registered: 34,
    description: 'Weekly training session for the campus marathon.',
    venue: 'Central Sports Ground',
    address: '456 Athletic Avenue, University Campus',
    location: 'South Field',
    time: '6:30 AM - 8:00 AM',
    organizer: 'Sports Committee'
  },
  {
    id: 'activity-3',
    title: 'Art & Design Hackathon',
    type: 'Hackathon',
    level: 'All Levels',
    date: '2026-03-22T10:00:00',
    capacity: 80,
    registered: 39,
    description: 'A 24-hour creative sprint for designers and makers.',
    venue: 'Creative Commons Workspace',
    address: '789 Art Lane, University Campus',
    location: 'Building C, Floors 1-2',
    time: '10:00 AM - 10:00 AM (Next Day)',
    organizer: 'Design Club'
  },
  {
    id: 'activity-4',
    title: 'Green Campus Volunteer Drive',
    type: 'Outreach',
    level: 'Beginner',
    date: '2026-04-01T15:00:00',
    capacity: 50,
    registered: 22,
    description: 'Tree planting and sustainability initiatives.',
    venue: 'Campus Green Area',
    address: '321 Nature Park, University Campus',
    location: 'Main Courtyard',
    time: '3:00 PM - 5:00 PM',
    organizer: 'Environmental Club'
  },
  {
    id: 'activity-5',
    title: 'Community Outreach Trip',
    type: 'Outreach',
    level: 'All Levels',
    date: '2026-04-10T09:00:00',
    capacity: 45,
    registered: 18,
    description: 'A volunteer trip to support local community initiatives.',
    venue: 'Riverside Community Center',
    address: '101 Outreach Drive, University Campus',
    location: 'Main Lobby',
    time: '9:00 AM - 2:00 PM',
    organizer: 'Volunteer Services'
  }
];

const categories = [
  { key: 'Clubs', label: 'Clubs', type: 'Club', description: 'Join student clubs to learn new skills and connect with peers.' },
  { key: 'Sports', label: 'Sports', type: 'Sports', description: 'Participate in active sports sessions and team training.' },
  { key: 'Hackathons', label: 'Hackathons', type: 'Hackathon', description: 'Join creative hackathons and solve real problems with your team.' },
  { key: 'Outreach', label: 'Outreach Trips', type: 'Outreach', description: 'Support community outreach and volunteer-driven campus trips.' }
];

const notifications = [
  {
    id: 'note-1',
    title: 'Welcome to Campus Activity Hub!',
    message: 'Explore clubs, sports, and events curated for you.',
    status: 'unread',
    date: 'Feb 20, 2026'
  },
  {
    id: 'note-2',
    title: 'New event available',
    message: 'Register for the upcoming Art & Design Hackathon before seats fill up.',
    status: 'unread',
    date: 'Feb 22, 2026'
  }
];

function StudentDashboard({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [registeredActivities, setRegisteredActivities] = useState(() => {
    // Load registered activities from localStorage
    return JSON.parse(localStorage.getItem('studentRegistrations') || '[]');
  });
  const [selectedCategory, setSelectedCategory] = useState('Clubs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState(null);
  const [registrationForm, setRegistrationForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    specialRequirements: ''
  });

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        const response = await fetchWithFallback(`/registrations?email=${encodeURIComponent(user.email)}`);
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (data.registrations && Array.isArray(data.registrations)) {
          const registeredIds = data.registrations
            .map(reg => activities.find(activity => activity.title === reg.eventTitle))
            .filter(Boolean)
            .map(activity => activity.id);

          setRegisteredActivities(registeredIds);
          localStorage.setItem('studentRegistrations', JSON.stringify(registeredIds));
        }
      } catch (error) {
        console.warn('Unable to load registrations from DB:', error);
      }
    };

    if (user?.email) {
      loadRegistrations();
    }
  }, [user?.email]);

  useEffect(() => {
    let scrollY = 0;

    if (showRegistrationModal || showDetailsModal) {
      scrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      if (top) {
        window.scrollTo(0, -parseInt(top, 10));
      }
    }

    return () => {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      if (top) {
        window.scrollTo(0, -parseInt(top, 10));
      }
    };
  }, [showRegistrationModal, showDetailsModal]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isRegistered = (activityId) => {
    return registeredActivities.includes(activityId);
  };

  const saveLocalActivityRegistration = (activityId) => {
    const updated = [...registeredActivities, activityId];
    setRegisteredActivities(updated);
    localStorage.setItem('studentRegistrations', JSON.stringify(updated));
    return updated;
  };

  const registerForActivity = (activityId) => {
    if (isRegistered(activityId)) return;

    saveLocalActivityRegistration(activityId);
  };

  const handleOpenRegistrationModal = (activity) => {
    setSelectedActivity(activity);
    setShowRegistrationModal(true);
  };

  const handleCloseRegistrationModal = () => {
    setShowRegistrationModal(false);
    setSelectedActivity(null);
  };

  const handleOpenDetailsModal = (activity) => {
    setSelectedActivity(activity);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedActivity(null);
  };

  const handleRegistrationFormChange = (e) => {
    const { name, value } = e.target;
    setRegistrationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (!registrationMessage) return;
    const timer = setTimeout(() => setRegistrationMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [registrationMessage]);

  const handleSubmitRegistration = async () => {
    if (!registrationForm.fullName || !registrationForm.email || !registrationForm.phone) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetchWithFallback(`/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: registrationForm.email,
          fullName: registrationForm.fullName,
          phone: registrationForm.phone,
          specialRequirements: registrationForm.specialRequirements,
          eventId: selectedActivity.id,
          eventTitle: selectedActivity.title
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      saveLocalActivityRegistration(selectedActivity.id);
      setRegistrationMessage({
        type: 'success',
        text: `Successfully registered for "${selectedActivity.title}"!`
      });
      handleCloseRegistrationModal();
      setRegistrationForm({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        specialRequirements: ''
      });
    } catch (error) {
      console.warn('Registration error, using local fallback:', error);
      saveLocalActivityRegistration(selectedActivity.id);
      setRegistrationMessage({
        type: 'success',
        text: `Registered "${selectedActivity.title}" locally. Backend unavailable.`
      });
      handleCloseRegistrationModal();
      setRegistrationForm({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        specialRequirements: ''
      });
    }
  };

  const unregisterActivity = async (activityId) => {
    try {
      await fetchWithFallback(`/registrations?email=${encodeURIComponent(user.email)}&eventId=${encodeURIComponent(activityId)}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.warn('Unable to delete registration from DB:', error);
    }

    const updated = registeredActivities.filter(id => id !== activityId);
    setRegisteredActivities(updated);
    localStorage.setItem('studentRegistrations', JSON.stringify(updated));
  };

  const renderDashboard = () => {
    const upcomingEvents = activities.filter(activity => new Date(activity.date) >= new Date()).length;
    const category = categories.find(cat => cat.key === selectedCategory);
    const sectionActivities = category ? activities.filter(activity => activity.type === category.type) : [];

    return (
      <section className="hero-card">
        <div>
          <span className="eyebrow">Campus Activity Hub</span>
          <h1>Welcome back, {user.name}</h1>
          <p>You have {upcomingEvents} events this week</p>
        </div>

        <div className="dashboard-category-grid">
          {categories.map(category => {
            const count = activities.filter(activity => activity.type === category.type).length;
            return (
              <button
                key={category.key}
                className={`category-card ${selectedCategory === category.key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.key)}
              >
                <div className="category-card-icon">{category.key === 'Clubs' ? '🤝' : category.key === 'Sports' ? '🏃' : category.key === 'Hackathons' ? '💡' : '🌱'}</div>
                <div>
                  <h4>{category.label}</h4>
                  <p>{category.description}</p>
                  <span>{count} events</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="dashboard-section-details">
          <div className="dashboard-section-header">
            <div>
              <h3>{category?.label || 'Section'} Details</h3>
              <p>{category?.description}</p>
            </div>
            <span>{sectionActivities.length} {sectionActivities.length === 1 ? 'event' : 'events'}</span>
          </div>

          <div className="upcoming-dates-panel">
            <h4>Upcoming Dates</h4>
            <div className="upcoming-dates-list">
              {sectionActivities
                .filter(activity => new Date(activity.date) >= new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map(activity => (
                  <div key={activity.id} className="date-item">
                    <span className="date-label">{formatDate(activity.date)}</span>
                    <span className="date-title">{activity.title}</span>
                  </div>
                ))}
            </div>
          </div>

          {sectionActivities.length === 0 ? (
            <div className="empty-card">
              <p>No events found in this section yet.</p>
            </div>
          ) : (
            sectionActivities.map(activity => (
              <article key={activity.id} className="activity-card">
                <div>
                  <span className="activity-pill">{activity.type}</span>
                  <span className="activity-meta">{activity.level}</span>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                </div>
                <div className="activity-footer">
                  <span>📅 {formatDate(activity.date)}</span>
                  <span>👥 {activity.capacity - activity.registered} seats left / {activity.capacity}</span>
                </div>
                <div className="activity-actions">
                  <button
                    className="ghost-button"
                    onClick={() => handleOpenDetailsModal(activity)}
                  >
                    View Details
                  </button>
                  <button
                    className="primary-button"
                    onClick={() => handleOpenRegistrationModal(activity)}
                    disabled={isRegistered(activity.id)}
                  >
                    {isRegistered(activity.id) ? 'Registered' : 'Register Now'}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    );
  };

  const renderBrowseActivities = () => {
    const filtered = activities.filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || activity.type === filterType;
      return matchesSearch && matchesType;
    });

    return (
      <section className="hero-card">
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '400px',
              marginBottom: '16px'
            }}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              marginLeft: '16px'
            }}
          >
            <option value="all">All Types</option>
            <option value="Club">Club</option>
            <option value="Sports">Sports</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Outreach">Outreach Trips</option>
          </select>
        </div>

        <div id="browseActivities">
          {filtered.length === 0 ? (
            <div className="empty-card">
              <p>No activities match your search.</p>
            </div>
          ) : (
            filtered.map(activity => (
              <article key={activity.id} className="activity-card">
                <div>
                  <span className="activity-pill">{activity.type}</span>
                  <span className="activity-meta">{activity.level}</span>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                </div>
                <div className="activity-footer">
                  <span>📅 {formatDate(activity.date)}</span>
                  <span>👥 {activity.capacity - activity.registered} seats left</span>
                </div>
                <div className="activity-actions">
                  <button 
                    className="ghost-button"
                    onClick={() => handleOpenDetailsModal(activity)}
                  >
                    View Details
                  </button>
                  <button
                    className="primary-button"
                    onClick={() => handleOpenRegistrationModal(activity)}
                    disabled={isRegistered(activity.id)}
                  >
                    {isRegistered(activity.id) ? 'Registered' : 'Register Now'}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    );
  };

  const renderParticipation = () => {
    const registered = activities.filter(activity => registeredActivities.includes(activity.id));

    return (
      <section className="hero-card">
        <h3>My Participation</h3>
        {registered.length === 0 ? (
          <div className="empty-state-card">
            <h3>No activity registrations yet</h3>
            <p>Browse events and register for your first activity to see it here.</p>
          </div>
        ) : (
          <div className="participation-grid">
            {registered.map(activity => (
              <article key={activity.id} className="participation-card">
                <div>
                  <span className="activity-pill">{activity.type}</span>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                  <p>{formatDate(activity.date)}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                  <span className="status-pill">Registered</span>
                  <button className="ghost-button" onClick={() => unregisterActivity(activity.id)}>
                    Unregister
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderProfile = () => {
    const registered = activities.filter(activity => registeredActivities.includes(activity.id));

    return (
      <section className="hero-card profile-card">
        <div className="profile-header">
          <div>
            <h2>Profile</h2>
            <p>Review your account details and activity registrations.</p>
          </div>
        </div>

        <div className="profile-summary">
          <div>
            <h3>Name</h3>
            <p>{user.name}</p>
          </div>
          <div>
            <h3>Email</h3>
            <p>{user.email}</p>
          </div>
          <div>
            <h3>Role</h3>
            <p>Student</p>
          </div>
          <div>
            <h3>Registered Activities</h3>
            <p>{registered.length}</p>
          </div>
        </div>

        <div className="profile-registrations">
          <h3>Registered Activities</h3>
          {registered.length === 0 ? (
            <div className="empty-state-card">
              <h3>No registered activities</h3>
              <p>Register for activities from the Browse Activities section.</p>
            </div>
          ) : (
            registered.map(activity => (
              <article key={activity.id} className="activity-card">
                <div>
                  <span className="activity-pill">{activity.type}</span>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                  <p>{formatDate(activity.date)}</p>
                </div>
                <button className="ghost-button" onClick={() => unregisterActivity(activity.id)}>
                  Unregister
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    );
  };

  const renderNotifications = () => {
    return (
      <section className="hero-card">
        <h3>Notifications</h3>
        {notifications.map(notification => (
          <article key={notification.id} className="activity-card">
            <div>
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <small>{notification.date}</small>
            </div>
            {notification.status === 'unread' && (
              <span style={{
                background: '#667eea',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                Unread
              </span>
            )}
          </article>
        ))}
      </section>
    );
  };

  const renderCalendar = () => {
    const sortedCalendarEvents = [...activities].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
      <section className="hero-card">
        <div className="calendar-header">
          <h3>Calendar</h3>
          <p>All events sorted by date, earliest first.</p>
        </div>

        {sortedCalendarEvents.length === 0 ? (
          <div className="empty-card">
            <p>No events are scheduled yet.</p>
          </div>
        ) : (
          <div className="calendar-list">
            {sortedCalendarEvents.map(event => (
              <div key={event.id} className="calendar-item">
                <div className="calendar-item-main">
                  <span className="date-label">{formatDate(event.date)}</span>
                  <span className="date-title">{event.title}</span>
                </div>
                <div className="date-meta">
                  <span>{event.type}</span>
                  <span>{event.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'browse':
        return renderBrowseActivities();
      case 'participation':
        return renderParticipation();
      case 'profile':
        return renderProfile();
      case 'notifications':
        return renderNotifications();
      case 'calendar':
        return renderCalendar();
      default:
        return renderDashboard();
    }
  };

  // Registration Modal Component
  const RegistrationModal = () => {
    if (!showRegistrationModal || !selectedActivity) return null;

    return (
      <div className="modal-overlay" onClick={handleCloseRegistrationModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Register for Activity</h2>
            <button 
              className="modal-close"
              onClick={handleCloseRegistrationModal}
            >
              ✕
            </button>
          </div>

          <div className="modal-body">
            {registrationMessage && (
              <div className={`message-box ${registrationMessage.type}`}>
                {registrationMessage.text}
              </div>
            )}
            <div className="activity-summary">
              <h3>{selectedActivity.title}</h3>
              <p className="modal-subtitle">{selectedActivity.description}</p>
            </div>

            <form className="registration-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={registrationForm.fullName}
                  onChange={handleRegistrationFormChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={registrationForm.email}
                  onChange={handleRegistrationFormChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={registrationForm.phone}
                  onChange={handleRegistrationFormChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label>Special Requirements</label>
                <textarea
                  name="specialRequirements"
                  value={registrationForm.specialRequirements}
                  onChange={handleRegistrationFormChange}
                  placeholder="Any special requirements or dietary needs?"
                  rows="4"
                />
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button 
              className="ghost-button"
              onClick={handleCloseRegistrationModal}
            >
              Cancel
            </button>
            <button 
              className="primary-button"
              onClick={handleSubmitRegistration}
            >
              Confirm Registration
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Details Modal Component
  const DetailsModal = () => {
    if (!showDetailsModal || !selectedActivity) return null;

    const date = new Date(selectedActivity.date);
    const day = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return (
      <div className="modal-overlay" onClick={handleCloseDetailsModal}>
        <div className="modal-content modal-content-large" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Activity Details</h2>
            <button 
              className="modal-close"
              onClick={handleCloseDetailsModal}
            >
              ✕
            </button>
          </div>

          <div className="modal-body">
            <div className="details-header">
              <h3>{selectedActivity.title}</h3>
              <div className="details-badges">
                <span className="activity-pill">{selectedActivity.type}</span>
                <span className="activity-meta">{selectedActivity.level}</span>
              </div>
            </div>

            <p className="details-description">{selectedActivity.description}</p>

            <div className="details-grid">
              <div className="detail-item">
                <h4>📅 Date & Time</h4>
                <p>{day}</p>
                <p className="detail-value">{selectedActivity.time}</p>
              </div>

              <div className="detail-item">
                <h4>📍 Venue</h4>
                <p className="detail-value">{selectedActivity.venue}</p>
              </div>

              <div className="detail-item">
                <h4>🏢 Location</h4>
                <p className="detail-value">{selectedActivity.location}</p>
              </div>

              <div className="detail-item">
                <h4>🗺️ Address</h4>
                <p className="detail-value">{selectedActivity.address}</p>
              </div>

              <div className="detail-item">
                <h4>👥 Capacity</h4>
                <p className="detail-value">{selectedActivity.capacity} participants</p>
              </div>

              <div className="detail-item">
                <h4>📊 Registered</h4>
                <p className="detail-value">
                  {selectedActivity.registered} / {selectedActivity.capacity} ({Math.round(selectedActivity.registered / selectedActivity.capacity * 100)}%)
                </p>
              </div>

              <div className="detail-item">
                <h4>🎯 Organizer</h4>
                <p className="detail-value">{selectedActivity.organizer}</p>
              </div>

              <div className="detail-item">
                <h4>📌 Available Seats</h4>
                <p className="detail-value" style={{ color: '#22c55e', fontWeight: 'bold' }}>
                  {selectedActivity.capacity - selectedActivity.registered} seats available
                </p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              className="ghost-button"
              onClick={handleCloseDetailsModal}
            >
              Close
            </button>
            <button 
              className="primary-button"
              onClick={() => {
                handleCloseDetailsModal();
                handleOpenRegistrationModal(selectedActivity);
              }}
              disabled={isRegistered(selectedActivity.id)}
            >
              {isRegistered(selectedActivity.id) ? 'Already Registered' : 'Register Now'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="student-layout">
      <aside className="student-sidebar">
        <div className="sidebar-brand">
          <div>
            <h2>Student Hub</h2>
            <p>Your Activities</p>
          </div>
        </div>
        <nav className="student-nav">
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-item ${activeSection === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveSection('browse')}
          >
            Browse Activities
          </button>
          <button
            className={`nav-item ${activeSection === 'participation' ? 'active' : ''}`}
            onClick={() => setActiveSection('participation')}
          >
            My Participation
          </button>
          <button
            className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            Profile
          </button>
          <button
            className={`nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            Notifications
          </button>
          <button
            className={`nav-item ${activeSection === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveSection('calendar')}
          >
            Calendar
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="help-card">
            <span>Need help?</span>
            <a href="mailto:support@campus.com">support@campus.com</a>
          </div>
        </div>
      </aside>

      <main className="student-main">
        <header className="topbar">
          <div>
            <span className="eyebrow">Campus Activity Hub</span>
            <h1>Welcome back, {user.name}</h1>
          </div>
          <div className="topbar-actions">
            <button className="icon-button bell-button" title="Notifications">🔔</button>
            <div className="user-meta">
              <span className="user-email">{user.email}</span>
              <span className="user-role">STUDENT</span>
            </div>
            <button className="logout-button" onClick={onLogout}>Logout</button>
          </div>
        </header>

        {registrationMessage && (
          <div className={`message-box ${registrationMessage.type}`} style={{ margin: '20px 0' }}>
            {registrationMessage.text}
          </div>
        )}

        {renderContent()}
      </main>

      <RegistrationModal />
      <DetailsModal />
    </div>
  );
}

export default StudentDashboard;