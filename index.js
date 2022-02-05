const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log('User: ' + req.ip)
})

setInterval(() => {
  console.log('Printing')
}, 1000 * 60 * 60)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})