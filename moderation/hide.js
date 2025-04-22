const Discord = require("discord.js");
const db = require('quick.db');
const owner = new db.table("Owner");
const cl = new db.table("Color");
const ml = new db.table("modlog");
const config = require("../config");
const fs = require('fs');
const moment = require('moment');
const p3 = new db.table("Perm3");

module.exports = {
    name: 'hide',
    usage: 'hide <salon>',
    description: `Permet de cacher un salon.`,
    async execute(client, message, args) {
        const perm3 = await p3.fetch(`perm3_${message.guild.id}`);
        let color = await cl.fetch(`color_${message.guild.id}`);
        if (color == null) color = config.bot.couleur;

        // Vérification des permissions
        if (owner.get(`owners.${message.author.id}`) || message.member.roles.cache.has(perm3) || config.bot.buyer.includes(message.author.id)) {

            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
            
            // Assurez-vous que le canal existe
            if (!channel) {
                return message.reply("Salon introuvable. Veuillez mentionner un salon valide.");
            }

            try {
                // Modifier les permissions du salon
                await channel.permissionOverwrites.edit(message.guild.id, {
                    VIEW_CHANNEL: false,
                });
                message.channel.send(`Les membres ne peuvent plus voir le salon <#${channel.id}>`);
                message.delete();
            } catch (error) {
                console.error("Erreur lors de la modification des permissions:", error);
                return message.reply("Une erreur est survenue lors de la tentative de cacher le salon.");
            }

            // Log dans le canal modlog
            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`<@${message.author.id}> a utilisé la commande \`hide\` pour cacher le salon <#${channel.id}>`)
                .setTimestamp()
                .setFooter({ text: `📚` });

            const modlog = client.channels.cache.get(ml.get(`${message.guild.id}.modlog`));
            if (modlog) {
                modlog.send({ embeds: [embed] }).catch(() => false);
            }

        } else {
            return message.reply("Vous n'avez pas la permission d'utiliser cette commande.");
        }
    }
};