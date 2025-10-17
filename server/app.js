const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors({ origin: '*', credentials: true }));

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
