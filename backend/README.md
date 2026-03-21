# Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb farmers_nation_db

# Import schema
psql farmers_nation_db < src/config/database.sql
```

### 3. Environment Configuration
```bash
cp .env.example .env
```

Fill in your actual values:
- Database credentials
- JWT secret
- M-Pesa API credentials
- Frontend URL

### 4. Start Server
```bash
npm run dev    # Development mode with auto-reload
npm start      # Production mode
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format
All responses are JSON:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Handling
```json
{
  "error": "Error message",
  "status": 400
}
```

## Key Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | ❌ | Register new user |
| POST | /auth/login | ❌ | Login user |
| GET | /auth/profile | ✅ | Get user profile |
| GET | /guides | ❌ | List all guides |
| POST | /guides | ✅ Admin | Create guide |
| GET | /blogs | ❌ | List blogs |
| POST | /blogs | ✅ Admin | Create blog |
| GET | /marketplace | ❌ | List products |
| POST | /marketplace | ✅ Admin | Add product |
| POST | /payments/initiate | ✅ | Start M-Pesa payment |

## Testing M-Pesa Locally

1. Use Safaricom sandbox environment
2. Test phone: 254708374149
3. Mock responses with Postman

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env or:
sudo lsof -i :5000  # Find process
kill -9 <PID>       # Kill process
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

## Production Checklist

- [ ] Environment variables set
- [ ] Database backed up
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting added
- [ ] Logging configured
- [ ] Error monitoring setup
- [ ] M-Pesa production credentials
- [ ] File upload limit set
- [ ] Regular backups scheduled
