import SectionCard from '../components/SectionCard'
import banner2Img from '../assets/banner2.jpg'

const models = ['Logistic Regression', 'Random Forest', 'XGBoost']

export default function AboutPage() {
  return (
    <SectionCard title="About" className="w-full">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-100 p-5">
          <h3 className="page-title text-2xl font-semibold text-blue-900">About NAFLD</h3>
          <p className="mt-2 text-sm text-slate-600">
            NAFLD is excess fat accumulation in liver tissue not caused by alcohol use. Early detection helps prevent severe outcomes.
          </p>
          <div className="mt-5 overflow-hidden rounded-lg border border-blue-100 bg-slate-50">
            <div className="aspect-[16/9] w-full">
              <img src={banner2Img} alt="NAFLD illustration" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="font-semibold text-blue-900">Common Causes</h4>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
              <li>Obesity</li>
              <li>Diabetes</li>
              <li>High cholesterol</li>
            </ul>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="font-semibold text-blue-900">Common Symptoms</h4>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
              <li>Fatigue</li>
              <li>Abdominal pain</li>
              <li>Elevated liver enzymes</li>
            </ul>
          </article>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
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
        </article>
      </div>
    </SectionCard>
  )
}
