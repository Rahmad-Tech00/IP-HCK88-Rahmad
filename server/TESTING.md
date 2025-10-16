# Testing Documentation

## Backend Testing

### Setup
Tests menggunakan **Jest** dan **Supertest** untuk integration testing.

### Test Files
- `__tests__/auth.test.js` - Authentication (Register & Login)
- `__tests__/books.test.js` - Books API (Public routes)
- `__tests__/favorites.test.js` - Favorites functionality
- `__tests__/userBooks.test.js` - My Shelf CRUD operations
- `__tests__/entries.test.js` - Book entries/notes CRUD

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- __tests__/auth.test.js
```

### Test Coverage

Tests mencakup:
- ✅ User registration with validation
- ✅ User login with authentication
- ✅ Public book listing and search
- ✅ Favorites toggle functionality
- ✅ My Shelf CRUD (Create, Read, Update, Delete)
- ✅ Book entries/notes CRUD
- ✅ Authentication middleware
- ✅ Error handling (401, 404, 400 responses)
- ✅ Input validation
- ✅ Empty string to null conversion for integer fields

### Test Structure

Each test suite includes:
1. **Setup** (`beforeAll`) - Create test users and data
2. **Tests** - Individual test cases
3. **Cleanup** (`afterAll`) - Remove test data

### Example Test Cases

#### Authentication Tests
- ✅ Register new user successfully
- ✅ Fail with duplicate email
- ✅ Fail with missing fields
- ✅ Login with correct credentials
- ✅ Fail with wrong password

#### My Shelf Tests
- ✅ Add book to shelf with status
- ✅ Update book status (to-read, reading, completed)
- ✅ Toggle favorite
- ✅ Remove book from shelf
- ✅ Handle duplicate entries

#### Entries Tests
- ✅ Create note/highlight/summary
- ✅ Update entry content
- ✅ Delete entry
- ✅ Handle empty page numbers (null conversion)
- ✅ Validate entry types

### Notes

- Tests run in **band** (`--runInBand`) untuk menghindari race conditions
- Database cleanup dilakukan di setiap suite
- Token JWT digunakan untuk authenticated routes
- Test timeout: 10 seconds per test

### Expected Results

All tests should pass with:
- ✅ 50+ test cases
- ✅ 100% route coverage
- ✅ Proper error handling
- ✅ Authentication validation
