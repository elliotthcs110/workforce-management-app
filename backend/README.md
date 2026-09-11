# Backend Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/workforce_management"
   JWT_SECRET="your-super-secret-jwt-key"
   NODE_ENV="development"
   PORT=5000
   ```

5. **Create PostgreSQL database:**
   ```bash
   createdb workforce_management
   ```

6. **Push Prisma schema:**
   ```bash
   npm run db:push
   ```

7. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

### Running in Development

```bash
npm run dev
```

Server will start at `http://localhost:5000`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run db:push` - Sync Prisma schema with database
- `npm run db:generate` - Generate Prisma Client
- `npm run db:studio` - Open Prisma Studio UI

## Project Structure

```
src/
├── index.ts              # Server entry point
├── middleware/
│   └── auth.ts          # JWT authentication middleware
└── routes/
    ├── auth.ts          # Authentication (login/signup)
    ├── users.ts         # User management
    ├── departments.ts   # Department management
    ├── teams.ts         # Team management
    ├── shifts.ts        # Shift management
    ├── clockLogs.ts     # Clock in/out tracking
    ├── timesheets.ts    # Timesheet management
    └── schedules.ts     # Schedule management
```

## Database Setup

### Create Database
```bash
psql -U postgres
```

```sql
CREATE DATABASE workforce_management;
```

### Apply Schema
```bash
npm run db:push
```

### View Database (Prisma Studio)
```bash
npm run db:studio
```

## API Endpoints

### Health Check
- `GET /api/health` - Server status

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/employees` - List all employees
- `GET /api/users/profile` - Current user profile
- `GET /api/users/:userId/departments` - User's departments

### Departments
- `GET /api/departments` - List all departments
- `GET /api/departments/:id` - Get department details
- `POST /api/departments` - Create department
- `POST /api/departments/:departmentId/members/:userId` - Add member

### Teams
- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team details
- `POST /api/teams` - Create team
- `POST /api/teams/:teamId/members/:userId` - Add team member
- `DELETE /api/teams/:teamId/members/:userId` - Remove member

### Shifts
- `GET /api/shifts` - List shifts
- `GET /api/shifts/:id` - Get shift details
- `POST /api/shifts` - Create shift
- `GET /api/shifts/types` - Get shift types
- `POST /api/shifts/types` - Create shift type
- `POST /api/shifts/:shiftId/assign/:userId` - Assign user
- `DELETE /api/shifts/:shiftId/assign/:userId` - Remove assignment
- `GET /api/shifts/user/my-shifts` - User's assigned shifts

### Clock Logs
- `POST /api/clock-logs/in` - Clock in
- `POST /api/clock-logs/out` - Clock out
- `POST /api/clock-logs/transfer` - Transfer to different job
- `GET /api/clock-logs/status/current` - Current clock status
- `GET /api/clock-logs/user/logs` - Clock history
- `GET /api/clock-logs/active/all` - Currently clocked in users

### Timesheets
- `GET /api/timesheets` - List timesheets
- `GET /api/timesheets/user/my-timesheets` - User's timesheets
- `GET /api/timesheets/:id` - Get timesheet
- `POST /api/timesheets` - Create timesheet
- `POST /api/timesheets/:timesheetId/entries` - Add entry
- `PATCH /api/timesheets/:id/submit` - Submit timesheet
- `PATCH /api/timesheets/:id/approve` - Approve timesheet
- `PATCH /api/timesheets/:id/reject` - Reject timesheet
- `POST /api/timesheets/:timesheetId/change-requests` - Request changes
- `GET /api/timesheets/:timesheetId/change-requests` - View requests
- `PATCH /api/timesheets/change-requests/:id/approve` - Approve change
- `PATCH /api/timesheets/change-requests/:id/reject` - Reject change

### Schedules
- `GET /api/schedules` - List schedules
- `GET /api/schedules/:id` - Get schedule
- `POST /api/schedules` - Create schedule
- `POST /api/schedules/:scheduleId/entries` - Add entry
- `PATCH /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are obtained by logging in:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists: `createdb workforce_management`

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Prisma Schema Issues
```bash
npm run db:push -- --force-reset  # ⚠️ Clears database
```

## Deployment

See main README.md for deployment instructions to Heroku, AWS, or other platforms.
