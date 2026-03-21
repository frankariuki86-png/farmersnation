#!/bin/bash

# FARMERS NATION - Complete Setup Script
# This script sets up the entire fullstack application

echo "🌱 FARMERS NATION - Setup Script"
echo "=================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is not installed. Please install it first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js is installed ($(node -v))${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}PostgreSQL is not installed. Please install it first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL is installed${NC}"

# Setup Backend
echo -e "\n${BLUE}Setting up Backend...${NC}"
cd backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}✓ .env created. Please update it with your credentials.${NC}"
fi

# Create uploads directory
mkdir -p uploads
echo -e "${GREEN}✓ Backend setup complete${NC}"

# Setup Frontend
echo -e "\n${BLUE}Setting up Frontend...${NC}"
cd ../frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

echo -e "${GREEN}✓ Frontend setup complete${NC}"

# Setup Database
echo -e "\n${BLUE}Setting up Database...${NC}"
cd ../backend

# Create database
echo "Creating database 'farmers_nation_db'..."
createdb farmers_nation_db 2>/dev/null || echo "Database may already exist"

# Import schema
echo "Importing database schema..."
psql farmers_nation_db < src/config/database.sql

echo -e "${GREEN}✓ Database setup complete${NC}"

# Final Instructions
echo -e "\n${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ FARMERS NATION Setup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"

echo -e "\n${BLUE}Next Steps:${NC}"
echo -e "1. ${YELLOW}Update ./backend/.env with your credentials${NC}"
echo -e "   - Database credentials"
echo -e "   - M-Pesa API keys"
echo -e "   - JWT secret"
echo -e ""
echo -e "2. ${YELLOW}Start the Backend:${NC}"
echo -e "   cd backend"
echo -e "   npm run dev"
echo -e ""
echo -e "3. ${YELLOW}Start the Frontend (in new terminal):${NC}"
echo -e "   cd frontend"
echo -e "   npm start"
echo -e ""
echo -e "4. ${YELLOW}Access the application:${NC}"
echo -e "   Frontend: http://localhost:3000"
echo -e "   Backend: http://localhost:5000"
echo -e ""
echo -e "${GREEN}📞 Contact: 0725822740${NC}"
echo -e "${GREEN}📍 Location: Busia, Kenya${NC}"
echo -e "${GREEN}🌐 Slogan: Turning Farms Into Fortunes${NC}"
