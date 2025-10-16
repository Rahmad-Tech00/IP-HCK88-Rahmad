import { useSelector } from 'react-redux'
import BookGrid from '../components/BookGrid'

export default function Favorites(){
  const favIds = useSelector(s=>s.favorites.ids)
  const all = useSelector(s=>s.books.items)
  const items = all.filter(b => favIds.includes(b.openLibId))

  return (
    <>
      <h4 className="fw-bold mb-3">My Favorites</h4>
      {items.length? <BookGrid items={items} onOpenDetail={()=>{}} /> : <div className="text-muted">No favorites yet.</div>}
    </>
  )
}