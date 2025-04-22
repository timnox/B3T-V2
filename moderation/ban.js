const Discord = require("discord.js");
const { QuickDB } = require('quick.db');
const config = require("../config");

const owner = new QuickDB({ table: "Owner" });
const cl = new QuickDB({ table: "Color" });
const pgs = new QuickDB({ table: "PermGs" });
const ml = new QuickDB({ table: "modlog" });
const p3 = new QuickDB({ table: "Perm3" });

module.exports = {
    name: 'ban',
    usage: 'ban <membre>',
    description: `Permet de bannir un membre.`,
    async execute(client, message, args) {

        let color = await cl.get(`color_${message.guild.id}`);
        if (color == null) color = config.bot.couleur;
        const perm3 = await p3.get(`perm3_${message.guild.id}`);

        if (await owner.get(`owners.${message.author.id}`) || message.member.roles.cache.has(perm3) || config.bot.buyer.includes(message.author.id) || message.member.roles.cache.has(await pgs.get(`permgs_${message.guild.id}`)) === true) {

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) {
                try {
                    member = await client.users.fetch(args[0]);
                } catch (e) {
                    member = null;
                }
            }

            if (!member) {
                return message.reply("Merci de mentionner l'utilisateur que vous souhaitez bannir du serveur !");
            }

            if (member.id === message.author.id) {
                return message.reply("Tu ne peux pas te bannir !");
            }

            let reason = args.slice(1).join(" ") || `Aucune raison`;

            message.reply({ content: `${member} a été banni du serveur` }).catch(err => err);
            member.send({ content: `Tu as été banni par ${message.author} pour la raison suivante: \n\n ${reason}` });
            member.ban({ reason: `${reason}` });

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`<@${message.author.id}> a \`banni\` ${member} du serveur\nRaison : ${reason}`)
                .setTimestamp()
                .setFooter({ text: `📚` });

            const logchannel = client.channels.cache.get(await ml.get(`${message.guild.id}.modlog`));
            if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false);
        }

        else if (message.member.roles.cache.has(await p3.get(`perm3_${message.guild.id}`)) === true) {

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

            if (!member) {
                return message.reply("Merci de mentionner l'utilisateur que vous souhaitez bannir du serveur !");
            }

            if (member.id === message.author.id) {
                return message.reply("Tu ne peux pas te bannir !");
            }

            if (member.roles.highest.position >= message.member.roles.highest.position || message.author.id !== message.guild.owner.id) {
                return message.reply(`Vous ne pouvez pas bannir un membre au dessus de vous`);
            }

            if (await owner.get(`owners.${message.author.id}`) || config.bot.buyer.includes(message.author.id) === true)
                return message.reply("Tu ne peux pas le bannir ! Il est owner du bot.");

            let reason = args.slice(1).join(" ") || `Aucune raison`;

            message.reply({ content: `${member} a été banni du serveur` }).catch(err => err);
            member.send({ content: `Tu as été banni par ${message.author} pour la raison suivante: \n\n ${reason}` });
            member.ban({ reason: `${reason}` });

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`<@${message.author.id}> a \`banni\` ${member} du serveur\nRaison : ${reason}`)
                .setTimestamp()
                .setFooter({ text: `📚` });

            const logchannel = client.channels.cache.get(await ml.get(`${message.guild.id}.modlog`));
            if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false);
        }
    }
};
