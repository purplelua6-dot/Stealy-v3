const { REST } = require('@discordjs/rest');
const { Events, Routes } = require('discord.js');
const fs = require('node:fs');
const commands = new Array();

const folderPath = fs.readdirSync(`./Manager/commands`)
module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Discord.Client} client
    */
    run: async client => {
        console.log(`[MANAGER] ${client.user.displayName} est connecté`);

        for (const folder of folderPath.values()) {
            const files = fs.readdirSync(`./Manager/commands/${folder}`)
                          .filter(f => f.endsWith(".js"));

            for (const file of files) {
                const fileData = require(`../../commands/${folder}/${file}`);
                if (fileData.data) commands.push(fileData.data.toJSON());
            }
        }

        const rest = new REST({ version: '10' }).setToken(client.token);
        rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    }
}