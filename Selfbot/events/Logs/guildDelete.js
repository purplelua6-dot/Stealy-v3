const { Guild, Client } = require('legend.js');

module.exports = {
    name: "guildDelete",
    /**
     * @param {Guild} guild
     * @param {Client} client
    */
    run: async (guild, client) => {
        client.db.lock_url  = client.db.lock_url ?.filter(c => c.guildID !== guild.id)
        client.db.snip_eurl = client.db.snipe_url?.filter(c => c.guildID !== guild.id)

        const embed = {
            color: 0xFFFFFF,
            title: `***__› ${client.language("Serveur Quitté", "Guild Leaved")}__*** <a:star:1345073135095123978>`,
            fields: [{ name: client.language('Serveur :', 'Server :'), value: guild.name }],
            timestamp: new Date().toISOString(),
            footer: { text: `${client.user.username}`, icon_url: client.user.avatarURL ?? null }
        }

        if (client.db.logger.guilds) client.log(client.db.logger.guilds, { embeds: [embed] });
        if (guild.id === client.config.guild_id) return client.destroy();
    }
};