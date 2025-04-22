const Discord = require("discord.js");
const { QuickDB } = require('quick.db');
const config = require("../config");

const owner = new QuickDB({ table: "Owner" });
const cl = new QuickDB({ table: "Color" });
const blv = new QuickDB({ table: "blvoc" });
const pgs = new QuickDB({ table: "PermGs" });
const footer = config.bot.footer;

module.exports = {
    name: 'blv',
    usage: 'antivoc',
    description: `Permet de gérer la blacklist vocal`,
    async execute(client, message, args) {

        if (await owner.get(`owners.${message.author.id}`) || config.bot.buyer.includes(message.author.id) || message.member.roles.cache.has(await pgs.get(`permgs_${message.guild.id}`)) === true) {

            let color = await cl.get(`color_${message.guild.id}`);
            if (color == null) color = config.bot.couleur;

            if (args[0]) {
                let member = await client.users.fetch(message.author.id);
                if (args[0]) {
                    member = await client.users.fetch(args[0]);
                } else {
                    return message.channel.send(`Aucun membre trouvé pour \`${args[0] || "rien"}\``);
                }
                if (message.mentions.members.first()) {
                    member = client.users.cache.get(message.mentions.members.first().id);
                }
                if (!member) return message.channel.send(`Aucun membre trouvé pour \`${args[0] || "rien"}\``);
                if (await blv.get(`${message.guild.id}.${member.id}.blv`) === true) {
                    return message.channel.send(`${member.username} est déjà dans la blacklist vocal.`);
                }
                await blv.add(`${message.guild.id}.blvcount`, 1);
                await blv.push(`${message.guild.id}.blv`, member.id);
                await blv.set(`${message.guild.id}.${member.id}.blv`, member.id);

                message.channel.send(`${member.username} est maintenant dans la blacklist vocal.`);

            } else if (!args[0]) {

                let own = await blv.get(`${message.guild.id}.blv`);
                let ownc = await blv.get(`${message.guild.id}.blvcount`);
                if (ownc === null || isNaN(ownc)) ownc = 1;
                let p0 = 0;
                let p1 = 30;
                let page = 1;

                let embed = new Discord.MessageEmbed()
                    .setTitle("Blacklist Vocal")
                    .setColor(color)
                    .setDescription(!own ? "Aucun" : own.map((user, i) => `<@${user}>`).slice(0, 30).join("\n"))
                    .setFooter({ text: `${footer}` });

                const logchannel = client.channels.cache.get(await ml.get(`${message.guild.id}.modlog`));
                if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false);
            }
        }
    }
};
