import SectionCard from '../components/SectionCard'

export default function PredictionResultPage() {
  return (
    <SectionCard title="Prediction Results" className="w-full">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h3 className="page-title text-3xl font-semibold text-blue-900">Prediction Outcome</h3>
          <p className="mt-2 text-slate-600">Risk label and probability from the backend model will render here.</p>
          <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
            No prediction result yet. Submit values from the Input page to populate this panel.
          </div>
          <button className="mt-6 rounded-md bg-blue-700 px-6 py-2 font-semibold text-white">Back to Home</button>
        </div>

        <aside className="rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-5">
          <p className="text-sm font-semibold text-slate-700">Contributing Factors</p>
          <div className="mt-3 rounded-lg border border-dashed border-blue-200 bg-white p-4 text-sm text-slate-500">
            SHAP values, feature importance, and text explanation from backend will appear here.
          </div>
          <p className="mt-5 text-sm font-semibold text-slate-700">Recommendation</p>
          <div className="mt-3 rounded-lg border border-dashed border-blue-200 bg-white p-4 text-sm text-slate-500">
            Next-step recommendations will appear here.
          </div>
        </aside>
      </div>
    </SectionCard>
  )
}
