# Workforce Management App - Quick Start

## 🚀 Quickest Start (5 minutes)

### 1. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials
createdb workforce_management
npm install
npm run db:push
npm run dev
```

### 2. Setup Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Prisma Studio: Run `npm run db:studio` in backend

## 📊 Demo Features to Try

### Clock In/Out (`/clock`)
1. Select a department and team
2. Click "Clock In"
3. Watch elapsed time increase
4. Click "Clock Out" or "Transfer to Different Job"

### Timesheets (`/timesheets`)
1. View your timesheets
2. Filter by status (DRAFT, SUBMITTED, APPROVED)
3. Click to expand and see entries

### Employees (`/employees`)
1. Browse employee directory
2. Search by name or email
3. See department and status

### Dashboard (`/dashboard`)
1. View quick stats
2. See who's currently on shift (if manager)
3. Quick action buttons

## 🔧 Environment Setup

### PostgreSQL

**macOS (with Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt-get install postgresql
sudo service postgresql start
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### .env File (Backend)
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/workforce_management"
JWT_SECRET="change-this-to-something-secure"
NODE_ENV="development"
PORT=5000
```

## 📝 Test Scenarios

### Scenario 1: Employee Clocking In
1. Login as employee
2. Navigate to Clock In/Out
3. Select department and team
4. Clock in
5. Work for a bit
6. Clock out
7. Check elapsed time

### Scenario 2: Manager Approving Timesheet
1. Login as manager (role: MANAGER)
2. Navigate to Timesheets
3. Filter for SUBMITTED
4. View entries
5. Click approve/reject button

### Scenario 3: Transfer Between Jobs
1. Clock in for first job
2. Click "Transfer to Different Job"
3. Select new department/team
4. System clocks out of first job and clocks in to second
5. Check clock logs in profile

## 🐛 Common Issues

### "Cannot connect to database"
- Is PostgreSQL running? Start with `brew services start postgresql`
- Does database exist? Create with `createdb workforce_management`
- Check DATABASE_URL in .env

### "Port 5000 already in use"
```bash
lsof -i :5000
kill -9 <PID>
```

### "Frontend can't reach backend"
- Check backend is running on port 5000
- Verify API URL in `frontend/src/lib/api.ts`
- Check browser console for errors

### "Prisma sync fails"
```bash
cd backend
npm run db:push -- --force-reset
```

## 📚 Next Steps

1. Read [Backend README](./backend/README.md) for API details
2. Read [Frontend README](./frontend/README.md) for component structure
3. Check [Contributing Guide](./CONTRIBUTING.md) to help develop
4. Review [Main README](./README.md) for full documentation

## 🎯 Development Workflow

1. **Create feature branch:**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes:**
   - Backend changes auto-reload with `npm run dev`
   - Frontend changes auto-reload with Vite

3. **Test in browser:**
   - Frontend: http://localhost:5173
   - Test with different roles
   - Check browser console for errors

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   git push origin feature/my-feature
   ```

5. **Create Pull Request**

## 💡 Tips

- Use Prisma Studio to view/edit database: `npm run db:studio`
- Check API with curl: `curl -H "Authorization: Bearer <token>" http://localhost:5000/api/endpoint`
- React Query DevTools helpful for debugging queries
- Check network tab in browser DevTools for API calls

## 📞 Need Help?

1. Check README files
2. Review existing GitHub issues
3. Create new issue with details
4. Include error messages and steps to reproduce

---

**Happy coding! 🚀**
