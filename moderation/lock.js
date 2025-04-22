const Discord = require("discord.js");
const db = require('quick.db');
const owner = new db.table("Owner");
const cl = new db.table("Color");
const ml = new db.table("modlog");
const config = require("../config");
const p3 = new db.table("Perm3");

module.exports = {
    name: 'lock',
    usage: 'lock',
    description: `Permet de verrouiller un salon.`,
    async execute(client, message, args) {

        // Récupération de la permission spécifique (perm3) pour le serveur
        const perm3 = await p3.fetch(`perm3_${message.guild.id}`);
        let color = await cl.fetch(`color_${message.guild.id}`);
        if (!color) color = config.bot.couleur;

        // Vérification des permissions de l'utilisateur
        if (owner.get(`owners.${message.author.id}`) || message.member.roles.cache.has(perm3) || config.bot.buyer.includes(message.author.id)) {

            // Si l'utilisateur veut verrouiller tous les salons
            if (args[0] === "all") {
                message.guild.channels.cache.forEach(channel => {
                    // Verrouiller tous les salons en interdisant l'envoi de messages
                    channel.permissionOverwrites.edit(message.guild.id, {
                        SEND_MESSAGES: false,
                    }).catch(err => console.error(`Erreur lors de la fermeture du salon ${channel.id}: ${err}`));
                });

                // Envoi du message de confirmation
                message.channel.send(`${message.guild.channels.cache.size} salons ont été fermés.`);

                // Log de l'action dans le canal de modération
                const channellogs = ml.get(`${message.guild.id}.modlog`);
                const embed = new Discord.MessageEmbed()
                    .setDescription(`:lock: | ${message.author.tag} a fermé tous les salons du serveur\nExécuteur : <@${message.author.id}>`)
                    .setTimestamp()
                    .setColor(color)
                    .setFooter({ text: `📚` });

                const logchannel = client.channels.cache.get(channellogs);
                if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false);

                return;
            }

            // Si un salon spécifique est mentionné ou le salon actuel est utilisé
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

            try {
                // Verrouiller le salon spécifié
                await channel.permissionOverwrites.edit(message.guild.id, {
                    SEND_MESSAGES: false,
                });
                message.delete();  // Supprimer le message de commande

                // Envoi du message de confirmation pour le salon spécifique
                message.channel.send(`Les membres ne peuvent plus parler dans <#${channel.id}>`);
            } catch (e) {
                console.log(e);
                message.reply("Une erreur est survenue lors de la tentative de verrouillage du salon.");
            }

            // Log de l'action dans le canal de modération
            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`<@${message.author.id}> a \`verrouillé\` le salon <#${message.channel.id}>`)
                .setTimestamp()
                .setFooter({ text: `📚` });

            const logchannel = client.channels.cache.get(ml.get(`${message.guild.id}.modlog`));
            if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false);
        } else {
            message.reply("Vous n'avez pas la permission d'utiliser cette commande.");
        }
    }
};
