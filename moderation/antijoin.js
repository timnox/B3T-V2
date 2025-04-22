const Discord = require("discord.js");
const { QuickDB } = require('quick.db'); // Importation de QuickDB
const config = require("../config");

const db = new QuickDB();  // Initialisation de QuickDB
const owner = db.table("Owner");  // Accéder à la table "Owner"
const cl = db.table("Color");  // Accéder à la table "Color"
const wl = db.table("Whitelist");  // Accéder à la table "Whitelist"

module.exports = {
    name: 'antijoin',
    usage: 'antijoin',
    description: `Permet de d'interdire l'accès à des vocaux.`,
    async execute(client, message, args) {

        if (await owner.get(`owners.${message.author.id}`) || config.bot.buyer.includes(message.author.id)) {

            let color = await cl.get(`color_${message.guild.id}`);
            if (color == null) color = config.bot.couleur;

            if (args[0] === 'add') {

                const newChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1] || message.channelId);
                if (!newChannel) return message.channel.send({ content: "Aucun salon trouvé !" });

                if (await db.get(`${message.guild.id}.antivoc.${newChannel.id}`)) {
                    return message.channel.send(`🔊・__Le salon <#${newChannel.id}> est désormais interdit__\n*(Bypass par les owners et la Whitelist)*`);
                } else {
                    await db.set(`${message.guild.id}.antivoc.${newChannel.id}`, newChannel.id);
                    message.channel.send(`🔊・__Le salon ${newChannel} est désormais interdit__\n*(Bypass: owner et whitelist)*`);
                }

            } else if (args[0] === 'remove') {

                const newChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1] || message.channelId);
                if (!newChannel) return message.channel.send({ content: "Aucun salon trouvé !" });

                await db.delete(`${message.guild.id}.antivoc.${newChannel.id}`);
                message.channel.send({ content: `Le salon ${newChannel} n'est plus interdit.` });

            } else if (args[0] === 'clear') {

                await db.delete(`${message.guild.id}.antivoc`);
                message.channel.send({ content: `Tous les salons interdits sont de nouveau autorisés.` });

            }
        }
    }
};
