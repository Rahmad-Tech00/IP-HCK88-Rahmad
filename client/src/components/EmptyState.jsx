export default function EmptyState({ title="No data", subtitle="Try different keywords." }){
  return (
    <div className="text-center text-muted py-5">
      <div className="display-6">📚</div>
      <h6 className="mt-2">{title}</h6>
      <p className="small">{subtitle}</p>
    </div>
  )
}
