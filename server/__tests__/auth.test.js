const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

describe('Authentication Tests', () => {
  let testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  };

  // Clean up before tests
  beforeAll(async () => {
    await User.destroy({ where: { email: testUser.email } });
  });

  // Clean up after tests
  afterAll(async () => {
    await User.destroy({ where: { email: testUser.email } });
  });

  describe('POST /apis/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/apis/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body.email).toBe(testUser.email);
    });

    it('should fail with duplicate email', async () => {
      const response = await request(app)
        .post('/apis/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail with missing email', async () => {
      const response = await request(app)
        .post('/apis/auth/register')
        .send({ password: 'test123', name: 'Test' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail with missing password', async () => {
      const response = await request(app)
        .post('/apis/auth/register')
        .send({ email: 'new@test.com', name: 'Test' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /apis/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/apis/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(typeof response.body.access_token).toBe('string');
    });

    it('should fail with wrong password', async () => {
      const response = await request(app)
        .post('/apis/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/apis/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail with missing credentials', async () => {
      const response = await request(app)
        .post('/apis/auth/login')
        .send({})
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});
