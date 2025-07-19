const types = [ "voice", "default", "dm", "group" ]
const { Client, Message } = require("legend.js");

module.exports = {
    name: "joinvc",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        
        const channel = message.mentions.channels.first() || client.channels.get(args[0]);
        if (!channel) 
            return message.edit(client.language(
                `<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> Aucun salon de trouvé pour \`${args[0] || "rien"}\``,
                `<:star:1262311834019696682> **__Senju__** <:star:1262311834019696682>\n> No channel found for \`${args[0] || "nothing"}\``
            ));

        if (!types.includes(channel.type))
            return message.edit(client.language(
                "Veuillez me donner un salon vocale",
                "Please give me a voice channel"
            ));
        
        client.voc(channel.id);
        message.edit(client.language(
            `${client.user} est actuellement connecté dans ${channel}`,
            `${client.user} is currently connected in ${channel}`
        ))
    }
}