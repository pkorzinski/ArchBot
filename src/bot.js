
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')
const http = require('http')

let bot = slack.rtm.client()

var storedMessagesInMemory = [];

bot.started((payload) => {
  this.self = payload.self
})

// var options = {
//   host: 'https://hrr18-doge.herokuapp.com/',
//   path: '/api/messages',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'JSON'
//   }
// };

// var httpreq = http.request(options, function (response) {
//   response.setEncoding('utf8');
//   response.on('data', function (chunk) {
//   });
//   response.on('end', function() {
//     res.send('ok');
//   })
// });

// var sendMsg = function(){
//   var stringifiedMessages = JSON.stringify(storedMessagesinMemory);
//   storedMessagesinMemory = [];
//   httpreq.write(stringifiedMessages);
//   httpreq.end();
// }


bot.message((msg) => {
  storedMessagesInMemory.push(msg);
  //console.log(storedMessagesInMemory)
  console.log(storedMessagesinMemory.length)

  if (storedMessagesInMemory.length > 2){
    console.log("time to send the messages to the database woof woof ")
    //sendMsg();
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
