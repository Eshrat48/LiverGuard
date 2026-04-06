import { useState } from "react"
import { useNavigate } from "react-router-dom"
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

const normalRanges = {
  bmi: "Normal: 18.5-24.9 kg/m2",
  fbs: "Normal: 70-99 mg/dL (fasting)",
  alt: "Normal: 7-56 U/L",
  ast: "Normal: 10-40 U/L",
  ldl: "Optimal: <100 mg/dL",
  hdl: "Normal: >=40 mg/dL (men), >=50 mg/dL (women)",
  triglycerides: "Normal: <150 mg/dL",
  cholesterol: "Normal: <200 mg/dL",
  diabetes_status: "Use: 1 = yes, 0 = no"
}

export default function PredictionInputPage() {
  const navigate = useNavigate()

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

  const [touched, setTouched] = useState({})

  const isFieldFilled = (value) => value !== ""

  const isFormValid = fields.every((field) => isFieldFilled(formData[field.name]))
  const ageField = fields.find((field) => field.name === "age")
  const weightField = fields.find((field) => field.name === "weight")
  const remainingFields = fields.filter(
    (field) =>
      field.name !== "age" &&
      field.name !== "weight" &&
      field.name !== "feet" &&
      field.name !== "inches"
  )

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "diabetes_status" && value !== "" && value !== "0" && value !== "1") {
      return
    }

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
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleSubmit = async () => {
    if (!isFormValid) {
      const allTouched = fields.reduce((acc, field) => {
        acc[field.name] = true
        return acc
      }, {})

      setTouched(allTouched)
      return
    }

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
        navigate("/result", {
          state: {
            saved: true,
            prediction: data.prediction || null,
            submittedData: formattedData
          }
        })
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
            {ageField && (
              <label key={ageField.name} className="space-y-1 text-sm">
                <span className="font-semibold text-slate-600">
                  {ageField.label} <span className="text-red-600">*</span>
                </span>

                <input
                  type={ageField.readOnly ? "text" : "number"}
                  name={ageField.name}
                  value={formData[ageField.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={ageField.readOnly}
                  required
                  placeholder={`Enter ${ageField.label.toLowerCase()}`}
                  className={`w-full rounded border bg-white px-3 py-2 text-slate-700 outline-none focus:border-blue-400 ${
                    touched[ageField.name] && !isFieldFilled(formData[ageField.name])
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                />

                {touched[ageField.name] && !isFieldFilled(formData[ageField.name]) && (
                  <p className="text-xs text-red-600">{ageField.label} is required.</p>
                )}
              </label>
            )}

            {weightField && (
              <label key={weightField.name} className="space-y-1 text-sm">
                <span className="font-semibold text-slate-600">
                  {weightField.label} <span className="text-red-600">*</span>
                </span>

                <input
                  type={weightField.readOnly ? "text" : "number"}
                  name={weightField.name}
                  value={formData[weightField.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={weightField.readOnly}
                  required
                  placeholder={`Enter ${weightField.label.toLowerCase()}`}
                  className={`w-full rounded border bg-white px-3 py-2 text-slate-700 outline-none focus:border-blue-400 ${
                    touched[weightField.name] && !isFieldFilled(formData[weightField.name])
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                />

                {touched[weightField.name] && !isFieldFilled(formData[weightField.name]) && (
                  <p className="text-xs text-red-600">{weightField.label} is required.</p>
                )}
              </label>
            )}

            <div className="space-y-2 sm:col-span-2">
              <span className="text-sm font-semibold text-slate-600">
                Height <span className="text-red-600">*</span>
              </span>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span className="font-semibold text-slate-600">Feets</span>
                  <input
                    type="number"
                    name="feet"
                    value={formData.feet}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="Enter feets"
                    className={`w-full rounded border bg-white px-3 py-2 text-slate-700 outline-none focus:border-blue-400 ${
                      touched.feet && !isFieldFilled(formData.feet)
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />
                  {touched.feet && !isFieldFilled(formData.feet) && (
                    <p className="text-xs text-red-600">Feets is required.</p>
                  )}
                </label>

                <label className="space-y-1 text-sm">
                  <span className="font-semibold text-slate-600">Inches</span>
                  <input
                    type="number"
                    name="inches"
                    value={formData.inches}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="Enter inches"
                    className={`w-full rounded border bg-white px-3 py-2 text-slate-700 outline-none focus:border-blue-400 ${
                      touched.inches && !isFieldFilled(formData.inches)
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />
                  {touched.inches && !isFieldFilled(formData.inches) && (
                    <p className="text-xs text-red-600">Inches is required.</p>
                  )}
                </label>
              </div>
            </div>

            {remainingFields.map((field) => (
              <label key={field.name} className="space-y-1 text-sm">
                <span className="font-semibold text-slate-600">
                  {field.label} <span className="text-red-600">*</span>
                </span>

                {normalRanges[field.name] && (
                  <p className="text-xs text-slate-500">{normalRanges[field.name]}</p>
                )}

                {field.name === "diabetes_status" ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full rounded border bg-white px-3 py-2 outline-none focus:border-blue-400 ${
                      formData[field.name] === "" ? "text-slate-400" : "text-slate-700"
                    } ${
                      touched[field.name] && !isFieldFilled(formData[field.name])
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  >
                    <option value="">Select Diabetes Status</option>
                    <option value="0">0 = No</option>
                    <option value="1">1 = Yes</option>
                  </select>
                ) : (
                  <input
                    type={field.readOnly ? "text" : "number"}  // ✅ use number for inputs
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly={field.readOnly}
                    required
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className={`w-full rounded border bg-white px-3 py-2 text-slate-700 outline-none focus:border-blue-400 ${
                      touched[field.name] && !isFieldFilled(formData[field.name])
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />
                )}

                {touched[field.name] && !isFieldFilled(formData[field.name]) && (
                  <p className="text-xs text-red-600">{field.label} is required.</p>
                )}
              </label>
            ))}
          </div>

          {!isFormValid && (
            <p className="mt-4 text-sm text-red-600">
              Please fill all required fields before prediction.
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`mt-5 w-full rounded-md py-2 font-semibold text-white ${
              isFormValid
                ? "bg-blue-700 hover:bg-blue-800"
                : "cursor-not-allowed bg-blue-300"
            }`}
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