# Workforce Management App

A comprehensive workforce management system combining time tracking, scheduling, timesheets, and team management features. Built with React, Express, TypeScript, and PostgreSQL.

## Features

✨ **Core Features:**
- 🕐 Clock in/out for multiple jobs with transfer capability
- 📋 Personal and team schedule viewing
- 📊 Timesheet creation and management
- ✏️ Timesheet editing through change requests
- ✅ Timesheet approval workflow
- 👥 Employee log with department assignments
- 👀 View who's currently on shift
- 🔄 Multi-department and multi-team support
- Different shift types support

## Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Bcrypt for password hashing

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)
- Zustand for state management
- React Router for navigation
- Lucide icons
- Vite for build tooling

## Project Structure

```
workforce-management-app/
├── backend/
│   ├── src/
│   │   ├── index.ts           # Main server entry
│   │   ├── middleware/
│   │   │   └── auth.ts        # Authentication middleware
│   │   └── routes/
│   │       ├── auth.ts        # Authentication endpoints
│   │       ├── users.ts       # User management
│   │       ├── departments.ts # Department management
│   │       ├── teams.ts       # Team management
│   │       ├── shifts.ts      # Shift management
│   │       ├── clockLogs.ts   # Clock in/out tracking
│   │       ├── timesheets.ts  # Timesheet management
│   │       └── schedules.ts   # Schedule management
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx      # Login page
│   │   │   ├── Dashboard.tsx  # Dashboard
│   │   │   ├── ClockInOut.tsx # Clock in/out interface
│   │   │   ├── Timesheets.tsx # Timesheet viewer
│   │   │   ├── Employees.tsx  # Employee directory
│   │   │   └── Schedule.tsx   # Schedule viewer
│   │   ├── components/
│   │   │   ├── Navbar.tsx     # Navigation bar
│   │   │   └── ProtectedRoute.tsx # Route protection
│   │   ├── lib/
│   │   │   └── api.ts         # API client
│   │   ├── store/
│   │   │   └── auth.ts        # Auth state store
│   │   ├── App.tsx            # Main app component
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tailwind.config.js
└── package.json (root)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/elliotthcs110/workforce-management-app.git
   cd workforce-management-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup Backend:**

   a. Navigate to backend directory:
   ```bash
   cd backend
   ```

   b. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

   c. Update `.env` with your PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/workforce_management"
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   NODE_ENV="development"
   PORT=5000
   ```

   d. Create database:
   ```bash
   createdb workforce_management
   ```

   e. Push Prisma schema to database:
   ```bash
   npm run db:push
   ```

   f. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

4. **Setup Frontend:**

   a. Navigate to frontend directory:
   ```bash
   cd ../frontend
   ```

   b. Install dependencies (if not already done):
   ```bash
   npm install
   ```

### Running the Application

**Development Mode (from root directory):**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

**Or run separately:**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

## Default Login Credentials (Demo)

- **Email:** demo@example.com
- **Password:** password123

*Note: You'll need to create users through the signup endpoint or database seed first.*

## API Documentation

### Authentication

**POST /api/auth/signup**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "EMPLOYEE"
}
```

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Clock Logs

**POST /api/clock-logs/in** - Clock in
```json
{
  "departmentId": "dept123",
  "teamId": "team123",
  "notes": "Optional notes"
}
```

**POST /api/clock-logs/out** - Clock out
```json
{
  "notes": "Optional notes"
}
```

**POST /api/clock-logs/transfer** - Transfer to different job
```json
{
  "newDepartmentId": "dept456",
  "newTeamId": "team456"
}
```

**GET /api/clock-logs/status/current** - Get current clock status

**GET /api/clock-logs/active/all** - See who's currently on shift

### Timesheets

**GET /api/timesheets** - Get all timesheets (filtered by query params)

**GET /api/timesheets/user/my-timesheets** - Get current user's timesheets

**POST /api/timesheets** - Create new timesheet
```json
{
  "weekStartDate": "2024-01-01",
  "weekEndDate": "2024-01-07"
}
```

**PATCH /api/timesheets/:id/submit** - Submit timesheet

**PATCH /api/timesheets/:id/approve** - Approve timesheet (Manager/Admin only)

**PATCH /api/timesheets/:id/reject** - Reject timesheet (Manager/Admin only)
```json
{
  "comments": "Please revise and resubmit"
}
```

### Shifts

**GET /api/shifts** - Get shifts (filterable by date, team, department)

**POST /api/shifts** - Create shift (Manager/Admin only)
```json
{
  "teamId": "team123",
  "departmentId": "dept123",
  "shiftTypeId": "morning",
  "date": "2024-01-15",
  "minStaff": 2
}
```

**POST /api/shifts/:shiftId/assign/:userId** - Assign user to shift

### Departments

**GET /api/departments** - Get all departments

**POST /api/departments** - Create department (Admin/Manager only)
```json
{
  "name": "Warehouse",
  "code": "WH001"
}
```

**POST /api/departments/:departmentId/members/:userId** - Add user to department
```json
{
  "isPrimary": true
}
```

### Employees

**GET /api/users/employees** - Get all employees with departments

**GET /api/users/profile** - Get current user profile

## User Roles

- **ADMIN**: Full system access, can manage all features
- **MANAGER**: Can manage departments, teams, and approve timesheets
- **SUPERVISOR**: Can assign shifts and view team data
- **EMPLOYEE**: Can clock in/out, view own schedule and timesheets

## Database Schema

Key models:
- **User**: System users with roles
- **EmployeeProfile**: Employee-specific information
- **Department**: Organizational departments
- **Team**: Teams within departments
- **Shift**: Scheduled shifts
- **ShiftAssignment**: User assignments to shifts
- **ClockLog**: Clock in/out records
- **Timesheet**: Weekly timesheet tracking
- **TimesheetEntry**: Individual time entries
- **TimesheetChangeRequest**: Request modifications to timesheets
- **Schedule**: Team schedules

## Building for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

The built frontend files will be in `frontend/dist/`

## Deployment

### Backend Deployment (Heroku example)

1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Add PostgreSQL: `heroku addons:create heroku-postgresql`
4. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET="your-secret-key"
   ```
5. Deploy: `git push heroku main`

### Frontend Deployment (Vercel example)

1. Push code to GitHub
2. Import repository to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/workforce_management
JWT_SECRET=your-super-secret-key
NODE_ENV=development
PORT=5000
```

### Frontend
The frontend proxies API requests to the backend during development through Vite configuration.

## Development Tips

1. **Database Visualization:**
   ```bash
   cd backend
   npm run db:studio
   ```
   Opens Prisma Studio to view/manage database

2. **Hot Reload:**
   - Backend: Uses `tsx watch` for TypeScript hot reload
   - Frontend: Vite provides instant hot module reload

3. **API Testing:**
   - Use Postman or Insomnia to test API endpoints
   - Include `Authorization: Bearer <token>` header for protected routes

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial use.

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce for bugs

## Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics
- [ ] Attendance tracking
- [ ] Leave management
- [ ] Performance evaluations
- [ ] Integration with payroll systems
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Two-factor authentication
- [ ] Audit logging

---

**Built with ❤️ for modern workforce management**
