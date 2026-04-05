import express from "express"
import cors from "cors"
import mysql from "mysql2"

const app = express()

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
  ], (err, result) => {
    if (err) {
      console.log("SQL ERROR:", err)
      res.json({ success: false })
    } else {
      console.log("INSERT SUCCESS")
      res.json({ success: true })
    }
  })
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})