import path from 'path'
import express from 'express'
import fetch from 'node-fetch'

import FoursquareApi from './models/foursquare-api'

const app = module.exports = express()

app.set('port', (process.env.PORT || 3000))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('/me', (req, res) => {
  const api = new FoursquareApi(req.query.token, fetch)
  api.me().then(json => {
    res.json(json)
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`gym-spends listening on port ${app.get('port')}`)
  })
}
