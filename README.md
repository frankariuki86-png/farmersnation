# FARMERS NATION - Fullstack Agricultural Platform

## Project Overview

FARMERS NATION is a comprehensive fullstack web application designed to empower African farmers and agribusiness entrepreneurs. The platform includes:

- **Public Website**: Homepage, Blog, Farming Guides (with paid e-books), Marketplace
- **Admin Dashboard**: Manage farming guides, blogs, and marketplace products
- **M-Pesa Integration**: Secure payment processing for e-book purchases (100 KSH)
- **User Authentication**: Secure JWT-based authentication system
- **Community Features**: WhatsApp integration for farmer community

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Zustand** - State management
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

### Backend
- **Node.js + Express** - Server framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Axios** - HTTP requests (M-Pesa API)

### Additional
- **M-Pesa API** - Payment processing
- **Cors** - Cross-origin requests
- **Dotenv** - Environment variables

## Project Structure

```
farmers/
├── frontend/                          # React frontend application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── GuidesSection.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   ├── pages/                    # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminGuides.jsx
│   │   ├── services/
│   │   │   └── api.js               # API client configuration
│   │   ├── store/
│   │   │   └── authStore.js         # Zustand auth store
│   │   ├── App.jsx                  # Root component
│   │   ├── index.jsx                # Entry point
│   │   └── index.css                # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                           # Express backend API
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # DB connection
│   │   │   └── database.sql         # Database schema
│   │   ├── controllers/             # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── guideController.js
│   │   │   ├── blogController.js
│   │   │   ├── marketplaceController.js
│   │   │   └── paymentController.js
│   │   ├── models/                  # Data models
│   │   │   ├── User.js
│   │   │   ├── FarmingGuide.js
│   │   │   ├── Blog.js
│   │   │   ├── Marketplace.js
│   │   │   └── Payment.js
│   │   ├── routes/                  # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── guideRoutes.js
│   │   │   ├── blogRoutes.js
│   │   │   ├── marketplaceRoutes.js
│   │   │   └── paymentRoutes.js
│   │   ├── middleware/              # Custom middleware
│   │   │   ├── auth.js             # JWT verification
│   │   │   └── upload.js           # File upload handler
│   │   └── server.js               # Express app entry point
│   ├── uploads/                     # Uploaded files storage
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── README.md                         # This file
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. **Install dependencies**:
```bash
cd backend
npm install
```

2. **Set up PostgreSQL database**:
```bash
# Create database
createdb farmers_nation_db

# Import schema
psql farmers_nation_db < src/config/database.sql
```

3. **Configure environment variables**:
```bash
cp .env.example .env
```

Edit `.env` with your configurations:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/farmers_nation_db
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development

# M-Pesa Configuration (Get from Safaricom)
MPESA_API_URL=https://api.sandbox.safaricom.co.ke
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey

ADMIN_EMAIL=admin@farmersnation.com
ADMIN_PASSWORD=admin@123
FRONTEND_URL=http://localhost:3000
PHONE_NUMBER=0725822740
```

4. **Start the server**:
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**:
```bash
cd frontend
npm install
```

2. **Configure environment (optional)**:
Create `.env.local`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Start the development server**:
```bash
npm start
```

Application runs on `http://localhost:3000`

## Features

### 👥 Authentication
- User registration and login
- JWT-based authentication
- Admin role verification
- Protected routes

### 📚 Farming Guides & E-books
- Create, read, update, delete guides
- File upload (PDF/DOC)
- Category organization (Poultry, Goat, Dairy, Crop)
- Price management (100 KSH each)
- View tracking

### 📝 Blog System
- Create and manage blog posts
- Rich content editor
- Auto slug generation
- View counting
- Publish/draft management

### 🛒 Marketplace
- Product listings by category
- Seller information display
- Inventory management
- Contact seller via WhatsApp

### 💳 M-Pesa Payment Integration
- Secure payment processing
- Payment history tracking
- Transaction verification
- Guide access control after payment

### 👨‍💼 Admin Dashboard
- Centralized management interface
- File upload management
- Content publishing control
- User management (future)
- Analytics (future)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Farming Guides
- `GET /api/guides` - Get all published guides
- `GET /api/guides/category/:category` - Get guides by category
- `GET /api/guides/:id` - Get single guide
- `POST /api/guides` - Create guide (admin)
- `PUT /api/guides/:id` - Update guide (admin)
- `DELETE /api/guides/:id` - Delete guide (admin)

### Blog
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/slug/:slug` - Get blog by slug
- `POST /api/blogs` - Create blog (admin)
- `PUT /api/blogs/:id` - Update blog (admin)
- `DELETE /api/blogs/:id` - Delete blog (admin)

### Marketplace
- `GET /api/marketplace` - Get all products
- `GET /api/marketplace/category/:category` - Get products by category
- `GET /api/marketplace/:id` - Get product details
- `POST /api/marketplace` - Create product (admin)
- `PUT /api/marketplace/:id` - Update product (admin)
- `DELETE /api/marketplace/:id` - Delete product (admin)

### Payments
- `POST /api/payments/initiate` - Initiate M-Pesa payment
- `POST /api/payments/callback` - M-Pesa callback handler
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/access/:guideId` - Check guide access

## Database Schema

### Tables
- **users** - User accounts
- **farming_guides** - E-book content
- **blog_posts** - Blog articles
- **marketplace_products** - Marketplace items
- **payments** - Payment transactions
- **purchased_guides** - Purchase records
- **community_members** - Community participants
- **admin_logs** - Admin activity logs

## Configuration

### Busia, Kenya Details
- **Phone**: 0725822740
- **WhatsApp**: 0725822740
- **Location**: Busia, Kenya

### M-Pesa Setup
1. Register on Safaricom API portal
2. Get consumer key and secret
3. Configure shortcode and passkey
4. Update `.env` with credentials
5. Test in sandbox environment first

## Security Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **JWT Secret**: Use strong, random secret key
3. **Password Hashing**: Using bcryptjs (10 rounds)
4. **CORS**: Configured for specific frontend URL
5. **File Upload**: Restricted to specific file types
6. **Input Validation**: Implement on backend
7. **SQL Injection**: Using parameterized queries

## Deployment

### Backend Deployment (Heroku/Railway)
1. Create Procfile
2. Set environment variables
3. Push to deployment platform

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `build` folder
3. Set API URL to production backend

### Database
- PostgreSQL hosted on AWS RDS or similar
- Regular backups configured
- SSL connection enabled

## Future Enhancements

- [ ] Advanced user roles (seller, buyer, farmer)
- [ ] Product reviews and ratings
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Video tutorials
- [ ] Live chat support
- [ ] FarmersNation mobile app
- [ ] Weather API integration
- [ ] Crop price tracking
- [ ] Insurance integration
- [ ] Loan management system

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

### M-Pesa Integration Issues
- Use sandbox credentials for testing
- Check consumer key/secret
- Verify callback URL is public
- Check phone number format

### CORS Errors
- Verify FRONTEND_URL in backend .env
- Ensure backend is running
- Check API endpoint URLs

### File Upload Issues
- Ensure `backend/uploads/` directory exists
- Check file size limits
- Verify allowed file types

## Support & Contact

**FARMERS NATION**
- 📱 Phone: 0725822740
- 💬 WhatsApp: 0725822740
- 📍 Location: Busia, Kenya
- 🌐 Platform: www.farmersnation.com

## License

MIT License - Feel free to use this platform for your agricultural initiatives

## Contributing

Contributions are welcome! Please follow:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**Last Updated**: March 19, 2026
**Version**: 1.0.0
**Status**: Production Ready
#   f a r m e r s n a t i o n  
 