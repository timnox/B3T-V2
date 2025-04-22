const Discord = require("discord.js");
const { QuickDB } = require('quick.db');
const config = require("../config");

const owner = new QuickDB({ table: "Owner" });
const cl = new QuickDB({ table: "Color" });
const ml = new QuickDB({ table: "modlog" });
const p2 = new QuickDB({ table: "Perm2" });
const p3 = new QuickDB({ table: "Perm3" });

module.exports = {
    name: 'clear',
    usage: 'clear',
    description: `Permet de supprimer des messages`,
    async execute(client, message, args) {
        const perm3 = await p3.get(`perm3_${message.guild.id}`);

        if (message.mentions.members.first()) {

            if (await owner.get(`owners.${message.author.id}`) || message.member.roles.cache.has(perm3) || config.bot.buyer.includes(message.author.id) === true) {

                await message.delete();
                message.channel.messages.fetch({ limit: 100 })
                    .then((messages) => {
                        const filterUser = message.mentions.members.first().id;
                        const filtered = messages.filter(m => m.author.id === filterUser).array().slice(0, 100);
                        message.channel.bulkDelete(filtered, true);
                    }).catch(() => false);
            }

        } else if (!isNaN(message.content.split(' ')[1])) {
            if (await owner.get(`owners.${message.author.id}`) || message.member.roles.cache.has(perm3) || config.bot.buyer.includes(message.author.id) === true) {

                let amount = 0;
                if (message.content.split(' ')[1] === '1' || message.content.split(' ')[1] === '0') {
                    amount = 1;
                } else {
                    await message.delete();
                    amount = parseInt(message.content.split(' ')[1]);
                    if (amount > 100) {
                        amount = 100;
                    }
                }
                await message.channel.bulkDelete(amount, true);
            }

            let color = await cl.get(`color_${message.guild.id}`);
            if (color == null) color = config.bot.couleur;

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`<@${message.author.id}> a \`supprimé\` ${args[0]} message(s) dans <#${message.channel.id}>`)
                .setTimestamp()
                .setFooter({ text: `📚` });
            const logchannel = client.channels.cache.get(await ml.get(`${message.guild.id}.modlog`));
            if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false);

        } else {

            if (await owner.get(`owners.${message.author.id}`) || message.member.roles.cache.has(p2.get(`perm2_${message.guild.id}`)) || message.member.roles.cache.has(perm3) || config.bot.buyer.includes(message.author.id) === true) {

                await message.channel.bulkDelete(100, true);
            }
        }
    }
};
