const { UserBook } = require('../models')

module.exports = {
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

  toggleFavorite: async (req, res, next) => {
    try {
      const userId = req.user.id
      const bookId = +req.params.bookId
      
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
