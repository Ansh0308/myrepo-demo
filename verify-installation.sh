#!/bin/bash

echo "🎯 Habit Tracker - Installation Verification"
echo "============================================="
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
echo ""
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ npm not found. Please install npm"
    exit 1
fi

# Check MongoDB
echo ""
echo "📦 Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB installed"
else
    echo "⚠️  MongoDB not found locally. You can use MongoDB Atlas instead."
fi

# Check project structure
echo ""
echo "📁 Checking project structure..."

REQUIRED_FILES=(
    "backend/server.js"
    "backend/package.json"
    "backend/.env"
    "frontend/package.json"
    "frontend/index.html"
    "frontend/src/App.tsx"
    "frontend/src/main.tsx"
    "package.json"
    "README.md"
)

MISSING_FILES=0

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

echo ""
if [ $MISSING_FILES -eq 0 ]; then
    echo "✅ All required files present!"
else
    echo "❌ $MISSING_FILES file(s) missing"
    exit 1
fi

# Check directories
echo ""
echo "📂 Checking directories..."

REQUIRED_DIRS=(
    "backend/models"
    "backend/routes"
    "frontend/src/components"
    "frontend/src/api"
    "frontend/src/types"
    "frontend/src/utils"
)

MISSING_DIRS=0

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir"
    else
        echo "❌ $dir (missing)"
        MISSING_DIRS=$((MISSING_DIRS + 1))
    fi
done

echo ""
if [ $MISSING_DIRS -eq 0 ]; then
    echo "✅ All required directories present!"
else
    echo "❌ $MISSING_DIRS director(y/ies) missing"
    exit 1
fi

# Summary
echo ""
echo "============================================="
echo "✅ Installation verification complete!"
echo ""
echo "Next steps:"
echo "1. Install dependencies: npm run install:all"
echo "2. Start MongoDB (if using local)"
echo "3. Run the app: npm run dev"
echo "4. Open http://localhost:3000"
echo ""
echo "For detailed instructions, see QUICKSTART.md"
echo "============================================="
