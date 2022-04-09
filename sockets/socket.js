const {io} = require('../server');
const { comprobarJWT } = require('../helpers/jwt');
const {usuarioConectado,usuarioDesconnectado, grabarMensaje} = require('../controllers/socket');
const usuario = require('../models/usuario');

io.on('connection',client =>{
  console.log('cliente conectado');

  //traemos nuestro token de usuario
  // console.log(client.handshake.headers['x-token']);
  const [valido,uid]= comprobarJWT(client.handshake.headers['x-token']);
  console.log(valido,uid);
  
  if (!valido){return client.disconnect();}

  //cliente autenticado
  usuarioConectado(uid);

  client.join(uid);

  //escuchamos a nuestro clienteel mesaje-personal
  client.on('mensaje-personal',async(payload)=>{
    console.log(payload);
    await grabarMensaje(payload);
    io.to(payload.para).emit('mensaje-personal',payload);
  });

  console.log('cliente autenticado');

  client.on('disconnect',()=>{

    usuarioDesconnectado(uid);
    console.log('cliente desconectado');
  });
  
  client.on('message',(payload)=>{
    console.log('mensaje!!!', payload);
    
    io.emit('message',{admin:'nevo mensaje'});
  });
})
