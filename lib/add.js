const request = require('superagent')

module.exports = (commentapi, topic, data) => {
  return request
    .post(`${commentapi}/comment`)
    .query({ topic })
    .send(data)
    .then(r=>r.body)
}