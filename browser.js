module.exports.request = require('./lib/request')

let eventSources = {}
module.exports.getSse = (commentapi) => {
  if (typeof EventSource == 'undefined') {
    return
  }
  if (eventSources[commentapi]) {
    return eventSources[commentapi]
  }

  eventSources[commentapi] = new EventSource(`${commentapi}/sse`)
  return eventSources[commentapi]
}