import BookCard from './BookCard'

export default function BookGrid({ items, onOpenDetail }){
  return (
    <div className="row g-3">
      {items.map(b=>(
        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={`${b.openLibId}-${b.title}`}>
          <BookCard book={b} onOpenDetail={onOpenDetail} />
        </div>
      ))}
    </div>
  )
}
