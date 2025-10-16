const request = require('supertest');
const app = require('../app');
const { User, Book, UserBook } = require('../models');

describe('Favorites API Tests', () => {
  let authToken;
  let userId;
  let bookId;

  // Setup: Create user and login
  beforeAll(async () => {
    // Clean up
    await User.destroy({ where: { email: 'favorite-test@example.com' } });

    // Register user
    const registerResponse = await request(app)
      .post('/apis/auth/register')
      .send({
        email: 'favorite-test@example.com',
        password: 'password123',
        name: 'Favorite Test User'
      });

    userId = registerResponse.body.id; // Updated: direct id from response

    // Login
    const loginResponse = await request(app)
      .post('/apis/auth/login')
      .send({
        email: 'favorite-test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.access_token; // Updated: access_token instead of token

    // Get a book ID
    const booksResponse = await request(app).get('/apis/books');
    bookId = booksResponse.body.data[0].id; // Updated: data instead of books
  });

  // Cleanup
  afterAll(async () => {
    await UserBook.destroy({ where: { UserId: userId } });
    await User.destroy({ where: { email: 'favorite-test@example.com' } });
  });

  describe('GET /apis/favorites', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/apis/favorites')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should get favorites list when authenticated', async () => {
      const response = await request(app)
        .get('/apis/favorites')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('bookIds');
      expect(Array.isArray(response.body.bookIds)).toBe(true);
    });
  });

  describe('POST /apis/favorites/:bookId', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .post(`/apis/favorites/${bookId}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should add book to favorites', async () => {
      const response = await request(app)
        .post(`/apis/favorites/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('bookId');
      expect(response.body).toHaveProperty('isFavorite');
      expect(response.body.isFavorite).toBe(true);
    });

    it('should toggle favorite status', async () => {
      const response = await request(app)
        .post(`/apis/favorites/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.isFavorite).toBe(false);
    });

    it('should toggle back to favorite', async () => {
      const response = await request(app)
        .post(`/apis/favorites/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.isFavorite).toBe(true);
    });
  });
});
