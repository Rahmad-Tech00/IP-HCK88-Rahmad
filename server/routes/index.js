const express = require('express');
const router = express.Router();

const authController = require('../controllers/authcontroller');
const bookController = require('../controllers/book.controller');
const userBookController = require('../controllers/userBook.controller');
const entryController = require('../controllers/entry.controller');
const favoritesController = require('../controllers/favoritesController');

const authenticate = require('../middlewares/auth');

// Debug middleware
router.use((req, res, next) => {
  console.log('[ROUTER] Incoming request:', req.method, req.path);
  next();
});

// Auth routes (public)
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/google-login', authController.googleLogin);

// Public Books routes (bisa diakses tanpa login)
router.get('/books', bookController.list);
router.get('/books/:id', bookController.detail);

// Protected routes
router.use(authenticate);

// Favorites
router.get('/favorites', favoritesController.getFavorites);
router.post('/favorites/:bookId', favoritesController.toggleFavorite);

// User Books
router.get('/user-books', userBookController.myShelf);
router.post('/user-books', userBookController.add);
router.patch('/user-books/:id', userBookController.update);
router.delete('/user-books/:id', userBookController.remove);

// Entries
router.get('/entries', entryController.list);
router.post('/entries', entryController.create);
router.patch('/entries/:id', entryController.update);
router.delete('/entries/:id', entryController.remove);

module.exports = router;
