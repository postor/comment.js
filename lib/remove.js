const request = require('superagent')

module.exports = (commentapi, topic, _id) => {
  return request
    .delete(`${commentapi}/comment`)
    .query({ topic })
    .send({ _id })
    .then(r => r.body)
}