const { Router } = require('express')

const sse = require('./sse')
const { add, remove, list } = require('./comment')
const { init, getDb } = require('./conn')

module.exports = (config) => {
  const { mongodbUri } = config || {}
  if (!mongodbUri) throw 'mongodbUri in config is needed!'
  init(mongodbUri)

  const router = new Router()
  router.use('/sse', sse.init)

  router.post('/comment', (req, res) => {
    const { topic } = req.query
    getDb()
      .then((db) => add(db, topic, req.body))
      .then((r) => res.json(Object.assign({ error: 0 }, r)))
      .catch(error => res.json({ error, }))
  })

  router.delete('/comment', (req, res) => {
    const { topic } = req.query
    const { _id } = req.body
    getDb()
      .then(db => remove(db, topic, _id))
      .then(() => res.json({ error: 0 }))
      .catch(error => res.json({ error, }))
  })

  router.get('/comment', (req, res) => {
    let {
      topic,
      limit = 10,
    } = req.query

    getDb()
      .then((db) => list(db, topic, Object.assign({}, req.query, {
        limit,
      })))
      .then((comments) => res.json({
        comments,
        done: comments.length < limit,
      }))
      .catch(error => {
        res.json({
          error,
        })
      })
  })

  return router
}