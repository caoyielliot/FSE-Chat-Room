var express= require ('express');
var app = express();
var path = require('path');
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
var redis=require('redis');
var redisclient=redis.createClient('6379','127.0.0.1');

 // redisclient.on("error", function(error) {
 //     console.log(error);
 // });


var reply=[];

var storeMessage=function(name,msg,color){
var message=JSON.stringify({name:name,msg:msg,color:color});
redisclient.lpush("mylist",message);
}





// var parse=function(){

//   var message;
  
//   redisclient.lrange("mylist",0,-1,function(err,reply){
//     if(reply==null){
//       return ;
//     }
//     //console.log(reply);
//     reply=reply.reverse();
    
    
//   });
//   console.log(test);
//   //console.log(reply);
//   return reply;
// }



server.listen(8880);
users =[];
 
//setting:
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',function(req,res,next){
  res.render('index');
});


//socket
io.sockets.on('connection', function(socket) {
  //storeMessage(name,message);
  //new user login

  socket.on('login', function(nickname) {

    if (users.indexOf(nickname) > -1) {
      socket.emit('nickExisted');
    } else {
      socket.userIndex = users.length;
      socket.nickname = nickname;
      users.push(nickname);
      socket.emit('loginSuccess');
      io.sockets.emit('system', nickname, users.length, 'login');

//      console.log(messages);
   redisclient.lrange("mylist",0,-1,function(err,reply){
    if(reply==null){
      return ;
    }
    //console.log(reply);
    reply=reply.reverse();
    socket.emit('join',reply);
    
  });
      
    }
  });
//user join 


  //user leave
  socket.on('disconnect', function() {
    users.splice(socket.userIndex, 1);
    socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
  });




  //new message get
  socket.on('postMsg', function(msg,color) {
    socket.broadcast.emit('newMsg', socket.nickname, msg, color);
   storeMessage(socket.nickname,msg,color);
  });


});
