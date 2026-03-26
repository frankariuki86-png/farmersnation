# FARMERS NATION Platform - Complete Deployment Guide

## 📋 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                           │
│                (React + Tailwind CSS)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND SERVER                           │
│              (Vercel/Netlify/AWS S3 + CloudFront)           │
│                   (localhost:3000)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │ API Calls
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API SERVER                        │
│          (Express.js + Node.js) (localhost:5000)            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           API Routes & Controllers                   │   │
│  │  - Auth (Login, Register)                           │   │
│  │  - Profile (View/Update)                            │   │
│  │  - Guides (CRUD)                                    │   │
│  │  - Blogs (CRUD)                                     │   │
│  │  - Marketplace (CRUD)                               │   │
│  │  - Payments (M-Pesa Integration)                   │   │
│  │  - Training Registrations                           │   │
│  │  - Farm Visit Bookings                              │   │
│  │  - Business Plan eBooks                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                       │                                      │
│       ┌───────────────┼───────────────┐                    │
│       ▼               ▼               ▼                    │
│   ┌────────┐   ┌──────────────┐   ┌─────────┐            │
│   │  Multer│   │ Auth Middleware│  │ Payments │            │
│   │(Upload)│   │  (JWT Verify) │  │ (M-Pesa)│            │
│   └────────┘   └──────────────┘   └─────────┘            │
└──────────────────────┬──────────────────────────────────────┘
                       │ Database Queries
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   POSTGRESQL DATABASE                        │
│  ┌──────────┬─────────┬──────────┬────────────┬──────────┐ │
│  │  USERS   │  GUIDES │  BLOGS   │ MARKETPLACE│ PAYMENTS │ │
│  └──────────┴─────────┴──────────┴────────────┴──────────┘ │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────┐
        │   FILE STORAGE (Uploads)    │
        │  (PDFs, Images, E-books)    │
        └─────────────────────────────┘
```

## 🚀 Running the Application Locally

### Prerequisites Check
```bash
# Verify installations
node -v        # v14+
npm -v         # v6+
psql --version # v12+
```

### Step 1: Database Setup

```bash
# Create database
createdb farmers_nation_db

# Import schema
psql farmers_nation_db < backend/src/config/database.sql

# Run latest migrations (required for trainings/farm visits/business plans)
npm --prefix backend run migrate:up

# Verify tables created
psql farmers_nation_db -c "\\dt"
```

### Step 2: Backend Setup & Run

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your credentials
nano .env  # or use your editor

# Start development server
npm run dev
# Or production mode:
npm start
```

**Backend running on**: `http://localhost:5000`

### Step 3: Frontend Setup & Run

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local (optional)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm start
```

**Frontend running on**: `http://localhost:3000`

## 📱 Default Admin Account

```
Email: admin@farmersnation.com
Password: admin@123
Phone: 0725822740
Location: Busia, Kenya
```

**Note**: Use the seed script to create/update this admin account with a valid bcrypt hash:

```bash
npm --prefix backend run seed:admin
```

If your database password contains special characters (for example `@`), URL-encode them in `DATABASE_URL` (for example `@` becomes `%40`).

## 🌐 Production Deployment

### Backend Deployment (Railway/Heroku)

1. **Create Procfile**:
```
web: node src/server.js
```

2. **Set environment variables**:
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
FRONTEND_URL=https://yourdomain.com
```

3. **Deploy**:
```bash
git push heroku main
```

### Frontend Deployment (Vercel)

1. **Build**:
```bash
npm run build
```

2. **Deploy to Vercel**:
```bash
npm i -g vercel
vercel
```

3. **Set environment variable**:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Database Deployment (AWS RDS)

1. Create PostgreSQL RDS instance
2. Update DATABASE_URL in backend
3. Run migrations on production database
4. Configure backups and security groups

## 🔐 Environment Variables

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/farmers_nation_db

# JWT
JWT_SECRET=your_very_long_and_secure_secret_key_here

# M-Pesa
MPESA_API_URL=https://api.sandbox.safaricom.co.ke
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey

# Admin
ADMIN_EMAIL=admin@farmersnation.com
ADMIN_PASSWORD=admin@123

# URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
PHONE_NUMBER=0725822740
LOG_LEVEL=info
```

### Frontend (.env.local)
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## 📊 Testing the Application

### Test Scenarios

#### 1. User Registration & Login
```bash
POST /api/auth/register
{
  "email": "farmer@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254725822740"
}
```

#### 1b. User Profile Update
```bash
PUT /api/auth/profile
Headers: Authorization: Bearer <token>
{
  "firstName": "John",
  "lastName": "Farmer",
  "phone": "0725822740"
}
```

#### 2. Create Farming Guide (Admin)
```bash
POST /api/guides
Headers: Authorization: Bearer <token>
Body: multipart/form-data
{
  "title": "Modern Poultry Farming",
  "category": "poultry",
  "description": "Complete guide to poultry farming",
  "content": "Detailed content...",
  "ebook": <file>,
  "isPublished": true
}
```

#### 3. Initiate M-Pesa Payment
```bash
POST /api/payments/initiate
Headers: Authorization: Bearer <token>
{
  "phoneNumber": "0725822740",
  "guideId": 1
}
```

#### 4. Admin Feature Modules
```bash
GET /api/trainings/admin/all
GET /api/farm-visits/admin/all
GET /api/business-plans/admin/all
```

### Using Postman

1. Import collection from API endpoints
2. Set {{base_url}} to `http://localhost:5000/api`
3. Set {{token}} from login response
4. Run test requests

## 🐛 Troubleshooting

### Backend Issues

**Port already in use**:
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Database connection error**:
```bash
# Verify PostgreSQL is running
psql -U postgres
# Check DATABASE_URL in .env
```

**Module not found**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**Webpack compilation error**:
```bash
npm start -- --reset-cache
```

**API connection failed**:
- Check backend is running
- Verify REACT_APP_API_URL is correct
- Check CORS settings in backend

## 📈 Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Bundle size monitoring
- Caching strategies

### Backend
- Database indexing
- Query optimization
- Connection pooling
- Rate limiting

## 🔄 Continuous Integration/Deployment

### GitHub Actions Example
```yaml
name: Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - run: npm run build
```

## 📝 Logging & Monitoring

### Application Logging
```javascript
console.log(`[${new Date().toISOString()}] ${message}`);
```

### Error Tracking
- Integrate Sentry for error monitoring
- Set up email alerts for critical errors
- Monitor database query performance

## 🔒 Security Checklist

- [ ] HTTPS enabled on all domains
- [ ] Environment variable secrets protected
- [ ] JWT token expiration configured
- [ ] CORS properly restricted
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection headers
- [ ] Rate limiting implemented
- [ ] File upload validation
- [ ] Password hashing with bcrypt
- [ ] Regular security audits

## 📞 Support & Contact

**FARMERS NATION**
- Phone: 0725822740
- WhatsApp: 0725822740  
- Email: info@farmersnation.com
- Location: Busia, Kenya
- Website: www.farmersnation.com

**Slogan**: Turning Farms Into Fortunes

---

**Last Updated**: March 19, 2026
**Version**: 1.0.0
**Status**: Production Ready
