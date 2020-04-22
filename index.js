const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const { totalmem, freemem, arch, cpus, platform } = require('os')

const fs = require('fs')
const path = require('path')

const url = new URL('http://127.0.0.1:8081/')

app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
    if (err) {
      res.writeHead(500)
      throw err
    }
    res.writeHead(200)
    res.end(data)
  })
})

io.on('connection', (socket) => {
  console.log('A user connected')
  socket.on('disconnect', () => {
    setInterval(() => {
      var total = parseInt(totalmem()/Math.pow(1024, 2))
      var free = parseInt(freemem()/Math.pow(1024, 2))
      var percent = `${parseInt(free/total*100)}%`

      var stats = {
        platform: platform(),
        cpus: cpus()[0].model,
        arch: arch(),
        total: `${total}MB`,
        free: `${free}MB`,
        percent
      }

      io.emit('content', stats)
    }, 1000)
  })
})

http.listen(url.port, () => {
  console.log(`Running on ${url.href}`)
})