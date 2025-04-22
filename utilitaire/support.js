const { MessageEmbed } = require('discord.js');
const config = require("../config");
const db = require('quick.db');
const cl = new db.table("Color");

module.exports = {
    name: 'support',
    usage: 'support',
    description: `Pour avoir de l'aide`,
    async execute(client, message, args) {
        let color = cl.fetch(`color_${message.guild.id}`);
        if (color == null) color = config.bot.couleur;

        const embed = new MessageEmbed()
            .setColor(color)
            .setDescription(`Tu veux rejoindre le support du bot ?
            [Oui, je veux rejoindre](https://discord.gg/Y8UhEEzhuE)`)
            .setFooter({ text: config.bot.footer });

            await message.author.send({ embeds: [embed] });
            await message.delete();
        }
    };
