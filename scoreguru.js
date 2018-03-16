const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
  console.log("score-guru up and ready.");
});

client.on("message", (message) => {

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch (command) {
    case "collect" :
      /* this actually collects the images 
         The section needs to do the following:
         1. Ensure that messages have been posted
         2. Find a message that was posted by the bot indicating the start
         3. Check that the number of images matches. 
         4. Record the URL of images returned. */
      if(args[0] === 'start') {
      	message.channel.send(`Waiting for you to upload your images (max 15).  Use the \`collect\` command again to register the images.`);
      } else if(args.length == 3) {
      	message.channel.fetchMessages({limit:15})
      	  .then(function(messages){
      	  	
      	  	/* bot is a parameter that is true/false */
      	  	
      	  	var ids = messages.map(id => id.id);
      	  	var usr = messages.map(usr => usr.author.username);
      	  	var att = messages.map(att => att.attachments);
      	  	var timestamp = messages.map(id => id.createdTimestamp)

      	  	console.log(att);

      	  })
      }

      /*let [lbclass, date, images] = args;
      message.channel.fetchMessages({ limit: 10 })
        .then(messages => console.log(`Received ${messages.size} messages`))
        .catch(console.error); */
      break;
    case "blah" :
      message.channel.send('Ooooh, looks like you\'re starting something exciting!');
      break;
  }

});

client.login(config.token);