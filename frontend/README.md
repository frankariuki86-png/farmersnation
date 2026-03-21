# Frontend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration (Optional)
Create `.env.local`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm start
```

App runs on `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

## Features

### Pages Included
- ✅ Home page with hero section
- ✅ Login page
- ✅ Registration page
- ✅ Admin dashboard with sidebar
- ✅ Guide management interface
- ✅ Responsive design for mobile

### Pages to Build
- [ ] Full guides listing page
- [ ] Guide detail view
- [ ] Guide purchase with M-Pesa
- [ ] Blog listing and detail pages
- [ ] Marketplace products page
- [ ] Contact form page
- [ ] User profile page
- [ ] Blog admin management
- [ ] Marketplace admin management

## Component Architecture

### Reusable Components
- `Navbar` - Navigation with auth
- `Footer` - Footer with links
- `HeroSection` - Landing hero
- `GuidesSection` - Guide cards grid
- `AdminSidebar` - Admin navigation

### State Management
Using Zustand for:
- User authentication
- Auth tokens
- User role verification

### API Layer
Centralized API client with:
- Base URL configuration
- Automatic token injection
- Error handling
- Request/response formatting

## Styling with Tailwind CSS

### Color System
```css
--primary-green: #1e5a24
--secondary-green: #2d8a3d
--light-green: #84c341
--accent-green: #a8d66e
```

### Typography
- Headings: Bold, 1.3 line height
- Body: Regular weight, 1.6 line height
- Responsive sizing with clamp()

### Mobile First
All styles use mobile-first approach:
- Mobile: 100% width, full padding
- Tablet (768px): Grid adjustments
- Desktop (1024px): Multi-column layouts

## Authentication Flow

1. User registers/logs in
2. Credentials sent to backend
3. JWT token received
4. Token stored in localStorage
5. Token added to API headers
6. Protected routes check authentication
7. Admin routes verify role

## Protected Routes

```jsx
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>
```

Redirects to login if not authenticated or not admin.

## Testing the App

### User Flow
1. Visit `http://localhost:3000`
2. Click "Sign Up"
3. Fill form and register
4. Login with credentials
5. View dashboard (regular user)
6. Admin users see admin link in navbar

### Admin Flow
1. Update user role in database to 'admin'
2. Login
3. Access `/admin` or click Admin button
4. Manage guides, blogs, products

## Common Issues

### API Connection Error
```
Check that backend is running on http://localhost:5000
```

### Tailwind Styles Not Applying
```bash
# Rebuild Tailwind
npm run build
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

## Deployment to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Set `REACT_APP_API_URL` environment variable
4. Deploy
5. Update CORS on backend

## Next Steps

1. Add more pages (guides, blog, marketplace)
2. Implement M-Pesa payment UI
3. Add image rendering
4. Implement search functionality
5. Add more admin features
6. Create guides, blogs, products in admin
7. Set up analytics
8. Add email notifications

## File Size Monitoring

```bash
npm run analyze  # Analyze bundle size
```

Keep main bundle under 200KB for fast loading.
