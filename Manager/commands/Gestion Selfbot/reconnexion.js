const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction } = require("discord.js");

module.exports =
{
    name: "reconnexion",
    description: "Reconnecter un selfbot.",
    aliases: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    staffOnly: true,
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
    */
    async executeSlash(client, interaction)
    {
        const member = interaction.options.getMember('utilisateur');
        if (!member) return interaction.reply({ content: 'Utilisateur non trouvé.', flags: 64 });

        if (global.clients[member.id]) {
            global.clients[member.id]?.destroy();
            delete global.clients[member.id];
        }

        const userToken = client.config.users.find(t => {
            try {
                return Buffer.from(client.decrypt(t).split('.')[0], 'base64').toString() == member.id;
            } catch (error) {
                console.error('Erreur lors du décryptage du token:', error);
                return false;
            }
        });

        if (userToken) {
            try {
                await client.load_token(client.decrypt(userToken));
                interaction.reply({ content: `Le selfbot de ${member.displayName} a été reconnecté.`, flags: 64 });
            } catch (error) {
                console.error('Erreur lors de la reconnexion:', error);
                interaction.reply({ content: 'Erreur lors de la reconnexion du selfbot.', flags: 64 });
            }
        } else {
            interaction.reply({ content: `Aucun token trouvé pour ${member.displayName}.`, flags: 64 });
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
                    .setDescription('L\'utilisateur à reconnecter')
                    .setRequired(true))
    }
}