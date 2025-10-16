const express = require('express');
const router = express.Router();

const authController = require('../controllers/authcontroller');
const bookController = require('../controllers/book.controller');
const userBookController = require('../controllers/userBook.controller');
const entryController = require('../controllers/entry.controller');
const favoritesController = require('../controllers/favoritesController');

const authenticate = require('../middlewares/auth');

router.use((req, res, next) => {
  console.log('[ROUTER] Incoming request:', req.method, req.path);
  next();
});

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/google-login', authController.googleLogin);

router.get('/books', bookController.list);
router.get('/books/:id', bookController.detail);

router.use(authenticate);

router.get('/favorites', favoritesController.getFavorites);
router.post('/favorites/:bookId', favoritesController.toggleFavorite);

router.get('/user-books', userBookController.myShelf);
router.post('/user-books', userBookController.add);
router.patch('/user-books/:id', userBookController.update);
router.delete('/user-books/:id', userBookController.remove);

router.get('/entries', entryController.list);
router.post('/entries', entryController.create);
router.patch('/entries/:id', entryController.update);
router.delete('/entries/:id', entryController.remove);

module.exports = router;
