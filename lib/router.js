const { Router } = require('express')

const sse = require('./sse')
const { add, remove, list, find, count } = require('./comment')
const { init, getDb } = require('./conn')

module.exports = (config) => {
  const { mongodbUri } = config || {}
  if (!mongodbUri) throw 'mongodbUri in config is needed!'
  init(mongodbUri)

  const router = new Router()

  //sse
  router.use('/sse', sse.init)

  //add
  router.post('/comment/:topic', (req, res) => {
    const { topic } = req.params
    getDb()
      .then((db) => add(db, topic, req.body))
      .then((comment) => res.json({ comment }))
      .catch(error => res.json({ error, }))
  })

  //delete
  router.delete('/comment/:topic/:_id', (req, res) => {
    const { topic, _id } = req.params
    getDb()
      .then(db => remove(db, topic, _id))
      .then(() => res.json({ error: 0 }))
      .catch(error => res.json({ error, }))
  })

  //patch
  router.patch('/comment/:topic/:_id', (req, res) => {
    if (!req.body) {
      res.json({ error: 'not pathing anything!' })
      return
    }
    const { topic, _id } = req.params
    getDb()
      .then(db => patch(db, topic, _id, req.body))
      .then(() => res.json({ error: 0 }))
      .catch(error => res.json({ error, }))
  })

  //list comments
  router.get('/comment/:topic', (req, res) => {
    const { topic, } = req.params
    const { limit = 10, } = req.query
    getDb()
      .then((db) => list(db, topic, Object.assign({}, req.query, {
        limit,
      })))
      .then((comments) => res.json({
        comments,
      }))
      .catch(error => res.json({ error, }))
  })

  //find one by id
  router.get('/comment/:topic/:_id', (req, res) => {
    let {
      topic,
      _id,
    } = req.params

    getDb()
      .then((db) => find(db, topic, _id))
      .then((comment) => {
        res.json({
          comment,
        })
      })
      .catch(error => {
        res.json({ error, })
      })
  })

  //count
  router.get('/count/:topic', (req, res) => {
    const { topic, } = req.params
    const query = req.query || {}

    Promise.resolve()
      .then(() => {
        query = JSON.parse(query)
      })
      .then(() => getDb())
      .then(db => count(db, topic, query))
      .then(total => res.json({ total, }))
      .catch(error => res.json({ error, }))
  })

  //count complex
  router.post('/count/:topic', (req, res) => {
    const { topic, } = req.params
    const query = req.body || {}

    getDb()
      .then(db => count(db, topic, query))
      .then(total => res.json({ total, }))
      .catch(error => res.json({ error, }))
  })
  return router
}