const bcrypt = require('bcryptjs');
const db = require('../models');
const { sign, verify } = require('../helpers/jwt');
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

module.exports = {
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (!email || !password) {
        throw { name: 'SequelizeValidationError', errors:[{ message:'email & password required' }] };
      }
      const hash = bcrypt.hashSync(password, 10);
      const user = await db.User.create({ name, email, password: hash });
      res.status(201).json({ id: user.id, email: user.email });
    } catch (e) { next(e); }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await db.User.findOne({ where: { email } });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw { name: 'Unauthenticated' };
      }
      const access_token = sign({ id: user.id, email: user.email });
      res.json({ access_token });
    } catch (e) { 
      next(e); 
    }
  },

  googleLogin: async (req, res, next) => {
    try {
      console.log('[GOOGLE LOGIN] Request body:', req.body);
      const { credential } = req.body; // Google JWT token
      
      if (!credential) {
        console.error('[GOOGLE LOGIN] No credential provided');
        throw { name: 'Unauthenticated', message: 'Google credential required' };
      }
      
      if (!GOOGLE_CLIENT_ID) {
        console.error('[GOOGLE LOGIN] GOOGLE_CLIENT_ID not configured');
        throw { name: 'ServerError', message: 'Google OAuth not configured' };
      }
      
      console.log('[GOOGLE LOGIN] Verifying token with Google...');
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      const { email, name, picture } = payload;
      console.log('[GOOGLE LOGIN] Token verified. Email:', email, 'Name:', name);
      
      let user = await db.User.findOne({ where: { email } });
      
      if (!user) {
        console.log('[GOOGLE LOGIN] Creating new user from Google');
        user = await db.User.create({
          name: name || email.split('@')[0],
          email,
          password: 'google_secret',
        });
        console.log('[GOOGLE LOGIN] New user created:', user.id);
      } else {
        console.log('[GOOGLE LOGIN] Existing user found:', user.id);
      }
      
      const access_token = sign({ id: user.id, email: user.email });
      console.log('[GOOGLE LOGIN] Success! Sending token');
      res.json({ access_token, user: { id: user.id, email: user.email, name: user.name } });
      
    } catch (e) {
      console.error('[GOOGLE LOGIN] Error:', e.message);
      console.error('[GOOGLE LOGIN] Error stack:', e.stack);
      next(e);
    }
  }
};
