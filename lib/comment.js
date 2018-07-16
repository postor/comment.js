const sse = require('./sse')
const moment = require('moment')

module.exports.add = async (db, topic, data) => {
  const collection = await db.collection(topic)
  const r = await collection.insertOne(Object.assign({}, data, {
    _commentTime: moment().unix(),
  }))
  sse.send({ topic }, topic)
  return Object.assign({})
}

module.exports.remove = async (db, topic, _id) => {
  const collection = await db.collection(topic)
  const r = await collection.findOneAndDelete({ _id, })
  sse.send({ topic }, topic)
}

module.exports.list = async (db, topic, {
  skip = 0,
  limit = 10,
  before = false,
  after = false,
}) => {
  const collection = await db.collection(topic)
  let timeQuery = {}
  if (before) {
    timeQuery.$lt = parseInt(before)
  }
  if (after) {
    timeQuery.$gt = parseInt(after)
  }

  return await collection.find(Object.keys(timeQuery).length ? {
    _commentTime: timeQuery,
  } : {})
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .addQueryModifier('$orderby', { _commentTime: -1 })
    .toArray()
}