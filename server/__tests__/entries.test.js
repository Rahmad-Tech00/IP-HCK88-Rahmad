const request = require('supertest');
const app = require('../app');
const { User, Book, UserBook, UserBookEntry } = require('../models');

describe('Entries API Tests', () => {
  let authToken;
  let userId;
  let userBookId;
  let entryId;

  beforeAll(async () => {
    // Clean up
    await User.destroy({ where: { email: 'entry-test@example.com' } });

    // Register and login
    const registerResponse = await request(app)
      .post('/apis/auth/register')
      .send({
        email: 'entry-test@example.com',
        password: 'password123',
        name: 'Entry Test User'
      });

    userId = registerResponse.body.id; // Updated

    const loginResponse = await request(app)
      .post('/apis/auth/login')
      .send({
        email: 'entry-test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.access_token; // Updated

    // Add a book to shelf
    const booksResponse = await request(app).get('/apis/books');
    const bookId = booksResponse.body.data[0].id; // Updated: data instead of books

    const shelfResponse = await request(app)
      .post('/apis/user-books')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ BookId: bookId, status: 'reading' });

    userBookId = shelfResponse.body.id; // Updated: direct id from response
  });

  afterAll(async () => {
    await UserBookEntry.destroy({ where: { UserBookId: userBookId } });
    await UserBook.destroy({ where: { UserId: userId } });
    await User.destroy({ where: { email: 'entry-test@example.com' } });
  });

  describe('GET /apis/entries', () => {
    it('should require authentication', async () => {
      await request(app)
        .get('/apis/entries')
        .expect(401);
    });

    it('should get entries list when authenticated', async () => {
      const response = await request(app)
        .get('/apis/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /apis/entries', () => {
    it('should require authentication', async () => {
      await request(app)
        .post('/apis/entries')
        .send({
          UserBookId: userBookId,
          type: 'note',
          content: 'Test note'
        })
        .expect(401);
    });

    it('should create a new entry', async () => {
      const response = await request(app)
        .post('/apis/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          UserBookId: userBookId,
          type: 'note',
          content: 'This is a test note',
          page: 42
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe('note');
      expect(response.body.content).toBe('This is a test note');
      expect(response.body.page).toBe(42);
      
      entryId = response.body.id;
    });

    it('should create entry with empty page (null)', async () => {
      const response = await request(app)
        .post('/apis/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          UserBookId: userBookId,
          type: 'highlight',
          content: 'Important highlight',
          page: '' // Empty string should become null
        })
        .expect(201);

      expect(response.body.page).toBeNull();
    });

    it('should fail with invalid type', async () => {
      await request(app)
        .post('/apis/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          UserBookId: userBookId,
          type: 'invalid-type',
          content: 'Test'
        })
        .expect(400);
    });

    it('should fail without UserBookId', async () => {
      await request(app)
        .post('/apis/entries')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'note',
          content: 'Test'
        })
        .expect(400);
    });
  });

  describe('PATCH /apis/entries/:id', () => {
    it('should require authentication', async () => {
      await request(app)
        .patch(`/apis/entries/${entryId}`)
        .send({ content: 'Updated content' })
        .expect(401);
    });

    it('should update entry', async () => {
      const response = await request(app)
        .patch(`/apis/entries/${entryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Updated note content',
          page: 50,
          rating: 5
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe('Updated note content');
      expect(response.body.page).toBe(50);
      expect(response.body.rating).toBe(5);
    });

    it('should fail when updating non-existent entry', async () => {
      await request(app)
        .patch('/apis/entries/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Test' })
        .expect(404);
    });
  });

  describe('DELETE /apis/entries/:id', () => {
    it('should require authentication', async () => {
      await request(app)
        .delete(`/apis/entries/${entryId}`)
        .expect(401);
    });

    it('should delete entry', async () => {
      await request(app)
        .delete(`/apis/entries/${entryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('should fail when deleting non-existent entry', async () => {
      await request(app)
        .delete('/apis/entries/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
