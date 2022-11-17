const express = require('express')
const bodyParser  = require('body-parser')
const path = require('path')
const cors = require('cors')
require('dotenv').config()

const http = require('http');
const { Server } = require("socket.io");
const socketServer = require('./socket-server')

const setupRouter = require('./src/routes')
const db = require('./src/services/db.service')

const app = express()
const port = process.env.PORT || 3000

db.connect()

app.use(cors())

app.use('/static', express.static(path.join(__dirname, '/src/public')))

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// app.use (
//     bodyParser.urlencoded({
//         extended : true,
//     })
// );
// app.use(bodyParser.json())

setupRouter(app)
app.use(( err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message})

    return;
});

const server = http.createServer(app);
const io = new Server(server,{
    cors: {
      origin: [process.env.CLIENT_URL||"http://localhost:3001", "http://localhost:3001"],
      credentials: true
    }
  });
socketServer(io)

server.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
});