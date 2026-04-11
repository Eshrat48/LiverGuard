import SectionCard from '../components/SectionCard'
import { useLocation, useNavigate } from 'react-router-dom'

export default function PredictionResultPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const storedStateRaw = sessionStorage.getItem('latestPredictionResult')
  let storedState = null
  try {
    storedState = storedStateRaw ? JSON.parse(storedStateRaw) : null
  } catch {
    storedState = null
  }

  const resolvedState = location.state || storedState || {}
  const saved = resolvedState.saved
  const prediction = resolvedState.prediction
  const modelError = resolvedState.modelError
  const submittedData = resolvedState.submittedData

  const modelClass = prediction?.prediction
  const probabilityRaw = prediction?.probability
  const probabilityPercent =
    typeof probabilityRaw === 'number'
      ? Math.round(probabilityRaw <= 1 ? probabilityRaw * 100 : probabilityRaw)
      : null
  const riskLabel =
    prediction?.riskLabel ||
    (typeof modelClass === 'number' ? (modelClass === 1 ? 'High Risk' : 'Low Risk') : null)

  const factorsToShow = prediction?.factors || []
  const recommendationToShow = prediction?.recommendation || 'Recommendation is unavailable from the current model response.'

  return (
    <SectionCard title="Prediction Results" className="w-full">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h3 className="page-title text-3xl font-semibold text-blue-900">Prediction Outcome</h3>
          <p className="mt-2 text-slate-600">Model output will appear here after deployment.</p>

          {saved && (
            <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              Data submitted successfully.
            </div>
          )}

          {saved && !prediction && modelError && (
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {modelError}. Start the model API at http://127.0.0.1:5001 and submit again.
            </div>
          )}

          {prediction ? (
            <div className="mt-6 space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold text-slate-800">Risk Label: {riskLabel || 'Available'}</p>
                {probabilityPercent !== null && (
                  <p className="rounded-md bg-white px-3 py-1 text-sm font-semibold text-blue-700">
                    Probability: {probabilityPercent}%
                  </p>
                )}
              </div>

              {submittedData && (
                <div className="rounded-md border border-blue-100 bg-white p-3 text-sm text-slate-600">
                  BMI: {submittedData.bmi} | FBS: {submittedData.fbs} | ALT: {submittedData.alt} | AST: {submittedData.ast}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
              {saved
                ? 'Data was saved, but prediction was not returned. Ensure both server.js (port 5000) and ml_api/app.py (port 5001) are running, then submit again.'
                : 'No prediction result yet. Submit values from the Input page to continue.'}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/input')}
              className="rounded-md bg-blue-700 px-6 py-2 font-semibold text-white"
            >
              Back to Input
            </button>
            <button
              onClick={() => navigate('/performance')}
              className="rounded-md border border-blue-700 bg-white px-6 py-2 font-semibold text-blue-700"
            >
              View Model Performance
            </button>
          </div>
        </div>

        <aside className="rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-5">
          <p className="text-sm font-semibold text-slate-700">Contributing Factors</p>
          {factorsToShow.length ? (
            <ul className="mt-3 list-disc space-y-2 rounded-lg border border-dashed border-blue-200 bg-white p-4 pl-8 text-sm text-slate-600">
              {factorsToShow.map((factor) => (
                <li key={factor}>{factor}</li>
              ))}
            </ul>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-blue-200 bg-white p-4 text-sm text-slate-500">
              Contributing factors are unavailable from the current model response.
            </div>
          )}

          <p className="mt-5 text-sm font-semibold text-slate-700">Recommendation</p>
          <div className="mt-3 rounded-lg border border-dashed border-blue-200 bg-white p-4 text-sm text-slate-600">
            {recommendationToShow}
          </div>
        </aside>
      </div>
    </SectionCard>
  )
}
