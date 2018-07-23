const sse = require('./sse')
const moment = require('moment')
const getModel = require('./get-model')

module.exports.add = async (topic, data) => {
  const Comment = getModel(topic)
  const comment = new Comment(Object.assign({}, data, {
    _commentTime: moment().unix(),
  }))
  await comment.save()
  sse.send({ topic, add: true, _id: comment._id }, topic)
  return comment
}

module.exports.remove = async (topic, _id) => {
  const Comment = getModel(topic)
  await Comment.deleteOne({ _id, })
  sse.send({ topic, remove: true, _id }, topic)
}

module.exports.find = async (topic, _id) => {
  const Comment = getModel(topic)
  return await Comment.findById(_id)
}

module.exports.update = async (topic, _id, to = {}) => {
  const Comment = getModel(topic)
  const comment = await Comment.findById(_id)
  await comment.update(to)
  sse.send({ topic, update: true, _id, }, topic)
}

module.exports.list = async (topic, {
  skip = 0,
  limit = 10,
  before = false,
  after = false,
}) => {
  let timeQuery = {}
  if (before) {
    timeQuery.$lt = parseInt(before)
  }
  if (after) {
    timeQuery.$gt = parseInt(after)
  }

  const Comment = getModel(topic)

  return await Comment.find(Object.keys(timeQuery).length ? {
    _commentTime: timeQuery,
  } : {}, null, {
      skip: parseInt(skip),
      limit: parseInt(limit),
      sort: { _commentTime: -1 }
    })
}


module.exports.count = async (topic, query) => {
  const Comment = getModel(topic)
  const r = await Comment.countDocuments(query)
  return r
}