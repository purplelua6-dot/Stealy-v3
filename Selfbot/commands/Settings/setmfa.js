const { Client, Message } = require('legend.js');
const { vanity_defender } = require('../../../Structures/files/Ticket');

module.exports = {
    name: "setmfa",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        if (!args[0]) 
            return message.edit(client.language(
                `*Veuillez entrer une clé d'A2F ou mot de passe valide.*`,
                `*Please enter a valid MFA key or password.*`
            ));
                
            client.db.mfa_key = args.slice(0).join(' ').replaceAll(' ', '');
            client.save();

            vanity_defender(client);

            message.edit(client.language(
                `*Votre clé d'A2F a été Mise à jour.*`,
                `*Your MFA key has been updated.**`
            ));
    }
}