import SectionCard from '../components/SectionCard'

const supervisor = [
  'Prof. Dr. Muhammad Golam Kibria',
  'Dept. of Computer Science and Engineering, University of Liberal Arts Bangladesh'
]

const students = [
  ['Ayush Hassan Raiyan', '223014015'],
  ['Jarin Tasnim Eara', '223014136'],
  ['Safaina Khan Oishi', '223014144'],
  ['Eshrat Kamal Nova', '223014197'],
]

export default function TeamPage() {
  return (
    <SectionCard title="Meet Our Team" className="w-full">
      <p className="mb-4 text-lg font-semibold text-blue-900">The Team Behind the Project</p>

      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Supervisor</p>
        <article className="mx-auto max-w-md rounded-xl border border-blue-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-200 to-blue-400" />
          <p className="text-lg font-semibold text-blue-900">{supervisor[0]}</p>
          <p className="text-sm text-slate-500">{supervisor[1]}</p>
        </article>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Students</p>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {students.map(([name, id]) => (
            <article key={name} className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-slate-200 to-blue-200" />
              <p className="text-lg font-semibold text-blue-900">{name}</p>
              <p className="text-sm text-slate-500">ID: {id}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}
