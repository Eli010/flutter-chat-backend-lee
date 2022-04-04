const express = require('express');
const path = require('path');
require('dotenv').config();

//DB config
require('./database/config').dbConnection();
const app = express();

//lectura y parseo del body
app.use(express.json());

//node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
//mensaje del socket
require('./sockets/socket');
//path publico
const publicPath = path.resolve(__dirname,'public');

app.use(express.static(publicPath));

server.listen(process.env.PORT,(err)=>{
  if(err)throw new Error(err);
  console.log('El servidor esta corriendo en le puerto',process.env.PORT);
});

//mis rutas
app.use('/api/login',require('./routes/auth'));