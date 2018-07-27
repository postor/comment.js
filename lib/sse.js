let clientId = 0
let clients = {} // <- Keep a map of attached clients

module.exports.route = function (req, res) {
  req.socket.setTimeout(Number.MAX_VALUE);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream', // <- Important headers
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');
  (function (clientId) {
    clients[clientId] = res; // <- Add this client to those we consider "attached"
    req.on("close", function () {
      delete clients[clientId]
    }); // <- Remove this client when he disconnects
  })(++clientId)
}

module.exports.send = function (data, event) {
  for (clientId in clients) {
    const res = clients[clientId]
    if (event) {
      res.write(`event: ${event}\n`)
    }
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }
}