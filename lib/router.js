const { Router } = require('express')

const sse = require('./sse')
const { add, remove, list, count } = require('./comment')
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
      .then((r) => res.json(r))
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
      .catch(error => res.json({ error, }))
  })

  router.get('/count', (req, res) => {
    let {
      topic,
      query,
    } = req.query

    Promise.resolve()
      .then(() => {
        query = JSON.parse(query)
      })
      .then(() => getDb())
      .then(db => count(db, topic, query))
      .then(total => res.json({ total, }))
      .catch(error => res.json({ error, }))
  })

  router.post('/count', (req, res) => {
    const {
      topic,
    } = req.query

    const query = req.body || {}

    getDb()
      .then(db => count(db, topic, query))
      .then(total => res.json({ total, }))
      .catch(error => res.json({ error, }))
  })
  return router
}