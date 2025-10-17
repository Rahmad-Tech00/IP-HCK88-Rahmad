const request = require('supertest');
const app = require('../app');
const { User, Book, UserBook } = require('../models');

describe('Books API Tests', () => {
  describe('Public Routes', () => {
    describe('GET /apis/books', () => {
      it('should get list of books without authentication', async () => {
        const response = await request(app)
          .get('/apis/books')
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should support search query', async () => {
        const response = await request(app)
          .get('/apis/books?q=design')
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should support pagination', async () => {
        const response = await request(app)
          .get('/apis/books?page=1&limit=10')
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('GET /apis/books/:id', () => {
      it('should get book detail without authentication', async () => {
        // Get first book
        const booksResponse = await request(app).get('/apis/books');
        const firstBook = booksResponse.body.data[0];

        const response = await request(app)
          .get(`/apis/books/${firstBook.id}`)
          .expect(200);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title');
      });

      it('should return 404 for non-existent book', async () => {
        const response = await request(app)
          .get('/apis/books/999999')
          .expect(404);

        expect(response.body).toHaveProperty('message');
      });
    });
  });
});
