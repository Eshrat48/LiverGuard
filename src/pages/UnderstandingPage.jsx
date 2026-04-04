import SectionCard from '../components/SectionCard'
import banner2Img from '../assets/banner2.jpg'

export default function UnderstandingPage() {
  return (
    <SectionCard title="Understanding NAFLD" className="w-full">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-100 p-5">
          <h3 className="page-title text-2xl font-semibold text-blue-900">What is NAFLD?</h3>
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
          <button className="rounded-md bg-blue-700 py-2 font-semibold text-white">Read More</button>
        </div>
      </div>
    </SectionCard>
  )
}
