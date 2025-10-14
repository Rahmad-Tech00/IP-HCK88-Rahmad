const COVER_BASE = import.meta.env.VITE_COVER_BASE || 'https://covers.openlibrary.org'


export function mapSearchDocs(docs = []) {
  return docs.map(d => {
    const openLibId =
      (d.key && d.key.replace('/works/', '')) ||
      d.cover_edition_key ||
      (Array.isArray(d.edition_key) ? d.edition_key[0] : null)

    const coverUrl = d.cover_i
      ? `${COVER_BASE}/b/id/${d.cover_i}-L.jpg`
      : null

    return {
      openLibId,
      title: d.title,
      authors: Array.isArray(d.author_name) ? d.author_name : [],
      coverUrl,
      pages: d.number_of_pages_median || null,
      publishedYear: d.first_publish_year || null
    }
  })
}
