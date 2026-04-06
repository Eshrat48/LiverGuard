import SectionCard from '../components/SectionCard'
import { useEffect, useState } from 'react'

export default function PerformancePage() {
  const [apiStatus, setApiStatus] = useState('Checking model API...')
  const [modelMessage, setModelMessage] = useState('Loading performance details...')
  const [topFeatures, setTopFeatures] = useState([])
  const [modelInfo, setModelInfo] = useState(null)
  const [artifactLoaded, setArtifactLoaded] = useState(false)
  const [metrics, setMetrics] = useState([
    { label: 'Accuracy', value: 'Unavailable' },
    { label: 'Precision', value: 'Unavailable' },
    { label: 'Recall', value: 'Unavailable' },
    { label: 'F1-Score', value: 'Unavailable' }
  ])
  const [confusion, setConfusion] = useState({ tp: '-', fp: '-', fn: '-', tn: '-' })

  useEffect(() => {
    let mounted = true

    fetch('http://127.0.0.1:5001/performance')
      .then(async (res) => {
        if (!mounted) return

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
        setModelInfo(data.modelInfo || null)
      })
      .catch(() => {
        if (!mounted) return
        setApiStatus('Model API is not reachable. Start ml_api/app.py to enable prediction service.')
        setModelMessage('Performance data unavailable while API is offline.')
      })

    return () => {
      mounted = false
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
                Real validation metrics are not loaded. Add performance_metrics.json to ml_api/Models.
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

          {modelInfo && (
            <div className="mt-6 rounded border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-700">Model Details</p>
              <p className="mt-2">Version: {modelInfo.modelVersion || 'Not provided'}</p>
              <p>Last Trained: {modelInfo.lastTrained || 'Not provided'}</p>
              <p>Dataset: {modelInfo.dataset || 'Not provided'}</p>
              <p>Feature Count: {modelInfo.featureCount ?? 'Not available'}</p>
            </div>
          )}
        </div>

        <aside className="rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-5">
          <h4 className="font-semibold text-blue-900">Backend Integration Status</h4>
          <p className="mt-2 text-sm text-slate-600">This panel can show model version, last trained date, and API response health.</p>
          <div className="mt-4 rounded-lg border border-dashed border-blue-200 bg-white p-4 text-sm text-slate-500">
            {apiStatus}
          </div>
        </aside>
      </div>
    </SectionCard>
  )
}
