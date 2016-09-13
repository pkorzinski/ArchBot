'use strict'

const slack = require('slack');
const _ = require('lodash');
const config = require('./config');
const request = require('request');

// create a new slack.rtm.client called bot
let bot = slack.rtm.client();

//create an empty array to store messages locally until they are sent to the ui server and put in the database
let storedMessagesInMemory = [];

bot.started((payload) => {
  this.self = payload.self;
});


//send the locally stored messages to the ui server so they can be stored permanently, and reset local storage.
var sendMsg = function(){
  request({
    url: 'https://hrr18-doge.herokuapp.com/api/messages/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(storedMessagesInMemory)
  });
  storedMessagesInMemory = [];
};


var getPassword = function(msg, callback){
  console.log('getpassword', msg)
  var obj = JSON.stringify(msg.team)
  request({
    url: 'https://hrr18-doge.herokuapp.com/api/teams/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: obj
  }, function(err, res, body){
    if (err){
      console.error(err)
    } else {
      console.log("getPassword was called!")
      var parsedBody = JSON.parse(body)
      callback(parsedBody.password);
    }
  })

}


//all code below runs each time a message is sent on the Slack channel.
bot.message((msg) => {

  if (msg.text === "Dogebot give me a password!"){

    getPassword(msg, function(password){

      slack.chat.postMessage({
          token: config('SLACK_TOKEN'),
          icon_emoji: config('ICON_EMOJI'),
          channel: msg.channel,
          username: 'Dogebot',
          text: "Your password is: "+password+" and your team code is: "+msg.team,
        }, (err, data) => {
          if (err) throw err
          let txt = _.truncate(data.message.text)
          console.log(txt)
        })


    })

  }

  //get the username from the message, add it to the message object, and push the object into the storedMessagesInMemory array.
  let username = slack.users.info({token: config('SLACK_TOKEN'), user: msg.user}, function(err, data) {
      if (err){
        console.error(err);
      } else {
        msg.username = data.user.name;
        storedMessagesInMemory.push(msg);
    }
  });

//if there are now more than 3 messages stored in local memory, execute the sendmsg function.
  if (storedMessagesInMemory.length >= 3){
    console.log(storedMessagesInMemory);
    sendMsg();
    storedMessagesInMemory = [];
  }

  if (!msg.user) return;
  if (!_.includes(msg.text.match(/<@([A-Z0-9])+>/igm), `<@${this.self.id}>`)) return;

  slack.chat.postMessage({
    token: config('SLACK_TOKEN'),
    icon_emoji: config('dog'),
    channel: msg.channel,
    username: 'Dogebot',
    text: `Wow such message very doge!!! I has your message now.`
  }, (err, data) => {
    if (err) throw err;

    let txt = _.truncate(data.message.text);
    console.log(`Wow! such server very bot"`);
  });
});

module.exports = bot;
