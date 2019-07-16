require("dotenv").config();
const express = require('express');
const {getAllMessages, createMessage, history} = require('./messagesCtrl')
const session = require('express-session');
let {SERVER_PORT, SESSION_SECRET} = process.env;

const app = express()

app.use(express.json());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60
    }
  }));
  app.use((req, res, next) => {
    let badWords = ['knucklehead', 'jerk', 'internet explorer'];
    if (req.body.message) {
      for (let i = 0; i < badWords.length; i++) {
        let regex = new RegExp(badWords[i], 'gi');
        req.body.message = req.body.message.replace(regex, '****');
      }
      next();
    } else {
      next();
    }
  });

app.get('/api/messages', getAllMessages)
app.get('/api/messages/history', history)
app.post('/api/message', createMessage)

app.listen(SERVER_PORT, () => {
    console.log(`We'll plan the Area 51 raid on port ${SERVER_PORT} 👽`)
})