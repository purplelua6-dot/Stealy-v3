const { SlashCommandBuilder, Client, Message, ModalBuilder, TextInputBuilder, TextInputStyle, ChatInputCommandInteraction, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require('node:fs');

const images = [
    "https://i.imgur.com/OAIzyst.png",
    "https://i.imgur.com/AggmAAK.png",
    "https://i.imgur.com/muL1icZ.png",
    "https://i.imgur.com/RVXHU80.png"
];

module.exports =
{
    name: "info",
    description: "Afficher les informations de votre machine.",
    aliases: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
    */
    async executeSlash(client, interaction)
    {
        const db = await client.get_database(interaction.user.id);
        const embed = 
        {
            color: 0x000000,
            author: { name: `Abonnement de ${interaction.user.displayName}`, icon_url: interaction.user.avatarURL() },
            description: `- Etat: \`${db.enable ? '✅' : '❌'}\`\n- Expiration: **LIFETIME**\n- Prefix: \`${db ? db.prefix : '&'}\``,
            thumbnail: { url: 'https://i.imgur.com/K0X4z9g.png' },
            image: { url: `https://i.imgur.com/Xr849uE.jpeg` }
        };

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(client.connected[interaction.user.id] ? 'shutdown' : 'start')
                .setStyle(client.connected[interaction.user.id] ? ButtonStyle.Danger : ButtonStyle.Success)
                .setLabel(client.connected[interaction.user.id] ? 'Arrêter' : 'Démarrer'),

            new ButtonBuilder()
                .setCustomId('restart')
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Redémarrer')
                .setDisabled(client.connected[interaction.user.id] ? false : true),

            new ButtonBuilder()
                .setCustomId('edit-token')
                .setLabel('Modifier le token')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(client.connected[interaction.user.id] ? false : true)
        )

        const msg = await interaction.reply({ embeds: [embed], components: [row], files: [{ attachment:  images[Math.floor(Math.random()* images.length)], name: 'hex.png' }] });
        const collector = msg.createMessageComponentCollector({ time: 1000 * 60 });

        collector.on('collect', async i => 
        {
            if (i.user.id !== interaction.user.id)
                return i.reply({ content: 'Vous ne pouvez pas utiliser ce bouton', flags: 64 });

            switch(i.customId)
            {
                case 'start':
                    await i.deferReply({ flags: 64 });
                    
                    const userStartToken = client.config.users.find(t => Buffer.from(client.decrypt(t).split('.')[0], 'base64').toString() == interaction.user.id);
                    if (userStartToken){
                        db.enable = true;
                        fs.writeFileSync(`./Structures/databases/${interaction.user.id}.json`, JSON.stringify(db, null, 4));
                    }
                    
                    const userToken = client.config.users.find(t => Buffer.from(client.decrypt(t).split('.')[0], 'base64').toString() == interaction.user.id);
                    if (userToken) client.load_token(client.decrypt(userToken));
                    setTimeout(() => { editMessage(); i.editReply({ content: 'Votre machine a démarré' }) }, 1000 * 2);
                    break;

                case 'shutdown':
                    i.deferUpdate();

                    const userSToken = client.config.users.find(t => Buffer.from(client.decrypt(t).split('.')[0], 'base64').toString() == interaction.user.id);
                    if (userSToken){
                        db.enable = false;
                        fs.writeFileSync(`./Structures/databases/${interaction.user.id}.json`, JSON.stringify(db, null, 4));
                    }

                    client.connected[interaction.user.id].terminate();
                    delete client.connected[interaction.user.id];

                    editMessage();
                    break;

                case 'restart':
                    await i.deferReply({flags: 64 });

                    const tokenToRestart = client.config.users.find(t => Buffer.from(client.decrypt(t).split('.')[0], 'base64').toString() == interaction.user.id);
                    if (tokenToRestart)
                    {
                        client.connected[interaction.user.id].terminate();
                        delete client.connected[interaction.user.id];
                        client.load_token(client.decrypt(tokenToRestart));
                    }

                    i.editReply({ content: 'Votre machine a redémarré' });
                    break;

                case 'edit-token':
                    const modal = new ModalBuilder()
                        .setTitle("Changement de token")
                        .setCustomId('token')
                        .setComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('token')
                                    .setLabel("Veuillez entrer votre token ici")
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            )
                        )

                    await i.showModal(modal);

                    const collector = await i.awaitModalSubmit({ time: 1000 * 60 * 10 }).catch(() => null);
                    if (!collector) return;
                    
                    await collector.deferReply({ flags: 64 })
                    const newToken = collector.fields.getTextInputValue('token');

                    const res = await fetch('https://discord.com/api/users/@me', { headers: { authorization: newToken } }).then(r => r.json()).catch(() => null);
                    if (!res || !res?.id)
                        return collector.editReply({ content: 'Le token est invalide' });

                    if (res.id !== interaction.user.id)
                        return collector.editReply({ content: "Le token n'est pas votre token" });
                    
                    const tokenToStop = client.config.users.find(t => Buffer.from(client.decrypt(t).split('.')[0], 'base64').toString() == interaction.user.id);
                    if (tokenToStop)
                    {
                        client.connected[interaction.user.id].terminate()
                        delete client.connected[interaction.user.id];
                    }
                    client.load_token(newToken);
                    collector.editReply({ content: 'Le changement de token a bien été effectué' });
                    break;
            }
        })

        /**
         * @returns {void}
        */
        function editMessage(){
            const embed = 
            {
                color: 0x000000,
                author: { name: `Abonnement de ${interaction.user.displayName}`, icon_url: interaction.user.avatarURL() },
                description: `- Etat: \`${db.enable ? '✅' : '❌'}\`\n- Expiration: **LIFETIME**\n- Prefix: \`${db ? db.prefix : '&'}\``,
                thumbnail: { url: 'https://i.imgur.com/K0X4z9g.png' },
                image: { url: `https://i.imgur.com/Xr849uE.jpeg` }
            };

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(client.connected[interaction.user.id] ? 'shutdown' : 'start')
                    .setStyle(client.connected[interaction.user.id] ? ButtonStyle.Danger : ButtonStyle.Success)
                    .setLabel(client.connected[interaction.user.id] ? 'Arrêter' : 'Démarrer'),

                new ButtonBuilder()
                    .setCustomId('restart')
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('Redémarrer')
                    .setDisabled(client.connected[interaction.user.id] ? false : true),

                new ButtonBuilder()
                    .setCustomId('edit-token')
                    .setLabel('Modifier le token')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(client.connected[interaction.user.id] ? false : true)
            )

            return msg.edit({ embeds: [embed], components: [row] });
        }
    },
    get data()
    {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setContexts([0, 1, 2])
            .setDescription(this.description)
    }
}
