const express = require('express')
const { router } = require('local-comment')
const ssePort = parseInt(process.env.PORT, 10) || 3001

const sse = express()
sse.use('/commentapi', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', '*')
  
  next()
}, router({
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/commentapi',
}))
sse.listen(ssePort, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${ssePort}`)
})