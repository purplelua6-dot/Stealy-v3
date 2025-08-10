const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction } = require("discord.js");

module.exports =
{
    name: "deconnexion",
    description: "Déconnecter un selfbot.",
    aliases: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
    */
    async executeSlash(client, interaction)
    {
        const member = interaction.options.getMember('utilisateur');
        if (!member) return interaction.reply({ content: 'Utilisateur non trouvé.', flags: 64 });

        if (global.clients[member.id]) {
            try {
                if (typeof global.clients[member.id].destroy === 'function') {
                    await global.clients[member.id].destroy();
                }
                
                delete global.clients[member.id];
                
                interaction.reply({ content: `Le selfbot de ${member.displayName} a été déconnecté.`, flags: 64 });
            } catch (error) {
                console.error(`Error destroying client for ${member.id}:`, error);
                
                delete global.clients[member.id];
                
                interaction.reply({ content: `Le selfbot de ${member.displayName} a été déconnecté (avec erreur).`, flags: 64 });
            }
        } else {
            interaction.reply({ content: `Aucun selfbot connecté pour ${member.displayName}.`, flags: 64 });
        }
    },
    get data()
    {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setContexts([0, 1, 2])
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName('utilisateur')
                    .setDescription('L\'utilisateur à déconnecter')
                    .setRequired(true))
    }
}