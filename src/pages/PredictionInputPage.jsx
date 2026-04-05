import { useState } from "react"
import SectionCard from '../components/SectionCard'

const fields = [
  { label: 'Age', name: 'age' },
  { label: 'Feets', name: 'feet' },
  { label: 'Inches', name: 'inches' },
  { label: 'Weights', name: 'weight' },
  { label: 'BMI', name: 'bmi', readOnly: true },
  { label: 'FBS', name: 'fbs' },
  { label: 'ALT', name: 'alt' },
  { label: 'AST', name: 'ast' },
  { label: 'LDL', name: 'ldl' },
  { label: 'HDL', name: 'hdl' },
  { label: 'Triglycerides', name: 'triglycerides' },
  { label: 'Cholesterol', name: 'cholesterol' },
  { label: 'Diabetes status', name: 'diabetes_status' }
]

export default function PredictionInputPage() {

  const [formData, setFormData] = useState({
    age: "",
    feet: "",
    inches: "",
    weight: "",
    bmi: "",
    fbs: "",
    alt: "",
    ast: "",
    ldl: "",
    hdl: "",
    triglycerides: "",
    cholesterol: "",
    diabetes_status: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    let updated = { ...formData, [name]: value }

    // BMI auto calculation
    if (name === "feet" || name === "inches" || name === "weight") {
      const height = (updated.feet * 12 + parseFloat(updated.inches || 0)) * 0.0254
      const weight = parseFloat(updated.weight)

      if (height > 0 && weight > 0) {
        updated.bmi = (weight / (height * height)).toFixed(2)
      }
    }

    setFormData(updated)
  }

  const handleSubmit = async () => {
    try {
      // Convert all numeric fields to numbers before sending
      const formattedData = {
        ...formData,
        age: Number(formData.age),
        feet: Number(formData.feet),
        inches: Number(formData.inches),
        weight: Number(formData.weight),
        bmi: Number(formData.bmi),
        fbs: Number(formData.fbs),
        alt: Number(formData.alt),
        ast: Number(formData.ast),
        ldl: Number(formData.ldl),
        hdl: Number(formData.hdl),
        triglycerides: Number(formData.triglycerides),
        cholesterol: Number(formData.cholesterol),
        diabetes_status: Number(formData.diabetes_status)
      }

      const res = await fetch("http://localhost:5000/saveFeatures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedData)
      })

      const data = await res.json()

      if (data.success) {
        alert("Data saved successfully!")
      } else {
        alert("Error saving data")
      }

    } catch (err) {
      console.log(err)
      alert("Server error")
    }
  }

  return (
    <SectionCard title="Prediction Input" className="w-full">
      <div className="grid gap-6 lg:grid-cols-2">

        {/* LEFT FORM */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="page-title text-xl font-semibold text-blue-900">
            Enter Patient Details
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            These values will be sent to the backend prediction model.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.name} className="space-y-1 text-sm">
                <span className="font-semibold text-slate-600">
                  {field.label}
                </span>

                <input
                  type={field.readOnly ? "text" : "number"}  // ✅ use number for inputs
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  readOnly={field.readOnly}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none focus:border-blue-400"
                />
              </label>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-5 w-full rounded-md bg-blue-700 py-2 font-semibold text-white hover:bg-blue-800"
          >
            Predict
          </button>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 via-sky-50 to-white p-5">
          <h3 className="page-title text-xl font-semibold text-blue-900">
            Model Request Preview
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            Live form data preview (what will be sent to backend)
          </p>

          <div className="mt-5 rounded-lg border border-dashed border-blue-200 bg-white/70 p-4 text-sm text-slate-700">
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            This shows real-time data being prepared for prediction.
          </p>
        </div>

      </div>
    </SectionCard>
  )
}