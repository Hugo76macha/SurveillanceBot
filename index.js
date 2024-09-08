require("http").createServer((req, res) => res.end("Bot est en ligne")).listen(process.env.PORT || 8080)
require('dotenv').config();
const config = require("./config.json")
const token = config.token || process.env.token
const {
    Client,
    Collection,
    Intents,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require("discord.js");

const client = new Client({
    shards: 'auto',
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ],
    presence: {
        activities: [{
            name: `les bots 🔧`,
            type: "WATCHING",
        }],
        status: "online"
    }
});

const colors = require("colors");
const moment = require("moment");

const { PresenceUpdateStatus } = require("discord-api-types/v9");

client.on("presenceUpdate", async (oldPresence, newPresence) => {
  try {
        if (!oldPresence || !oldPresence.user.bot)
            return;
        if (oldPresence.status == newPresence.status)
            return;

        if (config.Servers) {
            if (newPresence.status == PresenceUpdateStatus.Online) {
                if (!config.bots.includes(newPresence.user.id)) return;
                newPresence.guild.channels.cache.get(config.Channels).send({
                    embeds: [new MessageEmbed()
                    .setTitle(`🟢︱En Ligne`)
                    .setDescription(`**${newPresence.user.tag}** est maintenant **En Ligne !**`)
                    .setColor(`GREEN`)
                    .setThumbnail(newPresence.user.avatarURL({ format: "png", size: 1024 }))
                    .setTimestamp()]
                });
            } else if (newPresence.status == PresenceUpdateStatus.Offline || newPresence.status == PresenceUpdateStatus.Invisible) {
                if (!config.bots.includes(newPresence.user.id)) return;
                newPresence.guild.channels.cache.get(config.Channels).send({
                    embeds: [new MessageEmbed()
                    .setTitle(`🔴︱Hors Ligne`)
                    .setDescription(`**${newPresence.user.tag}** est maintenant **Hors Ligne !**`)
                    .setColor(`RED`)
                    .setThumbnail(newPresence.user.avatarURL({ format: "png", size: 1024 }))
                    .setTimestamp()]
                });
            }
        }
    } catch (err) {
        return Promise.reject(err);
    }
});

client.login(token);

client.logger = (data) => {
  let logstring = `${String(`S` + `a` + `n` + `s` + ` Logs`).brightGreen}${` | `.grey}${`${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")}`.cyan}${` [::] `.magenta}`
  if (typeof data == "string") {
    console.log(logstring, data.split("\n").map(d => `${d}`.green).join(`\n${logstring} `))
  } else if (typeof data == "object") {
    console.log(logstring, JSON.stringify(data, null, 3).green)
  } else if (typeof data == "boolean") {
    console.log(logstring, String(data).cyan)
  } else {
    console.log(logstring, data)
  }
};

client.on("ready", async () => {
  try {
      client.logger(`Bot Discord en ligne !`.bold.brightGreen);
      
      client.logger(
      `Utilisateur du Bot: `.brightBlue + `${client.user.tag}`.blue + `\n` +
      `Serveur(s): `.brightBlue + `${client.guilds.cache.size} Serveurs`.blue + `\n` +
      `Surveillance: `.brightBlue + `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Membres`.blue + `\n` +
      `Discord.js: `.brightBlue + `v${Discord.version}`.blue + `\n` +
      `Node.js: `.brightBlue + `${process.version}`.blue + `\n` +
      `Plateforme: `.brightBlue + `${process.platform} ${process.arch}`.blue + `\n` +
      `Mémoire: `.brightBlue + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} Mo / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} Mo`.blue
      );
    } catch { }
});

process.on('multipleResolves', (type, promise, reason) => {
  console.log('[antiCrash] :: [multipleResolves]');
  console.log(type, promise, reason);
});
process.on('unhandledRejection', (reason, promise) => {
  console.log('[antiCrash] :: [unhandledRejection]');
  console.log(promise, reason);
});
process.on("uncaughtException", (err, origin) => {
  console.log('[antiCrash] :: [uncaughtException]');
  console.log(err, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log('[antiCrash] :: [uncaughtExceptionMonitor]');
  console.log(err, origin);
});