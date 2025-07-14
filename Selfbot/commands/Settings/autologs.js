const { Client, Message } = require('legend.js');

const logChannels = {
    guilds: "🙊・servs",
    anti_group: "🍜・groups",
    ghostpings: "👻・ghostping",
    message_delete: "🙈・dm-del",
    message_update: "🙉・dm-modif",
    nitro_sniper: "🐁・nitros",
    profiles: "📨・profiles",
    lock_url: "🔒・lockurl",
    snipe_url: "🎯・snipeurl"
};

module.exports = {
    name: "autologs",
    permission: "MANAGE_CHANNELS",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args 
    */
    run: async (client, message, args) => {
        let category = message.guild.channels.find(c => c.name === `Stealy - ${message.author.username}` && c.type === "category")
        if (!category) category = await message.guild.createChannel(`Stealy - ${message.author.username}`, {
            type: "category",
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ["VIEW_CHANNEL"]
                }
            ]
        });

        for (const [ type, channelName ] of Object.entries(logChannels)) {
            const logchannel = message.guild.channels.find(c => c.name === channelName);

            if (logchannel) {
                const webhooks = await logchannel.fetchWebhooks().catch(() => false)
                let webhook = webhooks?.first()

                if (!webhook) webhook = await logchannel.createWebhook(`${type}Webhook`).catch(() => false)
                if (!webhook) continue;

                client.db.logger[type] = webhook.url;
                client.save();
                message.edit(client.language(
                    "*Les logs ont été configurés avec succès.*",
                    "*Logs have been successfully set up.*"
                ));
            }
            else {
                const channel = await message.guild.createChannel(channelName, {
                    type: "text",
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ["VIEW_CHANNEL"]
                        }
                    ]
                });
                channel.setParent(category);

                const webhook = await channel.createWebhook(`${type}Webhook`).catch(() => false);
                if (webhook) client.db.logger[type] = webhook.url;
            }
        }

        client.save();
        message.edit(client.language(
            "*Les logs ont été configurés avec succès.*",
            "*Logs have been successfully set up.*"
        ));
    }
};