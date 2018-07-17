const request = require('superagent')

module.exports = (commentjs, topic, _id) => {
  return request
    .delete(`${commentjs}/comment`)
    .query({ topic })
    .send({ _id })
    .then(r => r.body)
}