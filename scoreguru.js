require('shelljs/global');
const util = require('util');
const fs = require('fs');
const Discord = require("discord.js");

const config = {token: process.env.TOKEN,
                prefix: "%"};

const client = new Discord.Client();

client.on("ready", () => {
  console.log("score-guru up and ready.");
});

client.on("message", (message) => {

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch (command) {
    case "quest-timer" :

      timeb = {"timer": [{"event":"Troop",        "time": "March 22, 2018 21:05:01 PDT"},
                         {"event":"Monster",      "time": "March 22, 2018 22:05:01 PDT"},
                         {"event":"Construction", "time": "March 22, 2018 23:05:01 PDT"},
                         {"event":"Troop",        "time": "March 22, 2018 00:05:01 PDT"},
                         {"event":"Monster",      "time": "March 23, 2018 01:05:01 PDT"},
                         {"event":"Resource",     "time": "March 23, 2018 02:05:01 PDT"},
                         {"event":"Research",     "time": "March 23, 2018 03:05:01 PDT"},
                         {"event":"Troop",        "time": "March 23, 2018 04:05:01 PDT"},
                         {"event":"Monster",      "time": "March 23, 2018 05:05:01 PDT"},
                         {"event":"Might",        "time": "March 23, 2018 06:05:01 PDT"},
                         {"event":"Resource",     "time": "March 23, 2018 07:05:01 PDT"}
                        ]};

      var timen = new Date();

      var next = timeb['timer'].filter(x => x['event'] === args[0] );
      //var next = timeb['timer'].filter(x => x['event'] === "Monster" );
      var times = next.map(date => new Date(date["time"]));

      var nt = times.map(nexter => 11 - (Math.abs(timen - nexter) / 36e5) % 11 + 1);

      var nexttime = [].concat.apply([], nt.map(x => [x, x + 11, x + 22]))
        .sort(function(a,b) {return a - b; })
        .filter(x => x < 24)
        .map(x => Math.floor(x) + 'h' + Math.floor(x % 1 * 60) + 'm');

      var msg = [nexttime.slice(0, -1).join(', '), nexttime.slice(-1)[0]]
        .join(nexttime.length < 2 ? '' : ' and ')
      
      message.channel.send("The next " + args[0] + 
        " events will start in " + msg +". Each time with a window of 55m.");

      break;
    case "blah" :
      message.channel.send('I feel like that some days too :)');
      break;
  }

});

client.login(config.token);