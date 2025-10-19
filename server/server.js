// server.js (root)
// require('dotenv').config();
const app = require('./app');

const PORT = Number(process.env.PORT || 4000);
const HOST = '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`⚡ Server listening on http://${HOST}:${PORT}`);
});