const db = require('../models');          // <-- perbaiki path
const { Op } = db.Sequelize;
// sisanya sama


module.exports = {
  list: async (req, res, next) => {
    try {
      console.log('[BOOK CONTROLLER] list called with query:', req.query);
      const { q } = req.query;
      const where = q ? { title: { [Op.iLike]: `%${q}%` } } : {};
      const rows = await db.Book.findAll({ where, order: [['createdAt','DESC']] });
      console.log('[BOOK CONTROLLER] Found', rows.length, 'books');
      res.json({ data: rows });
    } catch (e) { 
      console.error('[BOOK CONTROLLER] Error:', e);
      next(e); 
    }
  },

  create: async (req, res, next) => {
    try {
      const { openLibraryId, title, authors, coverUrl, pages, publishedYear } = req.body;
      const row = await db.Book.create({ openLibraryId, title, authors, coverUrl, pages, publishedYear });
      res.status(201).json(row);
    } catch (e) { next(e); }
  },

  detail: async (req, res, next) => {
    try {
      const row = await db.Book.findByPk(req.params.id);
      if (!row) return res.status(404).json({ message: 'Not found' });
      res.json(row);
    } catch (e) { next(e); }
  },

  update: async (req, res, next) => {
    try {
      const row = await db.Book.findByPk(req.params.id);
      if (!row) return res.status(404).json({ message: 'Not found' });
      const { openLibraryId, title, authors, coverUrl, pages, publishedYear } = req.body;
      await row.update({ openLibraryId, title, authors, coverUrl, pages, publishedYear });
      res.json(row);
    } catch (e) { next(e); }
  },

  remove: async (req, res, next) => {
    try {
      const row = await db.Book.findByPk(req.params.id);
      if (!row) return res.status(404).json({ message: 'Not found' });
      await row.destroy();
      res.status(204).end();
    } catch (e) { next(e); }
  }
};
