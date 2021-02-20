const Discord = require("discord.js");
const client = new Discord.Client();

class Bot
{
    constructor(cmd, prefix, callbackInit, callbackProcess)
    {
        this.cmd = cmd;
        this.prefix = prefix;
        this.init(callbackInit, callbackProcess);
    }

    init(callback, callbackProcess)
    {
        var cmds = {};

        this.cmd.forEach(c =>
            {
                cmds[this.prefix + c.name] = c.execute;
            })

        this.cmd = cmds;

        client.on("ready", () => {
            console.log("Connected as " + client.user.tag);
            if (callback) callback(client);
        });

        client.on("message", (msg) => {
            var parts = msg.content.split(" ");

            msg.parts = msg.content.split(" ");

            callbackProcess(msg);
        })
    }

    listen()
    {
        client.login(process.env.DISCORD_TOKEN);

    }
}

class Command
{
    constructor(name, callback, minimumParts)
    {
        this.name = name;
        this.callback = callback;
        this.minimumParts = minimumParts;
    }

    execute(parts)
    {
        this.callback(action)
     
    }
}

module.exports = {
    Command,
    Bot,
    client
}