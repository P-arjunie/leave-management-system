# Leave Management System

A modern leave management system built with Laravel and React.

## Project Structure

```
leave-management-system/
├── backend/           # Laravel API
└── frontend/         # React Frontend
```

## Running the Application

### Prerequisites

- PHP >= 8.1
- Composer
- Node.js >= 18
- NPM >= 9
- MySQL >= 8.0

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure your database in `.env`:
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=leave_management
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. Run migrations and seeders:
```bash
php artisan migrate --seed
```

7. Start the Laravel development server:
```bash
php artisan serve
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the API URL in `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

### Running Both Together

1. Open two terminal windows

2. In the first terminal, start the backend:
```bash
cd backend
php artisan serve
```

3. In the second terminal, start the frontend:
```bash
cd frontend
npm run dev
```

4. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api

### Default Login Credentials

After running the seeders, you can use these credentials:

#### Admin User
- Email: admin@example.com
- Password: password

#### Employee User
- Email: employee1@example.com
- Password: password

## Features

- User authentication and authorization
- Role-based access control (Admin/Employee)
- Leave request management
- Leave approval workflow
- Employee management
- Dashboard with statistics
- Real-time updates
- Responsive design




