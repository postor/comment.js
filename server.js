const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')
const { router } = require('./index')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
console.log('before prepare')
app.prepare()
  .then(() => {
    console.log('after prepare')
    const server = express()
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: true }))

    server.use('/commentjs', router({
      mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/commentjs',
    }))

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
