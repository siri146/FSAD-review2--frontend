# Extracurricular Platform - React Version

A modern React-based extracurricular activity management platform with login, signup, student dashboard, and admin dashboard.

## Features

### Authentication
- Login with CAPTCHA verification
- User registration
- Role-based access (Student/Admin)
- Persistent login state

### Student Dashboard
- Browse available activities
- Register for activities
- View participation history
- Notifications
- Activity search and filtering

### Admin Dashboard
- Add new activities
- View and manage activities
- Manage students
- Generate reports

## Technology Stack

- **React 19** - Frontend framework
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS** - Styling
- **Local Storage** - Data persistence

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Login.jsx          # Login page component
│   ├── Signup.jsx         # Registration page component
│   ├── StudentDashboard.jsx # Student dashboard
│   └── AdminDashboard.jsx # Admin dashboard
├── App.jsx                # Main app with routing
├── styles.css             # Global styles
└── main.jsx               # App entry point
```

## Default Credentials

### Admin Login
- Email: `admin@gmail.com`
- Password: `1234`

### Student Login
- Any email with password length >= 4 characters

## Migration from Vanilla JS

This project was converted from a vanilla JavaScript/HTML/CSS implementation to React with the following improvements:

- **Component-based architecture** - Better code organization and reusability
- **State management** - React hooks for managing component state
- **Routing** - Client-side navigation with React Router
- **Modern development** - Hot reloading, better tooling with Vite
- **Type safety** - Better development experience with modern React

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
