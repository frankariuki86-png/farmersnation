-- Create database
CREATE DATABASE farmers_nation_db;

-- Connect to the database
\c farmers_nation_db;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user', -- user, admin
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create farming guides table
CREATE TABLE farming_guides (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- Poultry Farming, Goat Farming, Dairy Farming, Crop Farming
    content TEXT NOT NULL,
    ebook_url VARCHAR(500), -- Path to PDF/ebook file
    thumbnail_url VARCHAR(500),
    price DECIMAL(10, 2) DEFAULT 100.00, -- Price in KSH (100 KSH for e-books)
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blog posts table
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    author_id INTEGER REFERENCES users(id),
    category VARCHAR(100),
    views INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create marketplace products table
CREATE TABLE marketplace_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- eggs, chickens, goats, vegetables, milk, grains
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50), -- per crate, per bird, per kg, per litre
    image_url VARCHAR(500),
    seller_id INTEGER REFERENCES users(id),
    seller_name VARCHAR(255),
    seller_phone VARCHAR(20),
    location VARCHAR(255),
    stock INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    guide_id INTEGER REFERENCES farming_guides(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'KSH',
    payment_method VARCHAR(50), -- mpesa, card
    mpesa_transaction_id VARCHAR(255),
    mpesa_receipt_number VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create purchased guides table
CREATE TABLE purchased_guides (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    guide_id INTEGER REFERENCES farming_guides(id),
    payment_id INTEGER REFERENCES payments(id),
    download_count INTEGER DEFAULT 0,
    accessed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create community members table
CREATE TABLE community_members (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    whatsapp_joined BOOLEAN DEFAULT false,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin logs table
CREATE TABLE admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id),
    action VARCHAR(255),
    entity_type VARCHAR(100), -- guide, blog, product
    entity_id INTEGER,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_guides_category ON farming_guides(category);
CREATE INDEX idx_guides_is_published ON farming_guides(is_published);
CREATE INDEX idx_blogs_slug ON blog_posts(slug);
CREATE INDEX idx_blogs_published ON blog_posts(is_published);
CREATE INDEX idx_products_category ON marketplace_products(category);
CREATE INDEX idx_products_seller ON marketplace_products(seller_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_purchased_user ON purchased_guides(user_id);
