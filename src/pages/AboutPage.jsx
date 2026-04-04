import SectionCard from '../components/SectionCard'

const models = ['Logistic Regression', 'Random Forest', 'XGBoost']

export default function AboutPage() {
  return (
    <SectionCard title="About the Project" className="w-full">
      <div className="grid gap-5 lg:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="page-title text-xl font-semibold text-blue-900">Objective</h3>
          <p className="mt-2 text-sm text-slate-600">
            Detect NAFLD risk using machine learning and clinically relevant liver health indicators.
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="page-title text-xl font-semibold text-blue-900">Methods & Models</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {models.map((model) => (
              <li key={model} className="rounded bg-blue-50 px-3 py-2 font-medium text-blue-900">
                {model}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="page-title text-xl font-semibold text-blue-900">Dataset</h3>
          <p className="mt-2 text-sm text-slate-600">Clinical data from study participants and lab records.</p>
          <button className="mt-5 w-full rounded-md bg-blue-700 py-2 font-semibold text-white">Learn More</button>
        </article>
      </div>
    </SectionCard>
  )
}
