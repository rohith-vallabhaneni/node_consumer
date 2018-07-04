const server = require('./consumer.js').server
const PORT = process.env.DRP_CF_HTTP_PORT || 8080
const ADDRESS = process.env.DRP_CF_HTTP_ADDR || "0.0.0.0"

server.listen(PORT, ADDRESS, () => {
  console.log('User Service listening on http://localhost:'+ PORT)
})
