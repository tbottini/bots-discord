require("dotenv").config();
const fs = require("fs");
const { Dict, DictOccurence } = require("./Dict.js");
const { Bot, Command, client } = require("./src/command");

var aliasDict = new Dict("alias");
var wordDict = new DictOccurence("word");
var profileDict = new Dict("profile");

const PREFIX = "&";

var lang = JSON.parse(fs.readFileSync("./language.json").toString());

console.log(lang);

function fetchMessages(channel) {
  channel.fetchMessages().then(messages => {
    console.log(`${messages.size} procuradas.`);
    messages
      .array()
      .reverse()
      .forEach(msg => {
        console.log(
          `[${moment(msg.createdTimestamp)
            .format("DD/MM/YYYY - hh:mm:ss a")
            .replace("pm", "PM")
            .replace("am", "AM")}] ` +
            `[${msg.author.username.toString()}]` +
            ": " +
            msg.content
        );
      });
  });
}

 function listServer(client) {
  return client.guilds.cache.map(guild => {
    console.log(`${guild.name} | ${guild.id}`);

    return guild;

  });
}

 function listChannel(guild)
{
  return guild.channels.cache.filter(c => c.type === 'text')
}

async function listMember(guild)
{
  //guild.members
}

async function printMessage(channel, before, limit)
{
  if (limit <= 0)
    return;
  var conf = {};
  if (before)
    conf.before = before;
  channel.messages.fetch(conf)
  .then(messages => {
    var messagesArray = []
    messages.forEach(m => {
      var d = new Date(m.createdTimestamp);
      console.log(m.channel.name, m.author.username, d.getDate(), d.getMonth(), d.getFullYear(), m.content)
      messagesArray.push(m);
      
    })
    var last = messagesArray[messagesArray.length - 1];
    
    printMessage(channel, last.id, limit - 100);
  })
}




var bot = new Bot(
  [],
  "&",
  client => {
    //get all message of a channel


    listServer(client).forEach((server, i) =>
      {
        

        if (server.id != "290501060097736715")
          return ;
        console.log(server.name, server.id)
        var channel = listChannel(server);

        
        

        var channelArray = []
   
        channel.forEach(c => channelArray.push(c))

        channelArray.forEach(chan => console.log(chan.name, " --> ", chan.id))

        var idChannelChoice = "290501060097736715"

        var chan = channelArray.find(c => c.id == idChannelChoice);
        if (!chan)
          return ;
        console.log(chan.name, "##")

        //const firstChannel = channelArray[0];




        printMessage(chan, null, 3000)

        /*console.log(firstChannel.name);
        firstChannel.messages.fetch()
        .then(messages => {
          console.log(messages)
          var messagesArray = []
          messages.forEach(m => {
            var d = new Date(m.createdTimestamp);
            console.log(m.channel.name, m.author.username, d.getDate(), d.getMonth(), d.getFullYear(), m.content)
            messagesArray.push(m);
          })

          var last = messagesArray[messagesArray.length - 1];
          console.log(last.id, "----------------------------------------------------------------------------------#2");
          firstChannel.messages.fetch({before: last.id})
          .then(msg =>
            {
              msg.forEach(m => {
                console.log(m.content);
              })
            })
          return */
        })
      },
  msg => {
    const parts = msg.parts;

    if (msg.author == client.user) {
      return;
    }

    if (msg.content[0] == PREFIX) {
      console.log("add commande");

      if (parts[0] == "&stat" && profileDict.dict[msg.author]) {
        var auth = msg.author;
        var m = "<@" + msg.author + ">" + "\n";
        m += lang
          .map(l => l.name + ": " + profileDict.dict[auth][l.name])
          .join("\n");
        msg.channel.send(m);
      } else if (parts[0] == "&statw") {
        msg.channel.send(wordDict.print());
      } else if (parts[0] == "&classement" && profileDict.dict[msg.author]) {
        if (parts.length == 1) {
          var stats = Object.entries(profileDict.dict)
            .map(p => {
              return {
                name: p[0],
                value: Object.values(p[1]).reduce((a, b) => a + b)
              };
            })
            .sort((a, b) => a.value > b.value)
            .map((p, i) => {
              return i + 1 + " - " + p.name + ": " + p.value;
            })
            .join("\n");
          msg.channel.send(stats);
          return;
        }
        if (!dictStat[parts[1]])
          return msg.channel.send("categorie inexistante");

        var cat = dictStat[parts[1]];

        var stats = Object.entries(profileDict.dict)
          .map(p => {
            return {
              name: p[0],
              value: p[1][cat]
            };
          })
          .sort((a, b) => a.value > b.value)
          .map((p, i) => i + 1 + " - " + p.name + ": " + p.value)
          .join("\n");

        msg.channel.send(stats);
      }
    } else if (aliasDict.get(msg.content))
      msg.channel.send(aliasDict.get(msg.content));
    else {
      var keys = msg.content;
      keys.split(" ").forEach(key => {
        wordDict.increment(key);
      });

      //msg.channel.send(wordDict.print());
    }

    lang.forEach(d => {
      detectExpression(d.dict, d.name, msg);
    });
  }
);

bot.listen();

function detectExpression(dictionnaire, key, msg) {
  //if (dictionnaire.includes(msg.content))
  var msg = msg.content;
  var occ = msg.match(RegExp(dictionnaire.join("|"), "g"))?.length;

  if (occ) console.log("occurence", occ);

  if (occ) {
    if (!profileDict.dict[msg.author])
      profileDict.dict[msg.author] = { khey: 0, gamer: 0, vulgaire: 0 };

    profileDict.dict[msg.author][key] += occ;
    profileDict.save();
  }
}
