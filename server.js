import express from "express"
import cors from "cors"
import mysql from "mysql2"

const app = express()
const MODEL_API_URL = process.env.MODEL_API_URL || "http://127.0.0.1:5001/predict"

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "liver_guard"
})

db.connect(err => {
  if (err) {
    console.log("Database error:", err)
  } else {
    console.log("MySQL Connected")
  }
})

app.post("/saveFeatures", (req, res) => {
  const data = req.body

  console.log("FULL DATA:", data) // optional debug

  const sql = `
    INSERT INTO features
    (age, feet, inches, weight, bmi, fbs, alt, ast, ldl, hdl, triglycerides, cholesterol, diabetes_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  db.query(sql, [
    Number(data.age) || 0,
    Number(data.feet) || 0,
    Number(data.inches) || 0,
    Number(data.weight) || 0,
    Number(data.bmi) || 0,
    Number(data.fbs) || 0,
    Number(data.alt) || 0,
    Number(data.ast) || 0,
    Number(data.ldl) || 0,  // ✅ FIX
    Number(data.hdl) || 0,  // ✅ FIX
    Number(data.triglycerides) || 0,
    Number(data.cholesterol) || 0,
    Number(data.diabetes_status) || 0
  ], async (err, result) => {
    if (err) {
      console.log("SQL ERROR:", err)
      res.json({ success: false })
    } else {
      console.log("INSERT SUCCESS")

      let prediction = null

      const modelPayload = {
        Age: Number(data.age) || 0,
        Height: (Number(data.feet) || 0) * 12 + (Number(data.inches) || 0),
        Weight: Number(data.weight) || 0,
        BMI: Number(data.bmi) || 0,
        FBS: Number(data.fbs) || 0,
        ALT: Number(data.alt) || 0,
        AST: Number(data.ast) || 0,
        LDL: Number(data.ldl) || 0,
        HDL: Number(data.hdl) || 0,
        Triglycerides: Number(data.triglycerides) || 0,
        Cholesterol: Number(data.cholesterol) || 0,
        Diabetes: Number(data.diabetes_status) || 0
      }

      try {
        const modelRes = await fetch(MODEL_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(modelPayload)
        })

        if (modelRes.ok) {
          const modelData = await modelRes.json()
          if (!modelData.error) {
            prediction = modelData
          } else {
            console.log("MODEL API ERROR:", modelData.error)
          }
        } else {
          console.log("MODEL API HTTP ERROR:", modelRes.status)
        }
      } catch (modelErr) {
        console.log("MODEL API CONNECTION ERROR:", modelErr.message)
      }

      res.json({
        success: true,
        prediction
      })
    }
  })
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})