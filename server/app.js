const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://book-tracker-rahmad.web.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  console.log(`[APP] ${req.method} ${req.url}`);
  next();
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => res.json({ message: 'Book Tracker API OK' }));

app.post('/apis/_echo', (req, res) => res.json({ ok: true, body: req.body }));

app.use('/apis', router);

app.use(errorHandler);

module.exports = app;
