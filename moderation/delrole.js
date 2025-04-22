const Discord = require("discord.js");
const config = require("../config");
const { QuickDB } = require("quick.db");
const owner = new QuickDB({ table: "Owner" });
const cl = new QuickDB({ table: "Color" });
const ml = new QuickDB({ table: "modlog" });
const pgs = new QuickDB({ table: "PermGs" });

module.exports = {
    name: 'delrole',
    usage: 'delrole',
    description: `Permet de retirer un rôle à un membre.`,
    async execute(client, message, args) {

        // Vérifier si l'utilisateur a la permission d'utiliser la commande
        if (await owner.get(`owners.${message.author.id}`) || config.bot.buyer.includes(message.author.id) === true) {

            if (!args[0]) return message.reply("Merci de mentionner un membre à qui retirer un rôle.");

            let color = await cl.get(`color_${message.guild.id}`);
            if (color == null) color = config.bot.couleur;

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLowerCase());
            if (!member) return message.reply("Membre non trouvé.");

            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!role) return message.channel.send(`Aucun rôle trouvé pour \`${args[1] || "rien"}\``);

            await member.roles.remove(role.id, `Rôle retiré par ${message.author.tag}`);

            message.channel.send(`1 rôle retiré à ${member}.`);

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`➖ <@${message.author.id}> a utilisé la commande \`delrole\` sur ${member}\nRôle retiré : ${role}`)
                .setTimestamp()
                .setFooter({ text: `📚` });

            const logchannel = client.channels.cache.get(await ml.get(`${message.guild.id}.modlog`));
            if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false);

        } else if (message.member.roles.cache.has(await pgs.get(`permgs_${message.guild.id}`)) === true) {

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLowerCase());
            if (!member) return message.reply("Membre non trouvé.");

            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!role) return message.channel.send(`Aucun rôle trouvé pour \`${args[1] || "rien"}\``);

            await member.roles.remove(role.id, `Rôle retiré par ${message.author.tag}`);

            message.channel.send(`1 rôle retiré à ${member}.`);

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`➖ <@${message.author.id}> a utilisé la commande \`delrole\` sur ${member}\nRôle retiré : ${role}`)
                .setTimestamp()
                .setFooter({ text: `📚` });

            const logchannel = client.channels.cache.get(await ml.get(`${message.guild.id}.modlog`));
            if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false);

        }
    }
};
