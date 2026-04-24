import SectionCard from '../components/SectionCard'
import { useEffect, useState } from 'react'

const defaultMetrics = [
  { label: 'Accuracy', value: 'Unavailable' },
  { label: 'Precision', value: 'Unavailable' },
  { label: 'Recall', value: 'Unavailable' },
  { label: 'F1-Score', value: 'Unavailable' }
]

const defaultConfusion = { tp: '-', fp: '-', fn: '-', tn: '-' }

export default function PerformancePage() {
  const [apiStatus, setApiStatus] = useState('Checking model API...')
  const [modelMessage, setModelMessage] = useState('Loading performance details...')
  const [topFeatures, setTopFeatures] = useState([])
  const [ensembleFields, setEnsembleFields] = useState([])
  const [inputFields, setInputFields] = useState([])
  const [modelInfo, setModelInfo] = useState(null)
  const [artifactLoaded, setArtifactLoaded] = useState(false)
  const [metrics, setMetrics] = useState(defaultMetrics)
  const [confusion, setConfusion] = useState(defaultConfusion)

  const clearPerformanceView = () => {
    setApiStatus('Performance view cleared. Load data when needed.')
    setModelMessage('No performance data loaded.')
    setTopFeatures([])
    setEnsembleFields([])
    setInputFields([])
    setModelInfo(null)
    setArtifactLoaded(false)
    setMetrics(defaultMetrics)
    setConfusion(defaultConfusion)
  }

  const loadPerformance = (mountedRef) => {
    setApiStatus('Checking model API...')
    setModelMessage('Loading performance details...')

    fetch('http://127.0.0.1:5001/performance')
      .then(async (res) => {
        if (!mountedRef.current) return

        if (!res.ok) {
          setApiStatus('Model API responded with an error status.')
          setModelMessage('Could not load model performance details.')
          return
        }

        const data = await res.json()
        if (data.error) {
          setApiStatus('Model API is reachable but returned an error.')
          setModelMessage(data.error)
          return
        }

        setApiStatus('Model API is running and reachable.')
        setModelMessage(data.message || 'Model performance details loaded.')
        setArtifactLoaded(Boolean(data.artifactLoaded))

        const formatMetric = (value) => {
          if (typeof value !== 'number') return 'Unavailable'
          if (value <= 1) return `${(value * 100).toFixed(2)}%`
          return `${value.toFixed(2)}%`
        }

        const m = data.metrics || {}
        setMetrics([
          { label: 'Accuracy', value: formatMetric(m.accuracy) },
          { label: 'Precision', value: formatMetric(m.precision) },
          { label: 'Recall', value: formatMetric(m.recall) },
          { label: 'F1-Score', value: formatMetric(m.f1Score) }
        ])

        const cm = data.confusionMatrix || {}
        setConfusion({
          tp: cm.tp ?? '-',
          fp: cm.fp ?? '-',
          fn: cm.fn ?? '-',
          tn: cm.tn ?? '-'
        })

        setTopFeatures(data.modelInfo?.topFeatures || [])
        setEnsembleFields(data.modelInfo?.ensembleFields || [])
        setInputFields(data.modelInfo?.inputFields || [])
        setModelInfo(data.modelInfo || null)
      })
      .catch(() => {
        if (!mountedRef.current) return
        setApiStatus('Model API is not reachable. Start ml_api/app.py to enable prediction service.')
        setModelMessage('Performance data unavailable while API is offline.')
      })
  }

  useEffect(() => {
    const mountedRef = { current: true }
    loadPerformance(mountedRef)

    return () => {
      mountedRef.current = false
    }
  }, [])

  return (
    <SectionCard title="Model Performance" className="w-full">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <p className="font-semibold text-slate-700">Evaluation Metrics</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {metrics.map((item) => (
              <div key={item.label} className="rounded border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-600">{item.label}</p>
                <p className="mt-1 text-sm text-blue-800">{item.value}</p>
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
              <div className="bg-emerald-100 p-2 font-semibold">{confusion.tp}</div>
              <div className="bg-slate-100 p-2 font-semibold">{confusion.fp}</div>
              <div className="bg-blue-500 p-2 font-semibold text-white">Actual</div>
              <div className="bg-emerald-200 p-2 font-semibold">{confusion.fn}</div>
              <div className="bg-slate-100 p-2 font-semibold">{confusion.tn}</div>
            </div>
            <p className="mt-3 text-xs text-slate-500">{modelMessage}</p>
            {!artifactLoaded && (
              <p className="mt-2 text-xs font-semibold text-amber-700">
                Real validation metrics are not loaded. Add/update performance_metrics.example.json in ml_api/Models.
              </p>
            )}
          </div>

          <div className="mt-6 rounded border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-700">Top Influential Features (Model-Based)</p>
            {topFeatures.length ? (
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {topFeatures.map((item) => (
                  <li key={item.feature} className="rounded bg-blue-50 px-3 py-2">
                    <span className="font-semibold text-blue-900">{item.feature}</span>
                    <span className="ml-2 text-slate-600">Importance: {item.importance.toFixed(3)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No feature influence data available.</p>
            )}
          </div>

          <div className="mt-6 rounded border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-700">Ensemble Meta-Model Signals</p>
            <p className="mt-1 text-xs text-slate-500">
              Weights learned by the stacking model from base-model probabilities.
            </p>
            {ensembleFields.length ? (
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {ensembleFields.map((item) => (
                  <li key={item.signal} className="rounded bg-emerald-50 px-3 py-2">
                    <span className="font-semibold text-emerald-900">{item.signal}</span>
                    <span className="ml-2 text-slate-600">
                      Weight: {typeof item.weight === 'number' ? item.weight.toFixed(4) : 'Unavailable'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No ensemble signal weights available.</p>
            )}
          </div>

          <div className="mt-6 rounded border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-700">Input Fields Used By Model</p>
            {inputFields.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {inputFields.map((field) => (
                  <span
                    key={field}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900"
                  >
                    {field}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No input field metadata available.</p>
            )}
          </div>

          {modelInfo && (
            <div className="mt-6 rounded border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-700">Model Details</p>
              <p className="mt-2">Version: {modelInfo.modelVersion || 'Not provided'}</p>
              <p>Last Trained: {modelInfo.lastTrained || 'Not provided'}</p>
              <p>Dataset: {modelInfo.dataset || 'Not provided'}</p>
              <p>Feature Count: {modelInfo.featureCount ?? 'Not available'}</p>
              <p>
                Ensemble Intercept:{' '}
                {typeof modelInfo.ensembleIntercept === 'number'
                  ? modelInfo.ensembleIntercept.toFixed(4)
                  : 'Not available'}
              </p>
            </div>
          )}
        </div>

        <aside className="rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-5">
          <h4 className="font-semibold text-blue-900">Backend Integration Status</h4>
          <p className="mt-2 text-sm text-slate-600">This panel can show model version, last trained date, and API response health.</p>
          <div className="mt-4 rounded-lg border border-dashed border-blue-200 bg-white p-4 text-sm text-slate-500">
            {apiStatus}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => loadPerformance({ current: true })}
              className="rounded-md border border-blue-700 bg-white px-4 py-2 text-sm font-semibold text-blue-700"
            >
              Reload Performance
            </button>
            <button
              onClick={clearPerformanceView}
              className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
            >
              Clear Performance View
            </button>
          </div>
        </aside>
      </div>
    </SectionCard>
  )
}
