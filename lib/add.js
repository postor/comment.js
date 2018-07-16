const request = require('superagent')

module.exports = (commentjs, topic, data) => {
  request
    .post(`${commentjs}/comment`)
    .query({ topic })
    .send(data)
    .then(r=>r.body)
}