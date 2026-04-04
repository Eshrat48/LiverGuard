export default function SectionCard({ title, children, className = '' }) {
  return (
    <section className={`overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-md ${className}`}>
      <header className="page-title bg-gradient-to-r from-blue-700 to-sky-500 px-5 py-3 text-xl font-semibold text-white">
        {title}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}
