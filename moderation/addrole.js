const Discord = require("discord.js");
const config = require("../config");
const { QuickDB } = require("quick.db");

// Initialisation des tables (plus simplifiée)
const db = new QuickDB();

module.exports = {
    name: 'addrole',
    usage: 'addrole',
    description: `Permet d'ajouter un rôle à un membre.`,
    async execute(client, message, args) {

        // Vérification des droits de l'utilisateur
        const isOwner = await db.get(`owners.${message.author.id}`);
        const isBuyer = config.bot.buyer.includes(message.author.id);

        if (isOwner || isBuyer) {
            if (!args[0]) return message.reply("Tu dois mentionner un membre.");

            let color = await db.get(`color_${message.guild.id}`);
            if (color == null) color = config.bot.couleur;

            let member = message.mentions.members.first()
                || message.guild.members.cache.get(args[0])
                || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase())
                || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLowerCase());

            if (!member) return message.reply("Membre introuvable.");

            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!role) return message.channel.send(`Aucun rôle trouvé pour \`${args[1] || "rien"}\``);

            await member.roles.add(role.id, `Rôle ajouté par ${message.author.tag}`);
            message.channel.send(`1 rôle ajouté à ${member}.`);

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`➕ <@${message.author.id}> a utilisé la commande \`addrole\` sur ${member}\nRôle ajouté : ${role}`)
                .setTimestamp()
                .setFooter({ text: `📚` });

            const logchannelId = await db.get(`${message.guild.id}.modlog`);
            const logchannel = client.channels.cache.get(logchannelId);
            if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false);

        } else if (message.member.roles.cache.has(await db.get(`permgs_${message.guild.id}`))) {

            if (!args[0]) return message.reply("Tu dois mentionner un membre.");

            let member = message.mentions.members.first()
                || message.guild.members.cache.get(args[0])
                || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase())
                || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLowerCase());

            if (!member) return message.reply("Membre introuvable.");

            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!role) return message.channel.send(`Aucun rôle trouvé pour \`${args[1] || "rien"}\``);

            await member.roles.add(role.id, `Rôle ajouté par ${message.author.tag}`);
            message.channel.send(`1 rôle ajouté à ${member}.`);

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`➕ <@${message.author.id}> a utilisé la commande \`addrole\` sur ${member}\nRôle ajouté : ${role}`)
                .setTimestamp()
                .setFooter({ text: `📚` });

            const logchannelId = await db.get(`${message.guild.id}.modlog`);
            const logchannel = client.channels.cache.get(logchannelId);
            if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false);
        } else {
            message.reply("Tu n'as pas les permissions pour utiliser cette commande.");
        }
    }
};
