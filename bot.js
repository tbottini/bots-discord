const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const {Dict, DictOccurence} = require("./Dict.js");
var profile = {};
const PROFILE_PATH = "./profile.json";


var aliasDict = new Dict("alias")
var wordDict = new DictOccurence("word");
var profileDict = new Dict("profile");

const help = [
  { cmd: "&add", info: "&add <alias> <content>" },
  { cmd: "&add2", info: '&add2 "<sentence>" "<content>"' },
];

const PREFIX = "&";

var dictStat = {
  nolife: "gamer",
  pucix: "khey",
  gargamel: "vulgaire",
};

var vulgaireDict = ["pd", "bouff", "bouffon", "bouf", "enculé", "fdp", "fils de pute", "batard", "salope", "connasse", "débile", "con", "conne", "salaud", "pute", "putain", "salop", "salo", "connard", "connar", "fils deup", "demeuré", "idiot", "idiote", "demeurée", "bouffonne", "autiste", "pédale", "tarlouze. enculer", "merde", "tapette", "pédé"];

var kheyDict = [
  "issou",
  "chancla",
  "yatangaki",
  "paz",
  "gilbert",
  "et vous ?",
  "no fake",
  "vergonless",
  "risitas",
];

var gamerDict = ["valorant", "lol", "rocket", "league", "agrou", "dofus", "fortnite", "sardoche", "zerator", "league of legends", "medal", "blizzard", "riot", "epic games", "pubg", "garry's mod", "skribbl", "gmod", "zerator", "xari", "twitch", "among us"];

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
});
client.on("message", (receivedMessage) => {
  if (receivedMessage.author == client.user) {
    return;
  }

  if (receivedMessage.content == PREFIX + "help") {
    var content = "";
    help.forEach((c) => {
      content += c.cmd + " : " + c.info + "\n";
      receivedMessage.channel.send(content);
    });
  }
  if (receivedMessage.content[0] == PREFIX) {
    console.log("add commande");
    var parts = receivedMessage.content.split(" ");
    if (parts[0] == "&add" && parts.length >= 3) {
      var entry = parts[1];
      parts.shift();
      parts.shift();
      var message = parts.join(" ");
      aliasDict.add(entry, message);
    }
    if (parts[0] == "&add2") {
      parts.shift();
      var couple = parts.join(" ").split('"');
      if (couple.length == 5) {
        aliasDict.add(couple[1], couple[3]);
      }
    } else if (parts[0] == "&del") {
      if (parts.length >= 2) {
        aliasDict.delete(parts[1]);
      }
    } else if (parts[0] == "&stat" && profileDict.dict[receivedMessage.author]) {
      var auth = receivedMessage.author;
      var msg = "<@" + receivedMessage.author + ">" + "\n";
      msg += "pucix: " + profileDict.dict[auth].khey + "\n";
      msg += "gargamel: " + profileDict.dict[auth].vulgaire + "\n";
      msg += "nolife: " + profileDict.dict[auth].gamer + "\n";

      receivedMessage.channel.send(msg);
    }
    else if (parts[0] == "&statw")
    {
      receivedMessage.channel.send(wordDict.print());
    }
    else if (parts[0] == "&classement" && profileDict.dict[receivedMessage.author])
    {
        if (parts.length == 1)
        {
          var stats = Object.entries(profileDict.dict).map(p =>
            {

                return {
                    name: p[0],
                    value: Object.values(p[1]).reduce((a,b) => a + b),
                }
            }).sort((a, b) => a.value > b.value).map((p, i) => {
           
              return (i + 1) + ' - ' + p.name + ': ' + p.value;
            })
            .join('\n');
            receivedMessage.channel.send(stats);
          return ;
        }
        if (!dictStat[parts[1]]) 
            return receivedMessage.channel.send("categorie inexistante");

        var cat = dictStat[parts[1]]

        var stats = Object.entries(profileDict.dict).map(p =>
            {
                return {
                    name: p[0],
                    value: p[1][cat],
                }
            }).sort((a, b) => a.value > b.value)
            .map((p, i) => (i + 1) + ' - ' + p.name + ': ' + p.value)
            .join('\n');
        
        receivedMessage.channel.send(stats);
    }
  } else if (aliasDict.get(receivedMessage.content))
    receivedMessage.channel.send(aliasDict.get(receivedMessage.content));
  else
  {
    var keys = receivedMessage.content;
    keys.split(" ").forEach(key =>
      {
    wordDict.increment(key);
      })

    //receivedMessage.channel.send(wordDict.print());
  }

  detectExpression(vulgaireDict, "vulgaire", receivedMessage);
  detectExpression(gamerDict, "gamer", receivedMessage);
  detectExpression(kheyDict, "khey", receivedMessage);
});

function detectExpression(dictionnaire, key, receivedMessage) {
  //if (dictionnaire.includes(receivedMessage.content))
  var msg = receivedMessage.content;
  var occ = msg.match(RegExp(dictionnaire.join("|"), "g"))?.length;
  
  if (occ) console.log("occurence", occ);

  if (occ) {
    if (!profileDict.dict[receivedMessage.author])
      profileDict.dict[receivedMessage.author] = { khey: 0, gamer: 0, vulgaire: 0 };

    profileDict.dict[receivedMessage.author][key] += occ;
    profileDict.save();
  }
}

bot_secret_token =
  "Nzc2MTg0MzkyMTA0MTQ5MDU2.X6xMCw.SyLl0rHRjwnj3rB0wLl-rYG-0Po";

client.login(bot_secret_token);
