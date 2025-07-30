const { Client, Message } = require("legend.js");
const fs = require('node:fs');

module.exports = {
    name: "vip",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const json_codes = fs.readFileSync('./Structures/files/codes.json', 'utf8');
        const codes = JSON.parse(json_codes);

        if (!args[0] && !client.premium.actif) return message.edit(`***Vous n'êtes VIP***`);
        if (client.premium.actif) return message.edit(client.language(
            `***__› Stealy - VIP__*** <a:star:1345073135095123978>
            > ***Code***・\`${client.premium.code}\`
            > ***Expire***・<t:${Math.round(client.premium.expiresAt / 1000)}:R>
            > ***Utilisé***・<t:${Math.round(client.premium.redeemedAt / 1000)}:R>`.replaceAll('  ', ''),
            `***__› Stealy - VIP__*** <a:star:1345073135095123978>
            > ***Code***・\`${client.premium.code}\`
            > ***Expire***・<t:${Math.round(client.premium.expiresAt / 1000)}:R>
            > ***Used***・<t:${Math.round(client.premium.redeemedAt / 1000)}:R>`.replaceAll('  ', '')
        ))

        if (!Object.keys(codes).includes(args[0].toLowerCase())) return message.edit(`***Le code \`${args[0]}\` est invalide***`);
        if (codes[args[0]].used) return message.edit(`***Le code est déjà utilisé par une autre personne***`);

        codes[args[0]] = {
            used: true,
            actif: true,
            code: args[0],
            by: client.user.id,
            expiresAt: codes[args[0]].expiresAt == 0 ? 0 : Date.now() + ms(codes[args[0]].expiresAt),
            redeemedAt: Date.now()
        }

        client.premium = codes[args[0]];

        fs.writeFileSync('./Structures/files/codes.json', JSON.stringify(codes, null, 4));
        message.edit(`***Vous avez activé la version premium du bot !***`);
    }
};

function ms(timeString) {
    const match = timeString.match(/(\d+)([smhdwy])/);
    if (!match) return null;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        case 'w': return value * 7 * 24 * 60 * 60 * 1000;
        case 'y': return value * 365 * 24 * 60 * 60 * 1000;
        default: return null;
    }
}