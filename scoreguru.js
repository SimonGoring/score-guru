const util = require('util');
const fs = require('fs');
const Discord = require("discord.js");

const token = process.env.TOKEN;

//const config = require('./config.json')
const config = {"token": token,
                "prefix": "%"};


// Sort out the allies to get the cheapest ones at each boost:
var allies = require('./data/max_score.json')

for (i = allies.length - 1; i > 0; i--) {
  if (allies[i]['max'] === allies[i - 1]['max']) {
    allies.splice(i, 1);
  }
}

const client = new Discord.Client();

client.on("ready", () => {
  // client.setStatus('online', 'Awaiting your command.');;
});

client.on("message", (message) => {

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch (command) {
    case "allies":
      
      if (args[1] == 'buy') {

        var value = args[0];
        var tobuy = args[2];

        // Parse the value that is being returned.
        if (typeof(value) == 'string') {
          if (value.match(/^[-+]?\d+(\.\d+)?m$/)) {
            // Is in the millions and a valid number:
            value = value.substring(0,value.length - 1) * 1e6
          } else if(value.match(/^[-+]?\d+(\.\d+)?$/)) {
            value = value * 1;
          } else if (!value.match(/^[-+]?\d+(\.\d+)?$/)) {
            message.channel.send('The ally bot can only check numbers formatted as: `1010121`, or with an `m` to indicate millions: `2.6m`.');
            break;
          }
        }

        if (typeof(tobuy) == 'string') {
          // tobuy must only be numbers:
          if (tobuy.match(/^\d+$/)) {
            tobuy = tobuy * 1;
          } else {
            message.channel.send('The ally bot needs to know how many allies to buy.  You must enter a number.');
            break;            
          }
        }

        if (tobuy < 1 || tobuy > 10) {
          message.channel.send('If you\'re trying to buy ' + tobuy + ' allies with ' + value + ' then you\'ve got bigger problems :joy:');
        }

        // We expect arguments in the following way: %allies 2.6m buy 3
        // so: args[0] is value args[1] is 'buy' and args[2] is how many to purchase.
        // The return should look like this:
        // ```
        // With args[0] gold for args[2] spots your best bet is:
        // '''Check for any duplicate prices:
        // n ally/allies at response[0].price, expect a best boost of response[0].boost.
        // n ally/allies at response[1].price, expect a best boost of response[1].boost.
        // ```

        // This gets set the number of the repetitions to use for the actual loop.
        var reps = 200;

        var bestpurch = 0;

        var priced =   allies.filter( x => x.value < value);
        var sample = Array(tobuy).fill(0);

        // Going to run through the randomizer:
        for (var i = 0; i < reps; i++) {
          console.log('i is now: ' + i);
          priced =   allies.filter( x => x.value < value);
          sample = Array(tobuy).fill(0);

          for (var j = 0; j < tobuy; j++) {

            var newprice = value - sample.reduce( function(acc, val) { return acc + val; });
            console.log(newprice)
            
            priced = allies.filter(x => x.value < newprice);
            sample[j] = priced[Math.floor(Math.random() * priced.length)]['value'];
          }

          var maxes = sample.map(function(x) {
            return allies.map( function(y) { if (y.value === x) {return y}})
                         .filter(x => !!x);
          })
          .reduce( function(acc, val) {return acc + val[0]['max']}, 0);

          if (maxes > bestpurch) {
            var bestsample = sample;
            bestpurch = maxes;
          }
        }
        
        // Now I have a set of prices.
        
        var outmsg = bestsample.map(smp => allies.filter(x => x.value === smp)
                               .map(x => x.max))
                               .reduce((prev,cur) => prev.concat(cur), []);

        var total = bestsample.reduce((prev, cur) => prev + cur, 0);
        var boost = outmsg.reduce((prev, cur) => prev + cur, 0);

        msg = '```\nYou want to buy ' + tobuy + ' allies with a boost of ' + boost + '% for a total of ' + total.toLocaleString() + ' gold:\n';

        for (i = 0; i < tobuy; i++) {
          msg = msg + 'Ally ' + (i + 1) + ' at ' + bestsample[i].toLocaleString() + ' with a max boost of ' + outmsg[i] + '%\n'
        }

        msg = msg + '```'
        
        console.log(msg);

        message.channel.send(msg);
        break;

      } else {
        // If they ask to "buy"
        message.channel.send('The allies command uses the following format: ```\n%allies 2.6m buy 3\n%alles 2600000 buy 3\n```\nWhich indicates you have 2.6m gold to buy 3 allies.  You can use `m` for millions to make things easier.');
        break;
      }

    case "timer" :

      timeb = {"timer": [{"event":"Troop",        "time": "March 22, 2018 22:05:01 PDT"},
                         {"event":"Monster",      "time": "March 22, 2018 23:05:01 PDT"},
                         {"event":"Construction", "time": "March 22, 2018 00:05:01 PDT"},
                         {"event":"Troop",        "time": "March 22, 2018 01:05:01 PDT"},
                         {"event":"Monster",      "time": "March 23, 2018 02:05:01 PDT"},
                         {"event":"Resource",     "time": "March 23, 2018 03:05:01 PDT"},
                         {"event":"Research",     "time": "March 23, 2018 04:05:01 PDT"},
                         {"event":"Troop",        "time": "March 23, 2018 05:05:01 PDT"},
                         {"event":"Monster",      "time": "March 23, 2018 06:05:01 PDT"},
                         {"event":"Might",        "time": "March 23, 2018 07:05:01 PDT"},
                         {"event":"Resource",     "time": "March 23, 2018 08:05:01 PDT"}
                        ]};

      var timen = new Date();

      var next = timeb['timer'].filter(x => x['event'].toLowerCase() === args[0].toLowerCase() );
      //var next = timeb['timer'].filter(x => x['event'] === "Monster" );
      var times = next.map(date => new Date(date["time"]));

      var nt = times.map(nexter => 11 - (Math.abs(timen - nexter) / 36e5) % 11 + 1);

      var nexttime = [].concat.apply([], nt.map(x => [x, x + 11, x + 22]))
        .sort(function(a,b) {return a - b; })
        .filter(x => x < 24)
        .map(x => Math.floor(x) + 'h' + Math.ceil(x % 1 * 60) + 'm');

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

client.login(config["token"]);