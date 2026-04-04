import SectionCard from '../components/SectionCard'

const metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score']

export default function PerformancePage() {
  return (
    <SectionCard title="Model Performance" className="w-full">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <p className="font-semibold text-slate-700">Evaluation Metrics</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {metrics.map((label) => (
              <div key={label} className="rounded border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-600">{label}</p>
                <p className="mt-1 text-sm text-blue-800">Value from backend</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded border border-slate-200 bg-white p-4">
            <p className="text-center text-sm font-semibold text-slate-600">Confusion Matrix</p>
            <div className="mt-3 grid grid-cols-3 text-center text-sm">
              <div className="bg-slate-100 p-2" />
              <div className="bg-blue-600 p-2 font-semibold text-white">NAFLD</div>
              <div className="bg-blue-500 p-2 font-semibold text-white">No NAFLD</div>
              <div className="bg-blue-600 p-2 font-semibold text-white">Predicted</div>
              <div className="bg-emerald-100 p-2 font-semibold">-</div>
              <div className="bg-slate-100 p-2 font-semibold">-</div>
              <div className="bg-blue-500 p-2 font-semibold text-white">Actual</div>
              <div className="bg-emerald-200 p-2 font-semibold">-</div>
              <div className="bg-slate-100 p-2 font-semibold">-</div>
            </div>
          </div>
        </div>

        <aside className="rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-5">
          <h4 className="font-semibold text-blue-900">Backend Integration Status</h4>
          <p className="mt-2 text-sm text-slate-600">This panel can show model version, last trained date, and API response health.</p>
          <div className="mt-4 rounded-lg border border-dashed border-blue-200 bg-white p-4 text-sm text-slate-500">
            Waiting for backend connection.
          </div>
        </aside>
      </div>
    </SectionCard>
  )
}
