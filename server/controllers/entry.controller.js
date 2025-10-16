const db = require('../models');


module.exports = {
  list: async (req, res, next) => {
    try {
      const rows = await db.UserBookEntry.findAll({
        include: [{ model: db.UserBook, where: { UserId: req.user.id }, include: [db.Book] }],
        order: [['createdAt','DESC']]
      });
      res.json({ data: rows });
    } catch (e) { next(e); }
  },

  create: async (req, res, next) => {
    try {
      console.log('[ENTRY CREATE] Request body:', req.body);
      console.log('[ENTRY CREATE] User ID:', req.user.id);
      
      const { UserBookId, type, content, page, rating } = req.body;
      
      // Validate UserBookId
      if (!UserBookId) {
        return res.status(400).json({ message: 'UserBookId is required' });
      }
      
      // Validate type
      const validTypes = ['note', 'highlight', 'quote', 'review'];
      if (!type || !validTypes.includes(type)) {
        return res.status(400).json({ 
          message: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
        });
      }
      
      const ub = await db.UserBook.findOne({ where: { id: UserBookId, UserId: req.user.id } });
      console.log('[ENTRY CREATE] UserBook found:', ub ? ub.id : 'NOT FOUND');
      
      if (!ub) {
        return res.status(404).json({ 
          message: 'Book not found in your shelf. Please add the book to your shelf first.' 
        });
      }
      
      console.log('[ENTRY CREATE] Creating entry with type:', type);
      
      const cleanPage = page === '' || page === null || page === undefined ? null : parseInt(page);
      const cleanRating = rating === '' || rating === null || rating === undefined ? null : parseInt(rating);
      
      // Extra safety check for NaN
      if (cleanPage !== null && isNaN(cleanPage)) {
        return res.status(400).json({ message: 'Invalid page number' });
      }
      if (cleanRating !== null && isNaN(cleanRating)) {
        return res.status(400).json({ message: 'Invalid rating' });
      }
      
      const row = await db.UserBookEntry.create({ 
        UserBookId, 
        type, 
        content, 
        page: cleanPage, 
        rating: cleanRating 
      });
      
      const entryWithBook = await db.UserBookEntry.findByPk(row.id, {
        include: [{ 
          model: db.UserBook, 
          include: [db.Book] 
        }]
      });
      
      console.log('[ENTRY CREATE] Success! Entry ID:', row.id);
      res.status(201).json(entryWithBook);
    } catch (e) { 
      console.error('[ENTRY CREATE] Error:', e.message);
      console.error('[ENTRY CREATE] Stack:', e.stack);
      next(e); 
    }
  },

  update: async (req, res, next) => {
    try {
      const row = await db.UserBookEntry.findByPk(req.params.id, { include: [db.UserBook] });
      if (!row || row.UserBook.UserId !== req.user.id) return res.status(404).json({ message: 'Not found' });
      const { type, content, page, rating } = req.body;
      
      const cleanPage = page === '' || page === null || page === undefined ? null : parseInt(page);
      const cleanRating = rating === '' || rating === null || rating === undefined ? null : parseInt(rating);
      
      // Extra safety check for NaN
      if (cleanPage !== null && isNaN(cleanPage)) {
        return res.status(400).json({ message: 'Invalid page number' });
      }
      if (cleanRating !== null && isNaN(cleanRating)) {
        return res.status(400).json({ message: 'Invalid rating' });
      }
      
      await row.update({ type, content, page: cleanPage, rating: cleanRating });
      res.json(row);
    } catch (e) { next(e); }
  },

  remove: async (req, res, next) => {
    try {
      const row = await db.UserBookEntry.findByPk(req.params.id, { include: [db.UserBook] });
    if (!row || row.UserBook.UserId !== req.user.id) return res.status(404).json({ message: 'Not found' });
      await row.destroy();
      res.status(204).end();
    } catch (e) { next(e); }
  }
};
