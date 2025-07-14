const { Client, Message } = require("legend.js");

module.exports = {
    name: "sync",
    permission: "MANAGE_CHANNELS",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const category = message.guild.channels.parent.get(args[0]) || message.channel.parent;
        if (!category || category.type !== "category") message.edit(client.language(`*Veuillez fournir une catégorie valide.*`, `*Please provide a valid category.*`));

        const channels = message.guild.channels.filter(c => c.parentID === category.id && c.type !== "category");
        if (!channels.size) message.edit(client.language(`*Aucun salon à synchroniser dans cette catégorie.*`, `*No channels to sync in this category.*`));

        for (const channel of channels.values()) {
            for (const perm of category.permissionOverwrites.values()) {
                channel.overwritePermissions(perm.id, { allow: perm.allow, deny: perm.deny })
            };
        }

        message.edit(client.language(`*Les permissions des salons dans la catégorie \`${category.name}\` ont été synchronisées.*`, `*The channel permissions in the category \`${category.name}\` have been synced.*`));
    }
};
