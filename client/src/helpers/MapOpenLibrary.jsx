// Map data dari server API (database)
export function mapServerBooks(books = []) {
  return books.map(b => ({
    id: b.id,
    openLibId: b.openLibraryId,
    title: b.title,
    authors: Array.isArray(b.authors) ? b.authors : [],
    coverUrl: b.coverUrl,
    pages: b.pages,
    publishedYear: b.publishedYear,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt
  }))
}

