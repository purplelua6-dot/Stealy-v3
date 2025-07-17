const { Client, Message } = require('legend.js');
const { owner } = require('../Owners/paypal');

module.exports = {
    name: "setmfa",
    owner: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {

        switch(args[0])
        {
            default : 
            message.edit(client.language(
                `***___› Stealy ___*** \<a:star:1345073135095123978>
                \`${client.db.prefix}setmfa <mfa/psw> <key/password>\` › Mettre à jour votre clé d'A2F ou votre mot de passe.`.replaceAll('  ', ''),
                `***___› Stealy ___*** \<a:star:1345073135095123978>
                \`${client.db.prefix}setmfa <mfa/psw> <key/password>\` › Update your MFA key or your password.`.replaceAll('  ', '')
            ));
            break

            case "mfa" : 
            if (!args[1]) return message.edit(client.language(
                `Veuilllez définir une clé`,
                `Please define a key`
            ))
            else
            {
                client.db.mfa.type = "totp";
                client.db.mfa.key = args[1].replaceAll(' ',  '');
                client.save();
                message.edit(client.language(
                    `*Votre clé d'A2F a été Mise à jour.*`,
                    `*Your MFA key has been updated.*`
                ));
            }
            break;

            case "psw" : 
            if (!args[1]) return message.edit(client.language(
                `Veuilllez définir un mot de passe`,
                `Please define a password`
            ))
            else
            {
                client.db.mfa.type = "psw";
                client.db.mfa.key = args[1].replaceAll('  ',  '');
                client.save();
                
                message.edit(client.language(
                    `*Votre mot de passe a été mis à jour.*`,
                    `*Your password has been updated.*`
                ));
            }
            break;
        }
    }
}