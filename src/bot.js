
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')

let bot = slack.rtm.client()
var storedMessagesInMemory = [];

bot.started((payload) => {
  this.self = payload.self
})

bot.message((msg) => {
  storedMessagesInMemory.push(msg);
  console.log(storedMessagesInMemory)

  if (storedMessagesInMemory.length === 10){
    console.log("time to send the messages to the database woof woof ")
  }

  if (!msg.user) return
  if (!_.includes(msg.text.match(/<@([A-Z0-9])+>/igm), `<@${this.self.id}>`)) return

  slack.chat.postMessage({
    token: config('SLACK_TOKEN'),
    icon_emoji: config('dog'),
    channel: msg.channel,
    username: 'Dogebot',
    text: `Wow such message very doge"`
  }, (err, data) => {
    if (err) throw err

    let txt = _.truncate(data.message.text)

    console.log(`Wow! such server very bot"`)
  })
})

module.exports = bot

/////
