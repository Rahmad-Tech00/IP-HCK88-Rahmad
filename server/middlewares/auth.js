const { verify } = require('../helpers/jwt');
const db = require('../models'); // <-- perbaiki path

module.exports = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization;
    if (!bearer) throw { name: 'Unauthenticated' };
    const token = bearer.replace(/^Bearer\s+/i, '');
    const payload = verify(token);
    const user = await db.User.findByPk(payload.id);
    if (!user) throw { name: 'Unauthenticated' };
    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (e) { next(e); }
};
