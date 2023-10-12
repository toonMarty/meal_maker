const message = require('../models/message');
const Message = require('../models/message');


module.exports = io => {
    io.on("connection", client => {
      console.log('new connection');

      Message.find({})
      .sort({ createdAt: -1})
      .limit(20)
      .then(messages => {
        client.emit('load all messages', messages.reverse());
      });
      
      // listen when a user disconnects
      client.on('disconnect', () => {
        client.broadcast.emit('user disconnected');
        console.log('user disconnected');
      });

      // listen for a message event and broadcast a message to all connected users
      client.on('message', (data) => {
        let messageAttributes = {
          content: data.content,
          userName: data.userName,
          user: data.userId
        },
        m = new Message(messageAttributes);
        m.save()
        .then(() => {
          io.emit('message', messageAttributes);
        })
        .catch(error => console.log(`error: ${error.message}`));
        
      });
    });
};