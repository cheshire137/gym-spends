const path = require('path')
const express = require('express')
const fetch = require('node-fetch')

const FoursquareApi = require('./models/foursquare-api')

const app = module.exports = express()

app.set('port', (process.env.PORT || 3000))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('/me', (req, res) => {
  const api = new FoursquareApi(req.query.token, fetch)
  api.me().then(json => res.json(json.response.user)).
    catch(err => {
      console.log('oh no', err)
      res.json({ error: err })
    })
})

app.get('/checkins', (req, res) => {
  const api = new FoursquareApi(req.query.token, fetch)
  api.checkins().then(json => res.json(json.response.checkins)).
    catch(err => {
      console.log('oh no checkins', err)
      res.json({ error: err })
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
