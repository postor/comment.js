const { Router } = require('express')
const mongoose = require('mongoose')

const sse = require('./sse')
const { add, remove, list, find, count } = require('./comment')


module.exports = (config) => {
  const { mongodbUri } = config || {}
  if (!mongodbUri) throw 'mongodbUri in config is needed!'
  mongoose.connect(mongodbUri, { useNewUrlParser: true })

  const router = new Router()

  //sse
  router.use('/sse', sse.init)

  //add
  router.post('/comment/:topic', (req, res) => {
    const { topic } = req.params
    add(topic, req.body)
      .then((comment) => res.json({ comment }))
      .catch(error => res.json({ error, }))
  })

  //delete
  router.delete('/comment/:topic/:_id', (req, res) => {
    const { topic, _id } = req.params
    remove(topic, _id)
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
    patch(topic, _id, req.body)
      .then(() => res.json({ error: 0 }))
      .catch(error => res.json({ error, }))
  })

  //list comments
  router.get('/comment/:topic', (req, res) => {
    const { topic, } = req.params
    const { limit = 10, } = req.query
    list(topic, Object.assign({}, req.query, {
      limit,
    }))
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

    find(topic, _id)
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

    count(topic, query)
      .then(total => res.json({ total, }))
      .catch(error => res.json({ error, }))
  })

  //count complex
  router.post('/count/:topic', (req, res) => {
    const { topic, } = req.params
    const query = req.body || {}

    count(topic, query)
      .then(total => res.json({ total, }))
      .catch(error => res.json({ error, }))
  })
  return router
}