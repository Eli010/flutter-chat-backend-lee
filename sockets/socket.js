const {io} = require('../server');

io.on('connection',client =>{
  console.log('cliente conectado');

  client.on('disconnect',()=>{
    console.log('cliente desconectado');
  });
  
  client.on('message',(payload)=>{
    console.log('mensaje!!!', payload);
    
    io.emit('message',{admin:'nevo mensaje'});
  });
})
