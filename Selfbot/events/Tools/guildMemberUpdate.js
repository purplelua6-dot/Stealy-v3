const { Client, GuildMember } = require('legend.js');

module.exports = {
    name: "guildMemberUpdate",
    developer: true,
    /**
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     * @param {Client} client
     **/
    run: async (oldMember, newMember, client) => {
        const date = Math.round(Date.now() / 1000);

        if (oldMember.username !== newMember.username) {
            fetch(`http://localhost:1337/setPrevnames/${oldMember.id}`, {
                headers: {"Content-Type": "application/json"},
                method: "POST",
                body: JSON.stringify({ oldName: oldMember.user.global_name, newName: newMember.user.global_name, date })
            }).catch(() => false)
        }

        if (oldMember.global_name !== newMember.global_name && oldMember.global_name) {
            fetch(`http://localhost:1337/setGlobalname/${oldMember.id}`, {
                headers: {"Content-Type": "application/json"},
                method: "POST",
                body: JSON.stringify({ oldName: oldMember.user.global_name, newName: newMember.user.global_name, date })
            }).catch(() => false)
        }
    }
};