
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')
const request = require('request')

let bot = slack.rtm.client();

let storedMessagesInMemory = [];

bot.started((payload) => {
  this.self = payload.self
})

var sendMsg = function(){
  request({
    url: 'https://hrr18-doge.herokuapp.com/api/messages/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(storedMessagesInMemory)
  })
}

bot.message((msg) => {

  let username = slack.users.info({token: config('SLACK_TOKEN'), user: msg.user}, function(err, data){
    if (err){
      console.error(err)
    } else {
      msg.username = data;
      storedMessagesInMemory.push(msg);
    }
  })

  if (storedMessagesInMemory.length > 3){
    sendMsg();
  }

  if (!msg.user) return
  if (!_.includes(msg.text.match(/<@([A-Z0-9])+>/igm), `<@${this.self.id}>`)) return

  slack.chat.postMessage({
    token: config('SLACK_TOKEN'),
    icon_emoji: config('dog'),
    channel: msg.channel,
    username: 'Dogebot',
    text: `Wow such message very doge!!! I has your message now.`
  }, (err, data) => {
    if (err) throw err

    let txt = _.truncate(data.message.text)

    console.log(`Wow! such server very bot"`)
  })
})

module.exports = bot

/////
