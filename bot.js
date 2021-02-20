require("dotenv").config();
const fs = require("fs");
const {Dict, DictOccurence} = require("./Dict.js");
const { Bot, Command, client } = require("./src/command");

var aliasDict = new Dict("alias")
var wordDict = new DictOccurence("word");
var profileDict = new Dict("profile");



const PREFIX = "&";


var lang = JSON.parse(fs.readFileSync("./language.json").toString());

console.log(lang)

const helpCmd = new Command("help", (msg, parts) =>
{
  const help = [
    { cmd: "&add", info: "&add <alias> <content>" },
    { cmd: "&add2", info: '&add2 "<sentence>" "<content>"' },
  ];
  var content = "";
  help.forEach((c) => {
    content += c.cmd + " : " + c.info + "\n";
    msg.channel.send(content);
  });
})

const add = new Command("add", (parts) =>
{
  var entry = parts[1];
  parts.shift();
  parts.shift();
  var message = parts.join(" ");
  aliasDict.add(entry, message);
}, 3)

const add2 = new Command("add2", (parts) =>
{
  parts.shift();
  var couple = parts.join(" ").split('"');
  if (couple.length == 5) {
    aliasDict.add(couple[1], couple[3]);
  }
})

const del = new Command("del", (parts) =>
{
  if (parts.length >= 2) {
    aliasDict.delete(parts[1]);
  }
})



var bot = new Bot([], "&", () => {},  (msg) => {


  const parts = msg.parts;

  if (msg.author == client.user) {
    return;
  }

  if (msg.content[0] == PREFIX) {
    console.log("add commande");
  

    if (parts[0] == "&stat" && profileDict.dict[msg.author]) {
      var auth = msg.author;
      var m = "<@" + msg.author + ">" + "\n";
      m += lang.map(l => l.name + ": " + profileDict.dict[auth][l.name]).join("\n");
      msg.channel.send(m);
    }
    else if (parts[0] == "&statw")
    {
      msg.channel.send(wordDict.print());
    }
    else if (parts[0] == "&classement" && profileDict.dict[msg.author])
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
            msg.channel.send(stats);
          return ;
        }
        if (!dictStat[parts[1]]) 
            return msg.channel.send("categorie inexistante");

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
        
        msg.channel.send(stats);
    }
  } else if (aliasDict.get(msg.content))
    msg.channel.send(aliasDict.get(msg.content));
  else
  {
    var keys = msg.content;
    keys.split(" ").forEach(key =>
      {
    wordDict.increment(key);
      })

    //msg.channel.send(wordDict.print());
  }

  lang.forEach(d =>
    {
      detectExpression(d.dict, d.name, msg);
    })

});

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
