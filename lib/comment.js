const sse = require('./sse')

module.exports.add = async (db, topic, data) => {
  const collection = await db.collection(topic)
  const r = await collection.insertOne(Object.assign({}, data, {
    _commentTime: new Date(),
  }))
  sse.send({ topic }, 'comment')
}

module.exports.remove = async (db, topic, _id) => {
  const collection = await db.collection(topic)
  const r = await collection.findOneAndDelete({ _id, })
  sse.send({ topic }, 'comment')
}

module.exports.list = async (db, topic, skip = 0, limit = 10) => {
  const collection = await db.collection(topic)
  return await collection.find({})
    .skip(skip)
    .limit(limit)
    .addQueryModifier('$orderby', { _commentTime: -1 })
    .toArray()
}