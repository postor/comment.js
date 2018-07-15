const { Router } = require('express')
const MongoClient = require('mongodb').MongoClient

const sse = require('./sse')
const { add, remove, list } = require('./comment')

module.exports = (config) => {
  const { mongodbUri } = config || {}
  if (!mongodbUri) throw 'mongodbUri in config is needed!'

  const dbPromise = MongoClient.connect(mongodbUri,{
    useNewUrlParser: true,
  })
    .then((conn) => conn.db('comment'))
    .catch(error=>{
      console.log({
        error,
        mongodbUri,
      })
    })

  const router = new Router()
  router.use('/sse', sse.init)

  router.post('/comment', (req, res) => {
    const { topic } = req.body
    dbPromise.then((db) => {
      return add(db, topic, req.body)
    }).then(() => {
      res.json({ error: 0 })
    }).catch((error) => {
      res.json({ error })
    })
  })

  router.delete('/comment', (req, res) => {
    const { topic, _id } = req.body
    dbPromise.then((db) => {
      return remove(db, topic, _id)
    }).then(() => {
      res.json({ error: 0 })
    })
  })

  router.get('/comment', (req, res) => {
    const { skip, limit, topic } = req.query
    list(db, topic,skip,limit).then((comments)=>{
      res.json({
        comments,
      })
    }).catch(error=>{
      res.json({
        error,
      })
    })
  })

  return router
}