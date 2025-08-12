const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports =
{
    name: "list",
    description: "Affiche la liste des utilisateurs connectés à la machine.",
    aliases: [],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
    */
    async executeSlash(client, interaction) {
        const msg = await interaction.deferReply({ flags: 64 })
        const clients = Object.keys(global.clients);
        const users = await Promise.all(clients.map(async id => {
            const user = global.clients[id]?.user;
            const db = await client.get_database(id);
            return { id, username: user?.username ?? 'Unknown', enable: db?.enable ?? false };
        }));

        let p0 = 0;
        let p1 = 20;
        let page = 1;
        let count = p1;
        let maxpage = Math.ceil(clients.length / count) === 0 ? 1 : Math.ceil(clients.length / count)

        const embed = {
            title: 'Liste des membres connectés à la machine',
            color: 0xFFFFFF,
            footer: { text: `Page ${page}/${maxpage}`, iconURL: interaction.user.avatarURL({ dynamic: true }) },
            description: `${users.length > 0 ? users.sort((a, b) => { return a?.username?.localeCompare(b?.user?.username) }).map(r => r).map((m, i) => `\`${i + 1}\` - ${m.username} (\`${m.id}\`)`).slice(p0, p1).join('\n') : "Aucun utilisateur"}`
        }

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setDisabled(maxpage === 1)
                .setCustomId("previous")
                .setLabel("◀")
                .setStyle(2),

            new ButtonBuilder()
                .setDisabled(maxpage === 1)
                .setCustomId("next")
                .setLabel("▶")
                .setStyle(2),
        )
        await interaction.editReply({ embeds: [embed], components: [row], flags: 64 })
        const collector = msg.createMessageComponentCollector({ time: 1000 * 60 * 10 });
        collector.on('end', () => msg.edit({ components: [] }).catch(() => false))

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return i.reply({ content: "Vous ne pouvez pas utiliser cette interaction", flags: 64 })
            i.deferUpdate().catch(() => false)

            if (i.customId === "previous") {
                if (page - 1 <= 0) return;
                p0 = p0 - count <= 0 ? 0 : p0 - count;
                p1 = p1 - count <= 10 ? 10 : p1 - count;
                page = page - 1;

                embed.description = `${users.length > 0 ? users.sort((a, b) => { return a?.username?.localeCompare(b?.user?.username) }).map(r => r).map((m, i) => `\`${i + 1}\` - ${m.username} (\`${m.id}\`)`).slice(p0, p1).join('\n') : "Aucun utilisateur"}`
                embed.footer = { text: `Page ${page}/${maxpage}`, iconURL: interaction.user.avatarURL({ dynamic: true }) };
                interaction.editReply({ embeds: [embed] })
            }

            else if (i.customId === "next") {
                if (page >= maxpage) return;

                p0 = p0 + count;
                p1 = p1 + count;
                page = page + 1;

                embed.description = `${users.length > 0 ? users.sort((a, b) => { return a?.username?.localeCompare(b?.user?.username) }).map(r => r).map((m, i) => `\`${i + 1}\` - ${m.username} (\`${m.id}\`)`).slice(p0, p1).join('\n') : "Aucun utilisateur"}`
                embed.footer = { text: `Page ${page}/${maxpage}`, iconURL: interaction.user.avatarURL({ dynamic: true }) };
                interaction.editReply({ embeds: [embed] })
            }
        })

    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }
}