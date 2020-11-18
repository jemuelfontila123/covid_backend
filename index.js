const app = require('./app')
const http = require('http')
const config = require('./services/config')
const server = http.createServer(app)

server.listen(config.PORT, () => {
    console.log('The server is running')
})