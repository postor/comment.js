
const mongoose = require('mongoose')

const models = {}

const getSchema = (topic) => {
  return mongoose.Schema({
    content: String,
    _commentTime: Number,
  }, {
      id: false,
      _id: true,
      strict: false,
      collection: topic,
    })
}

module.exports = (topic) => {
  if (models[topic]) {
    return models[topic]
  }

  const schema = getSchema(topic)
  models[topic] = mongoose.model('Comment', schema)
  return models[topic]
}
