const db = require('../models');


module.exports = {
  myShelf: async (req, res, next) => {
    try {
      const rows = await db.UserBook.findAll({
        where: { UserId: req.user.id },
        include: [{ model: db.Book }],
        order: [['updatedAt','DESC']]
      });
      res.json({ data: rows });
    } catch (e) { next(e); }
  },

  add: async (req, res, next) => {
    try {
      const { BookId, status, shelfName, currentPage } = req.body;
      
      // Validate status
      const validStatuses = ['reading', 'completed', 'want-to-read'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        });
      }
      
      const cleanCurrentPage = currentPage === '' || currentPage === null || currentPage === undefined ? null : parseInt(currentPage);
      
      const row = await db.UserBook.create({ 
        UserId: req.user.id, 
        BookId, 
        status, 
        shelfName: shelfName || null,
        currentPage: cleanCurrentPage
      });
      
      res.status(201).json(row);
    } catch (e) { 
      console.error('[USER BOOK ADD] Error:', e.message);
      next(e); 
    }
  },

  update: async (req, res, next) => {
    try {
      const row = await db.UserBook.findOne({ where: { id: req.params.id, UserId: req.user.id } });
      if (!row) return res.status(404).json({ message: 'Not found' });
      const { status, shelfName, currentPage, isFavorite } = req.body;
      
      const cleanCurrentPage = currentPage === '' || currentPage === null || currentPage === undefined ? null : parseInt(currentPage);
      
      await row.update({ 
        status, 
        shelfName: shelfName || null, 
        currentPage: cleanCurrentPage, 
        isFavorite 
      });
      
      res.json(row);
    } catch (e) { next(e); }
  },

  remove: async (req, res, next) => {
    try {
      const row = await db.UserBook.findOne({ where: { id: req.params.id, UserId: req.user.id } });
      if (!row) return res.status(404).json({ message: 'Not found' });
      await row.destroy();
      res.json({ message: 'Book removed from shelf' });
    } catch (e) { next(e); }
  }
};
