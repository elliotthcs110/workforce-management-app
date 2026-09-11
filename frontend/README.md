# Frontend Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend running on http://localhost:5000

### Installation Steps

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── pages/
│   ├── Login.tsx           # Login page
│   ├── Dashboard.tsx       # Main dashboard
│   ├── ClockInOut.tsx      # Clock in/out interface
│   ├── Timesheets.tsx      # Timesheet viewer
│   ├── Employees.tsx       # Employee directory
│   └── Schedule.tsx        # Schedule viewer
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   └── ProtectedRoute.tsx  # Route protection wrapper
├── lib/
│   └── api.ts              # Axios API client
├── store/
│   └── auth.ts             # Zustand auth store
├── App.tsx                 # Main app component
├── main.tsx                # React entry point
└── index.css               # Global styles
```

## Key Features

### Pages

#### Login (`/login`)
- Email/password authentication
- Persists token to localStorage
- Redirects to dashboard on success

#### Dashboard (`/dashboard`)
- Overview stats (on shift, employees, pending timesheets)
- Quick action buttons
- Role-based content

#### Clock In/Out (`/clock`)
- Clock in with department/team selection
- Clock out functionality
- Transfer to different job
- Display current status and elapsed time

#### Timesheets (`/timesheets`)
- View personal timesheets
- Filter by status (DRAFT, SUBMITTED, APPROVED, REJECTED)
- Expand to view entries
- Submit timesheet

#### Employees (`/employees`)
- Employee directory with search
- Employee cards with details
- Department information
- Hire date and status

#### Schedule (`/schedule`)
- Placeholder for schedule viewer
- Ready for implementation

## Configuration

### API Base URL

The frontend proxies API calls to `http://localhost:5000` during development via Vite configuration.

For production, update the API URL in `src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

## State Management

### Zustand Auth Store (`src/store/auth.ts`)

```typescript
import { useAuthStore } from './store/auth';

const { user, token, isAuthenticated, login, logout } = useAuthStore();
```

### React Query (`@tanstack/react-query`)

Used for server state management:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['employees'],
  queryFn: async () => {
    const response = await api.get('/users/employees');
    return response.data;
  },
});
```

## Styling

### Tailwind CSS

The app uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`.

Custom colors:
- Primary colors: `primary-50` to `primary-900`

### Global Styles

`src/index.css` includes:
- Tailwind directives
- Custom transition styles

## Components

### Navbar

Displays navigation based on user role. Managers see additional "Manage" menu item.

### ProtectedRoute

Wraps routes to require authentication and optionally specific roles:

```typescript
<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
  <ManagePanel />
</ProtectedRoute>
```

## API Integration

### Axios Instance (`src/lib/api.ts`)

- Automatically adds Authorization header
- Redirects to login on 401 responses
- Base URL set from environment or defaults to localhost

### Usage

```typescript
import api from '../lib/api';

const response = await api.get('/clock-logs/status/current');
const result = await api.post('/clock-logs/in', { departmentId: '123' });
```

## Development Tips

### Hot Reload

Vite provides instant hot module reload for:
- Component changes
- Style changes
- State changes

Just save files and see updates instantly in browser.

### React Query DevTools

Add React Query DevTools for debugging:

```bash
npm install @tanstack/react-query-devtools --save-dev
```

Then add to App.tsx:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  {/* app content */}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Browser DevTools

- React DevTools extension
- Redux DevTools for Zustand inspection

## Building for Production

```bash
npm run build
```

Output files in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository to Vercel
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - `REACT_APP_API_URL`: Your backend URL

### Netlify

1. Connect GitHub repository
2. Build Command: `npm run build`
3. Publish Directory: `dist`

### Traditional Hosting

1. Build: `npm run build`
2. Upload `dist/` folder contents to web server
3. Configure server for SPA (rewrite 404s to index.html)

## Troubleshooting

### CORS Errors

Make sure backend is running and CORS is enabled:

```typescript
app.use(cors());
```

### API Not Found

- Verify backend is running on port 5000
- Check vite.config.ts proxy settings
- Verify API endpoints in `src/lib/api.ts`

### Authentication Issues

- Check localStorage for token: `localStorage.getItem('token')`
- Verify token format: `Bearer <token>`
- Check JWT expiration in backend

### Build Errors

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Performance Optimization

### Code Splitting

React Router enables automatic code splitting for pages.

### Image Optimization

Use Lucide React icons (already included) for consistent, lightweight icons.

### Caching

React Query handles API response caching automatically.

## Extending the App

### Adding a New Page

1. Create `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Navbar.tsx`

### Adding an API Call

```typescript
const { data } = useQuery({
  queryKey: ['unique-key'],
  queryFn: async () => {
    const response = await api.get('/endpoint');
    return response.data;
  },
});
```

## Related Documentation

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query](https://tanstack.com/query/latest)
- [Vite](https://vitejs.dev)
