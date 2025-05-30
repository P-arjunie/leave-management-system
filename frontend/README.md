# Leave Management System - Frontend

A modern, responsive frontend for the Leave Management System built with React and Tailwind CSS.

## Project Structure

```
frontend/
├── public/              # Static files
│   ├── favicon.ico
│   └── index.html      # Entry HTML file
├── src/                # Source files
│   ├── components/     # React components
│   │   ├── auth/      # Authentication components
│   │   ├── dashboard/ # Dashboard components
│   │   └── layout/    # Layout components
│   ├── context/       # React context
│   ├── services/      # API services
│   ├── App.css        # Main application styles
│   ├── App.jsx        # Root application component
│   ├── index.css      # Global styles
│   ├── main.jsx       # Application entry point
│   └── index.html     # HTML template
├── package.json        # Dependencies and scripts
└── README.md          # Project documentation
```

## Features

- Modern UI with Tailwind CSS
- Responsive design for all devices
- Role-based access control
- Real-time updates
- Form validation
- Error handling
- Loading states
- Toast notifications

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Dependencies

- React 18
- React Router DOM
- Tailwind CSS
- Axios
- React Icons
- React Hook Form
- React Hot Toast
- Date-fns

## Development

The project uses Vite as the build tool and development server. The main entry point is `src/main.jsx`, which renders the root `App` component.

## Styling

The project uses Tailwind CSS for styling. The main styles are in:
- `src/index.css` - Global styles and Tailwind imports
- `src/App.css` - Application-specific styles

## Components

The application is organized into several key components:

### Authentication
- `LoginForm` - User login
- `RegisterForm` - User registration
- `AuthProvider` - Authentication context

### Dashboard
- `AdminDashboard` - Admin interface
- `EmployeeDashboard` - Employee interface
- `LeaveForm` - Leave request form
- `LeaveList` - List of leave requests

### Layout
- `Navbar` - Navigation bar
- `Sidebar` - Side navigation
- `Layout` - Main layout wrapper

## API Integration

The frontend communicates with the backend API through the `api.js` service. All API calls are centralized in the `services` directory.

## Error Handling

The application includes comprehensive error handling:
- Form validation errors
- API error responses
- Network errors
- Authentication errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
