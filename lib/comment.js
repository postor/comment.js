const sse = require('./sse')
const moment = require('moment')
const { ObjectID } = require('mongodb')

module.exports.add = async (db, topic, data) => {
  const collection = await db.collection(topic)
  const r = await collection.insertOne(Object.assign({}, data, {
    _commentTime: moment().unix(),
  }))
  const inserted = r.ops[0]
  sse.send({ topic, add: true, _id: inserted._id }, topic)
  return inserted
}

module.exports.remove = async (db, topic, _id) => {
  const collection = await db.collection(topic)
  const r = await collection.findOneAndDelete({ _id, })
  sse.send({ topic, remove: true, _id }, topic)
}

module.exports.find = async (db, topic, _id) => {
  const collection = await db.collection(topic)
  return await collection.findOne({ _id: ObjectID(_id) })
}

module.exports.update = async (db, topic, _id, to = {}) => {
  const collection = await db.collection(topic)
  const r = await collection.findOneAndUpdate({ _id, }, to)
  sse.send({ topic, update: true, _id, }, topic)
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


module.exports.count = async (db, topic, query) => {
  const collection = await db.collection(topic)
  const r = await collection.count(query)
  return r
}