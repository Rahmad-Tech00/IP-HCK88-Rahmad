# Book Tracker - Testing Guide

## 📋 Overview

Project ini memiliki comprehensive testing untuk backend API menggunakan **Jest** dan **Supertest**.

## 🚀 Quick Start

```bash
# Navigate to server directory
cd server

# Install dependencies (if not installed)
npm install

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode (for development)
npm run test:watch
```

## 📁 Test Structure

```
server/
├── __tests__/
│   ├── auth.test.js          # Authentication tests (10 test cases)
│   ├── books.test.js         # Books API tests (4 test cases)
│   ├── favorites.test.js     # Favorites tests (7 test cases)
│   ├── userBooks.test.js     # My Shelf CRUD tests (13 test cases)
│   └── entries.test.js       # Entries CRUD tests (15 test cases)
├── jest.config.js            # Jest configuration
└── TESTING.md               # Detailed testing documentation
```

## ✅ Test Coverage

### Authentication (`auth.test.js`)
- ✅ Register new user
- ✅ Handle duplicate email
- ✅ Validate required fields
- ✅ Login with credentials
- ✅ Handle wrong password
- ✅ Handle non-existent user

### Books API (`books.test.js`)
- ✅ Get books list (public)
- ✅ Search functionality
- ✅ Pagination support
- ✅ Get book detail
- ✅ Handle 404 errors

### Favorites (`favorites.test.js`)
- ✅ Require authentication
- ✅ Get favorites list
- ✅ Add to favorites
- ✅ Toggle favorite status
- ✅ Remove from favorites

### My Shelf (`userBooks.test.js`)
- ✅ CRUD operations
- ✅ Status management (to-read, reading, completed)
- ✅ Current page tracking
- ✅ Favorite toggle
- ✅ Duplicate prevention
- ✅ Authorization checks

### Entries (`entries.test.js`)
- ✅ Create note/highlight/summary
- ✅ Update entry content
- ✅ Delete entry
- ✅ Page number tracking
- ✅ Rating system
- ✅ Empty string to null conversion
- ✅ Type validation

## 📊 Expected Test Results

```bash
Total Test Suites: 5
Total Tests: 49+
Pass Rate: 100%
Coverage: Routes, Controllers, Middlewares
```

## 🔧 Test Commands

```bash
# Run all tests (recommended)
npm test

# Run specific test file
npm test -- __tests__/auth.test.js

# Run with coverage report
npm run test:coverage

# Watch mode for TDD
npm run test:watch

# Verbose output
npm test -- --verbose
```

## 📝 Writing New Tests

Template untuk test baru:

```javascript
const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

describe('Feature Name Tests', () => {
  let authToken;

  beforeAll(async () => {
    // Setup: create test data
  });

  afterAll(async () => {
    // Cleanup: remove test data
  });

  describe('GET /apis/endpoint', () => {
    it('should do something', async () => {
      const response = await request(app)
        .get('/apis/endpoint')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
    });
  });
});
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill existing server before running tests
pkill -f "node server.js"
npm test
```

### Database Connection
Ensure PostgreSQL is running and environment variables are set:
```bash
# Check .env file
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
```

### Open Handles Warning
Tests use `--detectOpenHandles` flag. If you see warnings:
- Ensure database connections are closed
- Check for hanging timers or promises

## 📖 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- See `TESTING.md` for detailed test documentation

## ✨ Features Tested

1. **Authentication & Authorization**
   - JWT token generation
   - Password hashing
   - Protected routes

2. **CRUD Operations**
   - Create, Read, Update, Delete
   - Input validation
   - Error handling

3. **Business Logic**
   - Favorites toggle
   - Status management
   - Empty string to null conversion

4. **API Responses**
   - Success (200, 201)
   - Client errors (400, 401, 404)
   - Proper JSON structure

---

**Happy Testing! 🧪**
