const { UserBook } = require('../models')

module.exports = {
  // GET /apis/favorites - Get user's favorite books
  getFavorites: async (req, res, next) => {
    try {
      const userId = req.user.id
      
      const favorites = await UserBook.findAll({
        where: { 
          UserId: userId,
          isFavorite: true 
        },
        attributes: ['BookId']
      })
      
      const bookIds = favorites.map(f => f.BookId)
      res.json({ bookIds })
      
    } catch (e) {
      next(e)
    }
  },

  // POST /apis/favorites/:bookId - Toggle favorite status
  toggleFavorite: async (req, res, next) => {
    try {
      const userId = req.user.id
      const bookId = +req.params.bookId
      
      // Find or create UserBook entry
      const [userBook, created] = await UserBook.findOrCreate({
        where: { UserId: userId, BookId: bookId },
        defaults: { 
          UserId: userId, 
          BookId: bookId,
          status: 'to-read',
          isFavorite: true 
        }
      })
      
      if (!created) {
        // Toggle favorite status
        userBook.isFavorite = !userBook.isFavorite
        await userBook.save()
      }
      
      res.json({ 
        bookId,
        isFavorite: userBook.isFavorite 
      })
      
    } catch (e) {
      next(e)
    }
  }
}
