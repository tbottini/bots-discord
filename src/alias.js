const { Command, client } = require("./command");

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

module.exports {add, add2, helpCmd, del};
