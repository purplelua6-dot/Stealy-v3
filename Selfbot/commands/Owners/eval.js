const { Client, Message } = require("legend.js");

module.exports = {
    name: "eval",
    developer: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) return message.edit(client.language(`*Veuillez fournir un script valide.*`, `*Please provide a valid script.*`));
        try {
            let code = await eval(args.join(" "));
            if (typeof code !== 'string') code = require('node:util').inspect(code, { depth: 0 });
            message.edit(`***📥 Entrée :***\n\`\`\`js\n${args.join(" ")}\`\`\`\n\n***📤 Sortie :***\n\`\`\`js\n${code}\n\`\`\``)
        } catch (e) {
            message.edit(`\`\`\`js\n${e}\n\`\`\``)
        }
    }
};