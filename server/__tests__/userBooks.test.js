const request = require('supertest');
const app = require('../app');
const { User, Book, UserBook } = require('../models');

describe('User Books (My Shelf) API Tests', () => {
  let authToken;
  let userId;
  let bookId;
  let userBookId;

  beforeAll(async () => {
    // Clean up
    await User.destroy({ where: { email: 'shelf-test@example.com' } });

    // Register and login
    const registerResponse = await request(app)
      .post('/apis/auth/register')
      .send({
        email: 'shelf-test@example.com',
        password: 'password123',
        name: 'Shelf Test User'
      });

    userId = registerResponse.body.id; // Updated

    const loginResponse = await request(app)
      .post('/apis/auth/login')
      .send({
        email: 'shelf-test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.access_token; // Updated

    // Get a book
    const booksResponse = await request(app).get('/apis/books');
    bookId = booksResponse.body.data[0].id; // Updated: data instead of books
  });

  afterAll(async () => {
    await UserBook.destroy({ where: { UserId: userId } });
    await User.destroy({ where: { email: 'shelf-test@example.com' } });
  });

  describe('GET /apis/user-books', () => {
    it('should require authentication', async () => {
      await request(app)
        .get('/apis/user-books')
        .expect(401);
    });

    it('should get user shelf when authenticated', async () => {
      const response = await request(app)
        .get('/apis/user-books')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /apis/user-books', () => {
    it('should require authentication', async () => {
      await request(app)
        .post('/apis/user-books')
        .send({ BookId: bookId, status: 'to-read' })
        .expect(401);
    });

    it('should add book to shelf', async () => {
      const response = await request(app)
        .post('/apis/user-books')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ BookId: bookId, status: 'reading' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('reading');
      
      userBookId = response.body.id;
    });

    it('should fail when adding duplicate book', async () => {
      await request(app)
        .post('/apis/user-books')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ BookId: bookId, status: 'to-read' })
        .expect(400);
    });

    it('should fail with invalid status', async () => {
      const booksResponse = await request(app).get('/apis/books?page=2');
      const anotherBookId = booksResponse.body.data[0].id; // Updated

      await request(app)
        .post('/apis/user-books')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ BookId: anotherBookId, status: 'invalid-status' })
        .expect(400);
    });
  });

  describe('PATCH /apis/user-books/:id', () => {
    it('should require authentication', async () => {
      await request(app)
        .patch(`/apis/user-books/${userBookId}`)
        .send({ status: 'completed' })
        .expect(401);
    });

    it('should update book status', async () => {
      const response = await request(app)
        .patch(`/apis/user-books/${userBookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'completed', currentPage: 250 })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('completed');
      expect(response.body.currentPage).toBe(250);
    });

    it('should toggle favorite', async () => {
      const response = await request(app)
        .patch(`/apis/user-books/${userBookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ isFavorite: true })
        .expect(200);

      expect(response.body.isFavorite).toBe(true);
    });
  });

  describe('DELETE /apis/user-books/:id', () => {
    it('should require authentication', async () => {
      await request(app)
        .delete(`/apis/user-books/${userBookId}`)
        .expect(401);
    });

    it('should delete book from shelf', async () => {
      const response = await request(app)
        .delete(`/apis/user-books/${userBookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail when deleting non-existent entry', async () => {
      await request(app)
        .delete(`/apis/user-books/999999`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
