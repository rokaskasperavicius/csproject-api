import express from 'express'

const app = express.Router()

app.get('/', (req, res) => {
  res.download('public/DDL.sql')
})

export default app
