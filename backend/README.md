# Leave Management System - Backend

Laravel-based RESTful API for the Leave Management System.

## Requirements

- PHP >= 8.2
- Composer
- MySQL >= 8.0
- Node.js & NPM (for frontend assets)

## Setup Instructions

1. Install dependencies:
```bash
composer install
```

2. Configure environment:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=leave_management
DB_USERNAME=root
DB_PASSWORD=
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Run migrations and seeders:
```bash
php artisan migrate
php artisan db:seed
```

6. Install Laravel Passport:
```bash
php artisan passport:install
```

7. Start the development server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000/api`

## Database Seeding

The seeder creates:
- Admin user (email: admin@example.com, password: password)
- Sample employees
- Sample leave requests

Run the seeder:
```bash
php artisan db:seed
```

## API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/register
Content-Type: application/json

{
    "name": "employee1",
    "email": "employee1@example.com",
    "password": "password",
    "password_confirmation": "password"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
    "email": "employee1@example.com",
    "password": "password"
}
```

Response:
```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "name": "employee1",
        "email": "employee1@example.com",
        "role": "employee"
    }
}
```

### Leave Management Endpoints

#### Get All Leaves
```http
GET /api/leaves
Authorization: Bearer {token}
```

#### Create Leave Request
```http
POST /api/leaves
Authorization: Bearer {token}
Content-Type: application/json

{
    "start_date": "2024-03-20",
    "end_date": "2024-03-22",
    "type": "annual",
    "reason": "Family vacation"
}
```

#### Update Leave Status (Admin only)
```http
PUT /api/leaves/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "status": "approved"
}
```

### Admin Endpoints

#### Get All Employees
```http
GET /api/admin/employees
Authorization: Bearer {token}
```

#### Get Employee Leaves
```http
GET /api/users/{userId}/leaves
Authorization: Bearer {token}
```

## Error Responses

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error

Example error response:
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["The email has already been taken."]
    }
}
```

## Testing

Run the test suite:
```bash
php artisan test
```

## Security

- All endpoints (except login/register) require authentication
- Role-based access control for admin endpoints
- Input validation and sanitization
- CSRF protection
- Rate limiting on authentication endpoints
