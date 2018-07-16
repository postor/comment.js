const { MongoClient } = require('mongodb')

let clientPromise, client

module.exports.init = (url) => {
  clientPromise = MongoClient.connect(url, { useNewUrlParser: true })
}

module.exports.getDb = () => {
  if (client) {
    return client.db()
  }
  return clientPromise.then((client) => client.db())
}

