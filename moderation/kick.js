const Discord = require("discord.js");
const db = require('quick.db');
const owner = new db.table("Owner");
const cl = new db.table("Color");
const ml = new db.table("modlog");
const config = require("../config");
const p3 = new db.table("Perm3");

module.exports = {
    name: 'kick',
    usage: 'kick <membre>',
    description: `Permet de kick un membre.`,
    async execute(client, message, args) {

        const perm3 = await p3.fetch(`perm3_${message.guild.id}`);
        let color = await cl.fetch(`color_${message.guild.id}`);
        if (!color) color = config.bot.couleur;

        // Vérification des permissions de l'utilisateur
        if (owner.get(`owners.${message.author.id}`) || message.member.roles.cache.has(perm3) || config.bot.buyer.includes(message.author.id)) {

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

            if (!member) {
                return message.reply("Merci de mentionner l'utilisateur que vous souhaitez kick du serveur !");
            }

            if (member.id === message.author.id) {
                return message.reply("Tu ne peux pas te kick toi-même !");
            }

            let reason = args.slice(1).join(" ") || "Aucune raison";

            try {
                await member.kick(reason);
                message.reply({ content: `${member} a été expulsé du serveur` });

                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`<@${message.author.id}> a \`expulsé\` ${member} du serveur\nRaison : ${reason}`)
                    .setTimestamp()
                    .setFooter({ text: `📚` });

                const logchannel = client.channels.cache.get(ml.get(`${message.guild.id}.modlog`));
                if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false);
            } catch (err) {
                message.reply("Une erreur est survenue lors de l'expulsion de ce membre.");
            }

        } else if (message.member.roles.cache.has(perm3)) {
            // Si l'utilisateur a la permission spécifique "perm3"
            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

            if (!member) {
                return message.reply("Merci de mentionner l'utilisateur que vous souhaitez kick du serveur !");
            }

            if (member.id === message.author.id) {
                return message.reply("Tu ne peux pas te kick toi-même !");
            }

            if (member.roles.highest.position >= message.member.roles.highest.position || message.author.id !== message.guild.owner.id) {
                return message.reply("Vous ne pouvez pas kick un membre avec un rôle plus élevé ou égal au vôtre.");
            }

            let reason = args.slice(1).join(" ") || "Aucune raison";

            try {
                await member.kick(reason);
                message.reply({ content: `${member} a été expulsé du serveur` });

                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`<@${message.author.id}> a \`expulsé\` ${member} du serveur\nRaison : ${reason}`)
                    .setTimestamp()
                    .setFooter({ text: `📚` });

                const logchannel = client.channels.cache.get(ml.get(`${message.guild.id}.modlog`));
                if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false);
            } catch (err) {
                message.reply("Une erreur est survenue lors de l'expulsion de ce membre.");
            }
        } else {
            message.reply("Vous n'avez pas la permission d'utiliser cette commande.");
        }
    }
};
