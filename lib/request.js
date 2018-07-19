const request = require('superagent')

module.exports.add = (commentapi, topic, data) => {
  const req = request
    .post(`${commentapi}/comment/${topic}`)

  return [
    () => req.abort(),
    req.send(data)
      .then(r => r.body)
      .then(errorFieldDetect)
  ]
}

module.exports.list = (commentapi, topic, options = {}) => {
  const req = request
    .get(`${commentapi}/comment/${topic}`)

  return [
    () => req.abort(),
    req.query(options)
      .then(r => r.body)      
      .then(errorFieldDetect)
      .then(result=>result.comments)

  ]
}

module.exports.find = (commentapi, topic, _id) => {
  const req = request
    .get(`${commentapi}/comment/${topic}/${_id}`)
  return [
    () => req.abort(),
    req
    .then(r => r.body)
    .then(errorFieldDetect)
    .then(result=>result.comment)
  ]
}

module.exports.remove = (commentapi, topic, _id) => {
  const req = request
    .delete(`${commentapi}/comment/${topic}/${_id}`)
  return [
    () => req.abort(),
    req
      .then(r => r.body)
      .then(errorFieldDetect)
  ]
}

module.exports.patch = (commentapi, topic, _id, options) => {
  const req = request
    .patch(`${commentapi}/comment/${topic}/${_id}`)
  return [
    () => req.abort(),
    req
      .send(options)
      .then(r => r.body)
      .then(errorFieldDetect)
  ]
}

module.exports.count = (commentapi, topic, options) => {
  const req = request
    .post(`${commentapi}/count/${topic}`)
  return [
    () => req.abort(),
    req
      .send(options)
      .then(r => r.body)
      .then(errorFieldDetect)
      .then(result => result.total)
  ]
}

function errorFieldDetect(result) {
  if (result.error) {
    return Promise.reject(error)
  }
  return result
}