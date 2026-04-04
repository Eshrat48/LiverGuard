import SectionCard from '../components/SectionCard'

const fields = ['Age', 'BMI', 'Glucose Level', 'ALT', 'AST', 'Triglycerides']

export default function PredictionInputPage() {
  return (
    <SectionCard title="Prediction Input" className="w-full">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="page-title text-xl font-semibold text-blue-900">Enter Patient Details</h3>
          <p className="mt-1 text-sm text-slate-500">These values will be sent to the backend prediction model.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {fields.map((label) => (
              <label key={label} className="space-y-1 text-sm">
                <span className="font-semibold text-slate-600">{label}</span>
                <input
                  type="text"
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none focus:border-blue-400"
                />
              </label>
            ))}
          </div>
          <button className="mt-5 w-full rounded-md bg-blue-700 py-2 font-semibold text-white">Predict</button>
        </div>

        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 via-sky-50 to-white p-5">
          <h3 className="page-title text-xl font-semibold text-blue-900">Model Request Preview</h3>
          <p className="mt-2 text-sm text-slate-600">Prediction payload and validation status will appear here after frontend-backend integration.</p>
          <div className="mt-5 rounded-lg border border-dashed border-blue-200 bg-white/70 p-4 text-sm text-slate-500">
            Waiting for user input and backend endpoint connection.
          </div>
          <p className="mt-4 text-xs text-slate-500">Note: This form collects user inputs and will be connected to the model backend.</p>
        </div>
      </div>
    </SectionCard>
  )
}
