import SectionCard from '../components/SectionCard'
import banner2Img from '../assets/banner2.jpg'

const models = ['Logistic Regression', 'Random Forest', 'XGBoost', 'Stacking Ensemble']
const pipelineSteps = [
  'Feature alignment across heterogeneous datasets',
  'Structural missing value completion using SoftImpute',
  'Class imbalance handling with SMOTE',
  'Training base models + stacking meta-learner',
  'SHAP-based global and patient-level explanations'
]

export default function AboutPage() {
  return (
    <SectionCard title="About" className="w-full">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-100 p-5">
          <h3 className="page-title text-2xl font-semibold text-blue-900">About The Project</h3>
          <p className="mt-2 text-sm text-slate-600">
            Non-Alcoholic Fatty Liver Disease (NAFLD) is rising rapidly and early screening remains difficult in many settings due to
            cost, infrastructure limits, and dependence on invasive or expensive tests.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            LiverGuard addresses this by building an explainable machine learning workflow that uses routine clinical inputs to estimate
            risk, making population-scale pre-screening more practical for real-world healthcare environments.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            The framework combines publicly available NAFLD datasets with locally collected Bangladeshi clinical data so the model
            captures both broad patterns and local population characteristics.
          </p>
          <div className="mt-5 overflow-hidden rounded-lg border border-blue-100 bg-slate-50">
            <div className="aspect-[16/9] w-full">
              <img src={banner2Img} alt="NAFLD illustration" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="font-semibold text-blue-900">Data Fusion</h4>
            <p className="mt-3 text-sm text-slate-600">
              Public NAFLD cohorts and local clinical records are aligned into one shared feature space. Since different cohorts contain
              different variable sets, structural missingness is handled with low-rank matrix completion using SoftImpute.
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="font-semibold text-blue-900">Explainable AI</h4>
            <p className="mt-3 text-sm text-slate-600">
              SHAP-based interpretation is used to provide both global feature importance and patient-level reasoning. This helps clinicians
              understand why a prediction was made, instead of treating the model as a black box.
            </p>
          </article>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-4">
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="page-title text-xl font-semibold text-blue-900">Objective</h3>
          <p className="mt-2 text-sm text-slate-600">
            Deliver a scalable and non-invasive NAFLD risk assessment workflow using routinely available clinical and laboratory indicators.
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="page-title text-xl font-semibold text-blue-900">Workflow</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {pipelineSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
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
          <h3 className="page-title text-xl font-semibold text-blue-900">Key Result</h3>
          <p className="mt-2 text-sm text-slate-600">
            In reported experiments, tree-based and ensemble models outperformed baseline linear models and achieved high discrimination,
            while preserving interpretability through SHAP for both global risk factors and individual predictions.
          </p>
        </article>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="page-title text-xl font-semibold text-blue-900">Why This Matters</h3>
        <p className="mt-2 text-sm text-slate-600">
          The system is intended as a clinical decision-support layer, not a replacement for physicians. It can help prioritize high-risk
          cases for follow-up, reduce unnecessary delay in screening pathways, and improve transparency in ML-assisted healthcare.
        </p>
      </div>
    </SectionCard>
  )
}
