const request = require('superagent')

module.exports = (commentjs, topic, data) => {
  return request
    .post(`${commentjs}/comment`)
    .query({ topic })
    .send(data)
    .then(r=>r.body)
}