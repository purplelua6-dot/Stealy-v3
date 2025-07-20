const { Client, Message } = require("legend.js");

module.exports = {
    name: "url",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {

        if (!args[0]) 
            return message.edit(client.language(
                `*Veuillez fournir un \`server_id\` pour snipe son url*`,
                `*Please give an \`server_id\` to snipe its url*`
            ));

        if (args[0] === "list")
            return message.edit(client.language(
                `*Liste des urls snipées : * \n\n${!client.db.snipe_url.length ? "*Aucune URL snipée pour l'instant*" : client.db.snipe_url.map(entry => `*ID : * \`${entry.guildID}\` - *URL : * \`${entry.vanityURL}\` - *Server : * \`${client.guilds.get(entry.guildID)?.name || entry.guildID}\`\n`).join('\n')}`, 
                `*Sniped URLs list : *\n${client.db.snipe_url.length === 0 ? "*No URL sniped right now.*" : client.db.snipe_url.map(entry => `*ID : * \`${entry.guildID}\` - *URL : * \`${entry.vanityURL}\` - *Server : * \`${client.guilds.get(entry.guildID)?.name || entry.guildID}\`\n`).join('\n')}`
            ));

        if (args[0] === "stop") {
            if (!client.db.snipe_url.find(c => c.guildID === args[1])) 
                return message.edit(client.language(
                    `*Aucun serveur de snipe de trouvé.*`,
                    `*No guild found in snipe.*`
                ));

            client.db.snipe_url = client.db.snipe_url.filter(c => c.guildID !== args[1]);
            client.save();
            return message.edit(client.language(
                `*Le serveur a été retiré du snipeur.*`,
                `*The url has been removed from the snipe.*`
            ));
        }
        if (args[0] === "clear") {
            client.db.snipe_url = []
            client.save()
            return message.edit(client.language(
                `*Tous les snipes ont été supprimés.*`, 
                `*All the snipe has been deleted.*`
            ));
        }

        if (!client.db.mfa_key) 
            return message.edit(client.language(
                `*Veuillez d'abord configurer votre mot de passe/clé A2F avec la commande \`${client.db.prefix}setmfa\`.*`, 
                `*Please configure first your password/mfa key with the command \`${client.db.prefix}setmfa\`.*`
            ));

        if (!message.guild) 
            return message.edit(client.language(
                `*Vous devez faire la commande sur un serveur.*`, 
                `*You need to send this command on a guild where you put the new URL.*`
            ));

        if (args[0] == 'claim') {
            if (!args[1]) 
                return message.edit(client.language(
                    `*Veuillez entrer une vanity valide.*`,
                    `*Please enter a valid vanity.*`
                ));

            message.edit(client.language(`*La vanity \`${args[1]}\` a bien été mise sur le serveur.*`, `*The vanity \`${args[1]}\` has successfully set in the server.*`))
        } 
        
        else {
            const guild = client.guilds.get(args[0]) || message.guild.id;
            
            if (!guild) 
                return message.edit(client.language(
                    `*Veuillez spécifier l'ID du serveur.*`,
                    `*Please specify a guild ID.*`
                ));
            
            if (!guild.vanityURLCode) 
                return message.edit(client.language(
                    `*Ce serveur n'a pas de URL de vanity.*`,
                    `*This guild doesn't have a vanity URL.*`
                ));

            const webhook = await message.channel.createWebhook(`› Stealy`, { avatar: `https://senju.cc/images/Speed.png` }).catch(() => false);
            client.db.snipe_url.push({
                vanityURL: guild.vanityURLCode,
                guildID: guild.id,
                webhookURL: client.db.logger.snipe_url ?? webhook.url ?? null
            })

            client.save();
            message.edit(client.language(
                `*Je snipe : \`${guild.vanityURLCode}\`*\n-# ***___› Stealy___***`, 
                `*I snipe : \`${guild.vanityURLCode}\`*\n-# ***___› Stealy___***`
            ));
        }
    }
};