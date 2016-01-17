var FseChatRoom=function(){
  this.socket=null;
};
window.onload=function(){
   var fsechatroom =new FseChatRoom();
   fsechatroom.init();
};

//applications:
FseChatRoom.prototype =  {
  // body...
  init: function(){
    var that=this;
    this.socket=io.connect();
    this.socket.on('connect',function(){
      document.getElementById('info').textContent='your name is:';
      document.getElementById('nickfoo').style.display='block';
      document.getElementById('nicknameInput').focus();
    });

    this.socket.on('nickExisted', function() {
      document.getElementById('info').textContent = 'nickname is existed!';
    });
    this.socket.on('loginSuccess', function() {
      document.title = 'fsechatroom|' + document.getElementById('nicknameInput').value;
      document.getElementById('loginfoo').style.display = 'none';
      document.getElementById('messageInput').focus();
    });
    this.socket.on('error', function(err) {
            if (document.getElementById('loginfoo').style.display == 'none') {
                document.getElementById('status').textContent = 'login fail';
            } else {
                document.getElementById('info').textContent = 'login fail';
            }
        }); 
    this.socket.on('system', function(nickName, userCount, type) {
            var msg = nickName + (type == 'login' ? ' joined' : ' left');
            that._displayNewMsg('system', msg, 'red');
            document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
        });
    this.socket.on('newMsg', function(user, msg, color) {
            that._displayNewMsg(user, msg, color);
        });

// this.socket.on('previous',function(user,msg,color){
//     that._displayNewMsg(user, msg, color);

// });
this.socket.on('join',function(messages){
    messages.forEach(function(message){
        message = JSON.parse(message);
        that._displayNewMsg(message.name,message.msg,message.color);
    });
    
});
 
    
  document.getElementById('loginBtn').addEventListener('click', function() {
            var nickName = document.getElementById('nicknameInput').value;
            if (nickName.trim().length != 0) {
                that.socket.emit('login', nickName);
            } else {
                document.getElementById('nicknameInput').focus();
            };
        }, false);
        document.getElementById('nicknameInput').addEventListener('keyup', function(e) {
            if (e.keyCode == 13) {
                var nickName = document.getElementById('nicknameInput').value;
                if (nickName.trim().length != 0) {
                    that.socket.emit('login', nickName);
                };
            };
        }, false);

        document.getElementById('sendBtn').addEventListener('click', function() {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = document.getElementById('colorStyle').value;
            messageInput.value = '';
            messageInput.focus();
            if (msg.trim().length != 0) {
                that.socket.emit('postMsg', msg, color);
                that._displayNewMsg('me', msg, color);
                return;
            };
        }, false);

        document.getElementById('messageInput').addEventListener('keyup', function(e) {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = document.getElementById('colorStyle').value;
            if (e.keyCode == 13 && msg.trim().length != 0) {
                messageInput.value = '';
                that.socket.emit('postMsg', msg, color);
                that._displayNewMsg('me', msg, color);
            };
        }, false);
        //   document.getElementById('clearBtn').addEventListener('click', function() {
        //     document.getElementById('viewmessage').innerHTML = '';
        // }, false);
      },

        _displayNewMsg: function(user, msg, color) {
        var container = document.getElementById('viewmessage'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;

    }

  };

