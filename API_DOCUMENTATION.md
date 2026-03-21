# 🔌 FARMERS NATION API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.farmersnation.com/api
```

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ...payload... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400
}
```

## 📌 Auth Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254725822740"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "farmer@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "message": "User registered successfully"
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "SecurePass123"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "farmer@example.com",
      "first_name": "John",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

### Get User Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "farmer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+254725822740",
    "role": "user",
    "created_at": "2026-03-19T10:30:00Z"
  }
}
```

---

## 📚 Farming Guides Endpoints

### Get All Guides
```http
GET /guides
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Modern Poultry Farming",
      "description": "Complete guide to poultry farming",
      "category": "poultry",
      "price": 100,
      "ebook_url": "/uploads/guide-123.pdf",
      "views": 245,
      "is_published": true,
      "created_at": "2026-03-19T10:00:00Z"
    }
  ]
}
```

### Get Guide by Category
```http
GET /guides/category/poultry
```

**Categories**: `poultry`, `goat`, `dairy`, `crop`

### Get Single Guide
```http
GET /guides/:id
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Modern Poultry Farming",
    "category": "poultry",
    "content": "Full detailed content...",
    "ebook_url": "/uploads/guide-123.pdf",
    "views": 246,
    "is_published": true
  }
}
```

### Create Guide (Admin Only)
```http
POST /guides
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

- title: "Modern Poultry Farming"
- category: "poultry"
- description: "Complete guide"
- content: "Full content text"
- ebook: <file>
- isPublished: true
```

**Response (201)**:
```json
{
  "success": true,
  "data": { ...created_guide... }
}
```

### Update Guide (Admin Only)
```http
PUT /guides/:id
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

- title: "Updated Title"
- category: "goat"
- description: "Updated description"
- content: "Updated content"
- ebook: <file> (optional)
- isPublished: true
```

### Delete Guide (Admin Only)
```http
DELETE /guides/:id
Authorization: Bearer <admin_token>
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Guide deleted successfully"
}
```

---

## 📰 Blog Endpoints

### Get All Blogs
```http
GET /blogs?page=1&limit=10
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Sustainable Poultry Farming in 2026",
      "slug": "sustainable-poultry-farming-in-2026",
      "excerpt": "Discover modern techniques...",
      "category": "poultry",
      "image_url": "/uploads/blog-123.jpg",
      "views": 523,
      "is_published": true,
      "created_at": "2026-03-19T10:00:00Z"
    }
  ]
}
```

### Get Blog by Slug
```http
GET /blogs/slug/sustainable-poultry-farming-in-2026
```

### Create Blog (Admin Only)
```http
POST /blogs
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

- title: "Blog Title"
- excerpt: "Short excerpt"
- content: "Full blog content"
- category: "poultry"
- image: <file>
- isPublished: true
```

### Update Blog (Admin Only)
```http
PUT /blogs/:id
Authorization: Bearer <admin_token>
```

### Delete Blog (Admin Only)
```http
DELETE /blogs/:id
Authorization: Bearer <admin_token>
```

---

## 🛒 Marketplace Endpoints

### Get All Products
```http
GET /marketplace?page=1&limit=20
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Fresh Eggs",
      "description": "Farm-fresh eggs",
      "category": "eggs",
      "price": 2500,
      "unit": "per crate",
      "seller_name": "Kaduna Farm",
      "seller_phone": "0725822740",
      "location": "Busia, Kenya",
      "stock": 50,
      "is_available": true
    }
  ]
}
```

### Get Products by Category
```http
GET /marketplace/category/eggs?page=1&limit=20
```

**Categories**: `eggs`, `chickens`, `goats`, `vegetables`, `milk`, `grains`

### Get Single Product
```http
GET /marketplace/:id
```

### Create Product (Admin Only)
```http
POST /marketplace
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

- name: "Fresh Eggs"
- description: "Farm-fresh eggs"
- category: "eggs"
- price: 2500
- unit: "per crate"
- stock: 50
- image: <file>
```

### Update Product (Admin Only)
```http
PUT /marketplace/:id
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

### Delete Product (Admin Only)
```http
DELETE /marketplace/:id
Authorization: Bearer <admin_token>
```

---

## 💳 Payment Endpoints

### Initiate M-Pesa Payment
```http
POST /payments/initiate
Authorization: Bearer <token>
Content-Type: application/json

{
  "phoneNumber": "0725822740",
  "guideId": 1
}
```

**Response (200)**:
```json
{
  "success": true,
  "paymentId": 42,
  "checkoutRequestId": "ws_CO_123456789",
  "message": "STK push sent successfully"
}
```

**Process**:
1. User enters M-Pesa PIN on phone
2. M-Pesa processes payment
3. Callback URL receives result
4. Guide access is granted after payment

### Payment Callback
```http
POST /payments/callback
Content-Type: application/json

Body: M-Pesa callback data (auto-handled)
```

### Get Payment History
```http
GET /payments/history
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 42,
      "guide_id": 1,
      "amount": 100,
      "currency": "KSH",
      "status": "completed",
      "mpesa_receipt_number": "MCP123456789",
      "phone_number": "0725822740",
      "created_at": "2026-03-19T10:00:00Z"
    }
  ]
}
```

### Check Guide Access
```http
GET /payments/access/:guideId
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "hasAccess": true
}
```

---

## Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 400 | Invalid request data | Check request format |
| 401 | No token provided | Add Authorization header |
| 401 | Invalid token | Use valid JWT token |
| 403 | Admin access required | Use admin account |
| 404 | Resource not found | Check ID exists |
| 409 | Email already exists | Use different email |
| 500 | Server error | Contact support |

---

## Rate Limiting

- **Auth endpoints**: 5 requests/minute
- **Public endpoints**: 30 requests/minute
- **Protected endpoints**: 100 requests/minute
- **Admin endpoints**: 50 requests/minute

---

## File Upload Requirements

### E-books (Guides)
- **Formats**: PDF, DOC, DOCX
- **Max size**: 50MB
- **Storage**: `/backend/uploads/`

### Blog Images
- **Formats**: JPG, PNG, GIF
- **Max size**: 10MB
- **Recommended size**: 1200x600px

### Product Images
- **Formats**: JPG, PNG
- **Max size**: 5MB
- **Recommended size**: 500x500px

---

## Pagination

All list endpoints support pagination:
```
GET /guides?page=1&limit=10
```

Default: `limit=10`, `page=1`

---

## Testing with Postman

### 1. Import Endpoints
Create collection with all endpoints above

### 2. Set Variables
```
{
  "base_url": "http://localhost:5000/api",
  "token": "YOUR_JWT_TOKEN_HERE"
}
```

### 3. Test Flow
1. Register user → Save token
2. Create guide → Save guide ID
3. Get guide → List all guides
4. Initiate payment → Get payment ID
5. Check access → Verify guide access

---

## SDK Examples (Coming Soon)
- JavaScript/Node.js SDK
- Python SDK
- PHP SDK
- Mobile SDKs

---

## Support
- **Documentation**: https://docs.farmersnation.com
- **Issues**: support@farmersnation.com
- **Phone**: 0725822740
- **WhatsApp**: 0725822740

---

**API Version**: 1.0.0  
**Last Updated**: March 19, 2026  
**Status**: Production Ready
