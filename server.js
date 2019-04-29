//Libraries
const express = require('express');
const app = express();
app.use(express.static('public'));
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
app.get('/invite', function(request, response) {
  response.sendFile(__dirname + '/views/invite.html');
});
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

const db = require('quick.db'); //Quick.db
const send = require('quick.hook'); //WebHooks lib
db.createWebview(process.env.PASSWORD, process.env.PORT1);// process.env.PORT creates the webview on the default port
const points = new db.table('POINTS');
const levels = new db.table('LEVELS');
const xpl = new db.table("TOTAL_POINTS");

const Discord = require('discord.js'); //Discord library
//Creating bot
const client = new Discord.Client({
  forceFetchUsers: true
});
const fs = require('fs'); //FileSystem
try {
    var config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Overwrite prefix (important for changing prefix)
  } catch(ex){
    console.log("[ERROR] Config overwrited");
    var config = {}
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.log);
  }
const active = new Map();
const log = client.channels.get('563949957577572372') // Logging channel
const err = client.channels.get('570427795616825344')


const serverStats = {
  guildID: '563948030533959687',
  totalUsersID: '570806286296547337',
  memberCountID: '570806338402123782',
  botCountID: '570806381796392975'
}

const server = {
users: '570802894580875275',
channels: '563958091368890398',
guilds: '570805885522280465'
}

var ownerId = '364345043403669526'; //My ID

const getDefaultChannel = async (guild) => {
  if(guild.channels.has(guild.id))
    return guild.channels.get(guild.id)
  
  if(guild.channels.exists("name", "general"))
    return guild.channels.find("name", "general").id;
  
  return guild.channels
   .filter(c => c.type === "text" &&
     c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
   .sort((a, b) => a.position - b.position ||
     Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
   .first().id;
}

client.on("error", e => {
  console.log("[ERROR] " + e);
});
client.on('message', (message) => {
  const prepik = config[message.guild.id].prefix;
    if(message.content == `BlackSobs`) {
        message.channel.send(`He My Prefix is **${prepik}** `);
    }
});
client.on('ready', () => { //Startup
  console.log("Bot on!");
    const chan = client.channels.get("566561248792150016");
  let liveLEmbed = new Discord.RichEmbed()
    .setAuthor(client.user.username, client.user.avatarURL)
    .setTitle(`**ONTIME**`)
    .setDescription(`Bot Logging ON`)
    .setTimestamp()
    chan.send(liveLEmbed);
  client.user.setUsername("BlackSobs");
  client.user.setStatus('online');
  client.channels.get(server.users).setName(`Total Users • ${client.users.size}`);
  client.channels.get(server.guilds).setName(`Total Guilds • ${client.guilds.size}`);
  client.channels.get(server.channels).setName(`Total Channels • ${client.channels.size}`);
  
  let statues = [
  `Service ${client.users.size} People `, 
  `Service ${client.guilds.size} Night Club`,
  `Thanks To Support BlackSobs`,
  `BlackSobs Is BETA`
]
  
setInterval(function() {
  let status = statues[Math.floor(Math.random()*statues.length)];
  //client.user.setPresence({ game: { name: status}, status: 'online'});
  client.user.setActivity(status, {type:'STREAMING', url:'https://www.twitch.tv/craftingbag'});
}, 25000);
});

client.on('guildCreate', guild => { // If the Bot was added on a server, proceed
  client.user.setActivity(`on ${client.users.size} users | +help`, {
    type: 'PLAYING'
  });
  
  const chan = client.channels.get("570426514483445780");
  
  config[guild.id] = {
    prefix: 'b+',
    delete: 'false',
    deleteTime: 10000,
    volume: 100,
    maxVolume: 200,
    levelup: false
  }
  fs.writeFile("./config.json", JSON.stringify(config), (err) => console.log);
  
  
  /* Welcome message */
  
  var welcome = new Discord.RichEmbed()
    .setColor(0x000000)
    .setURL("https://blacksobs.glitch.me/invite")
    .setTitle("Joined " + guild.name + " | Click to join support server")
    .setDescription("**Well, hello, I think.**\n\nMy name is BlackSobs, as you can see. I'm just a bot. Perfect bot. Another, same as other millions bots.\n\n")
    .addField("Prefix", `\`b+\``, false)
    .addField("Auto-delete", "true", false)
    .addField("Delete time", "10s", false)
    .addField("Default volume", "100%", false)
    .addField("Max volume", "200%", false)
    .addField("Level UP messages", "false", false)
    .setFooter("Members: " + guild.memberCount + " | Guild: " + guild.name + " | Official website: [Official](https://blacksobs.glitch.me/)");
  
  const channel = Promise.resolve(getDefaultChannel(guild));
  channel.then(function(ch) {
    const chan1 = client.channels.get(ch);
    chan1.send(welcome);
  });
  
  let liveLEmbed = new Discord.RichEmbed()
    .setAuthor(client.user.username, client.user.avatarURL)
    .setTitle(`Joined A Guild`)
    .setDescription(`**Guild Name**: ${guild.name}\n**Guild ID**: ${guild.id}\n**Members Get**: ${guild.memberCount}`)
  chan.send(liveLEmbed);
  
});  

client.on('guildDelete', (guild) => { // If the Bot was removed on a server, proceed
  delete config[guild.id]; // Deletes the Guild ID and Prefix
  fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
    if (err) err.send(err)
  })
  client.user.setActivity(`on ${client.users.size} users | b+help`, {
    type: 'WATCHING'
  });
  const chan = client.channels.get("570426514483445780");
  let liveLEmbed = new Discord.RichEmbed()
    .setAuthor(client.user.username, client.user.avatarURL)
    .setTitle(`Stopped Serving A Guild`)
    .setDescription(`**Guild Name**: ${guild.name}\n**Guild ID**: ${guild.id}\n**Members Lost**: ${guild.memberCount}`)
    chan.send(liveLEmbed);
});


/* ON MESSAGE */
client.on('message', message => { //If recieves message
  
  if (message.channel.type == "dm") return;
  
  try {
    config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Overwrite prefix (important for changing prefix)
  } catch(ex){
    config[message.guild.id] = {
      prefix: 'b+',
      delete: 'false',
      deleteTime: 10000,
      volume: 100,
      maxVolume: 200,
      levelup: false
    }
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }
  
  
  if (config[message.guild.id] == undefined) {
    config[message.guild.id] = {
      prefix: 'b+',
      delete: 'false',
      deleteTime: 10000,
      volume: 100,
      maxVolume: 200,
      levelup: false
    }
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }
  
  if (message.author.bot) return; //If bot
  
  let xpAdd = Math.floor(Math.random() * 7) + 8;
  
  // POINT SYSTEM
  
  levels.fetch(`${message.guild.id}_${message.author.id}`).then(i => {
    if (i == null || i === 0) levels.set(`${message.guild.id}_${message.author.id}`, 1);
  });
  
  points.fetch(`${message.guild.id}_${message.author.id}`).then(i => {
    if (i == null) points.set(`${message.guild.id}_${message.author.id}`, 0);
  });
  
  xpl.fetch(`${message.guild.id}_${message.author.id}`).then(i => {
    if (i == null) xpl.set(`${message.guild.id}_${message.author.id}`, 0);
  });
  
  points.add(`${message.guild.id}_${message.author.id}`, xpAdd);
  xpl.add(`${message.guild.id}_${message.author.id}`, xpAdd);
  points.fetch(`${message.guild.id}_${message.author.id}`).then(p => {
    levels.fetch(`${message.guild.id}_${message.author.id}`).then(l => {
      var xpReq = l * 300;
      if(p >= xpReq ) {
        levels.add(`${message.guild.id}_${message.author.id}`, 1);
        points.set(`${message.guild.id}_${message.author.id}`, 0);
        levels.fetch(`${message.guild.id}_${message.author.id}`, {"target": ".data"}).then(lvl => {
          if (message.guild.id !== "563951166786895883" && config[message.guild.id].levelup !== false) {
            message.channel.send({ embed: {"title": "Level Up!", "description": "Now your level - **" + lvl + "**", "color": 0x42f477} });
          }
        });
      }
    });
  });

  //END OF POINT SYSTEM
  
  var prefix = config[message.guild.id].prefix;

  let args = message.content.slice(prefix.length).trim().split(' '); //Setting-up arguments of command
  let cmd = args.shift().toLowerCase(); //LowerCase command
  
  if (message.content === "b+reset-prefix") {
    config[message.guild.id].prefix = 'b+';
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
    message.channel.send({ embed: {"title": "Prefix Set to **b+**", "color": 0x22ff22} });
    return;
  }

  if (!message.content.startsWith(prefix)) return; //If no prefix

  //Command handler
  try {
    
    if (config[message.guild.id].delete == 'true') {
      message.delete(config[message.guild.id].deleteTime).catch(function(e) {console.log("[WARN] Can't delete message - " + e);});
    }
    
    let ops = { 
      ownerId: ownerId,
      active: active
    }

    if (cmd == '') {
      message.channel.send({
        embed: {
          "color": 0xff2222,
          "fields": [{
            "name": "**Error**",
            "value": "Enter command"
          }]
        }
      }).then(msg => {
        if (config[message.guild.id].delete == 'true') {
          msg.delete(config[message.guild.id].deleteTime).catch(function(e) {console.log("[WARN] Can't delete message - " + e);});
        }
      });
    }

    let commandFile = require(`./commands/${cmd}.js`); //Require command from folder
    commandFile.run(client, message, args, ops); //Pass four args into 'command'.js and run it

  } catch (e) { //Catch errors 
    if (!message.content === "b+reset-prefix") {
      message.channel.send({
        embed: {
          "color": 0xff2222,
          "fields": [{
            "name": "**Error**",
            "value": "Something went wrong \n" + e
          }]
        }
      }).then(msg => {
        if (config[message.guild.id].delete == 'true') {
          msg.delete(config[message.guild.id].deleteTime).catch(function(e) {console.log("[WARN] Can't delete message - " + e);});
        }
      });
    }
  }
});


client.on('guildMemberAdd', member => {
  if (member.guild.id !== serverStats.guildID) return;
  client.channels.get(serverStats.totalUsersID).setName(`Total: ${member.guild.memberCount}`);
  client.channels.get(serverStats.memberCountID).setName(`Users: ${member.guild.members.filter(m => !m.user.bot).size}`);
  client.channels.get(serverStats.botCountID).setName(`Bots: ${member.guild.members.filter(m => m.user.bot).size}`);
  client.channels.get(server.users).setName(`Total Users • ${client.users.size}`);
  client.channels.get(server.guilds).setName(`Total Guilds • ${client.guilds.size}`);
  client.channels.get(server.channels).setName(`Total Channels • ${client.channels.size}`);
  db.set(`balance_${member.guild.id}_${member.id}`, 50);
  levels.set(`${member.guild.id}_${member.id}`, 1);
  points.set(`${member.guild.id}_${member.id}`, 0);
  xpl.set(`${member.guild.id}_${member.id}`, 0);
  
  var userGot = new Discord.RichEmbed()
    .setColor(0x555555)
    .setDescription("User got")
    .setTitle(member.tag);
  
  send(log, userGot, {
    name: "Bot Log",
    icon: "https://cdn.glitch.com/88b80c67-e815-4e13-b6a0-9376c59ea396%2F862.png?1532600798485"
  });
  
});

client.on('guildMemberRemove', member => {
  if (member.guild.id !== serverStats.guildID) return;
  client.channels.get(serverStats.totalUsersID).setName(`Total: ${member.guild.memberCount}`);
  client.channels.get(serverStats.memberCountID).setName(`Users: ${member.guild.members.filter(m => !m.user.bot).size}`);
  client.channels.get(serverStats.botCountID).setName(`Bots: ${member.guild.members.filter(m => m.user.bot).size}`);
  client.channels.get(server.users).setName(`Total Users • ${client.users.size}`);
  client.channels.get(server.guilds).setName(`Total Guilds • ${client.guilds.size}`);
  client.channels.get(server.channels).setName(`Total Channels • ${client.channels.size}`);
  db.delete(`balance_${member.guild.id}_${member.id}`);
  levels.delete(`${member.guild.id}_${member.id}`);
  points.delete(`${member.guild.id}_${member.id}`);
  xpl.delete(`${member.guild.id}_${member.id}`);
  
  var userLost = new Discord.RichEmbed()
    .setColor(0x555555)
    .setDescription("User lost")
    .setTitle(member.tag);
  
  send(log, userLost, {
    name: "Bot Log",
    icon: "https://cdn.glitch.com/88b80c67-e815-4e13-b6a0-9376c59ea396%2F862.png?1532600798485"
  });
  
});

//Connecting bot
client.login(process.env.TOKEN);
