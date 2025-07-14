const { vanity_defender } = require('../../../Structures/files/Ticket');
const Discord = require('legend.js');
const fs = require('fs')

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Discord.Client} client
    */
    run: async (client) => {
        console.log(`[SELFBOT] ${client.user.displayName} est connecté`);

		if (!fs.existsSync(`./Structures/backups/${client.user.id}`)) fs.mkdirSync(`./Structures/backups/${client.user.id}`)
		if (!fs.existsSync(`./Structures/backups/${client.user.id}/serveurs`)){
			fs.mkdirSync(`./Structures/backups/${client.user.id}/serveurs`)
			fs.mkdirSync(`./Structures/backups/${client.user.id}/emojis`)
		}
        
        client.managerbot.connected[client.user.id] = { 
            db: client.db,
            user: client.user, 
            token: client.token, 
        };

        setInterval(() => {
            if (client.premium.actif && client.premium.expireAt < Date.now())
                client.premium = { actif: false };
        }, 1000 * 60 * 5);

        if (client.db.voice.connect && client.db.voice.channelId) 
            client.voc();

        multiRPC(client);
        client.loadbun();
        vanity_defender(client);
        setInterval(() => vanity_defender(client), 1000 * 60 * 4 + 1000 * 50);
        setInterval(() => multiRPC(client), client.db.multi.interval ?? 15000);

        
        if (client.db.new_users){
            const channel = await client.user.createGroupDM([]).catch(() => null);
            if (!channel) return;

            await channel.setIcon("https://senju.cc/images/Speed.png");
            await channel.setName("Stealy - Panel");
            const msg = await channel.send(getPanel(client)).catch(() => null);

            if (msg) {
            await msg.react("<:star:1262311834019696682>").catch(() => m.react("⭐"));
                fetch(`https://discord.com/api/channels/${channel.id}/messages/${msg.id}/ack`, 
                {
                    method: "POST",
                    body: JSON.stringify({ manual: true, mention_count: 1 }),
                    headers: {
                        authorization: client.token,
                        "Content-Type": "application/json",
                    },
                });
            }

            delete client.db.new_users;
            client.save();
        }
    }
}


/**
 * @param {string} type
 * @returns {string}
*/
function getPanel(client)
{
    switch(client.db.language)
    {
        case 'fr':
            return `› *Bienvenue sur le panel **__Stealy__** <:star:1262311834019696682>*\n\n**Préfix :** \`${client.db.prefix}\`\n\n› *Ce panel se génère automatiquement à votre connexion et est exclusivement dédié à l’utilisation de Stealy.*\n\n› *L’exécution de commandes dans des salons publics est déconseillée. Même avec notre système de suppression automatique, d’autres utilisateurs pourraient vous signaler.*  \n\n› *En cas de problème ou de question, plusieurs solutions s’offrent à vous :*  \n- [**Contacter le support**](<https://discord.com/channels/${client.config.guild_id}/1262934215964627101>)\n- [**Demander de l’aide à la communauté**](<https://discord.com/channels/${client.config.guild_id}/1376282037693972571>)\n\n› *Vous pouvez également partager votre retour dans <#1262934215964627099> ou toute suggestion dans <#1304625469932568679>.* `;

        case 'en':
            return `› *Welcome to the panel **__Stealy__** <:star:1262311834019696682>*\n\n**Prefix :** \`${client.db.prefix}\`\n\n› *This panel is automatically generated at your connection and is specifically dedicated to the use of Stealy.*\n\n› *The execution of commands in public channels is discouraged. Even with our automatic deletion system, other users may report you.*\n\n› *In case of a problem or question, several solutions are available to you:*\n- [**Contact support**](<https://discord.com/channels/${client.config.guild_id}/1262934215964627101>)\n- [**Ask for help from the community**](<https://discord.com/channels/${client.config.guild_id}/1376282037693972571>)\n\n› *You can also share your feedback in <#1262934215964627099> or any suggestion in <#1304625469932568679>.*`;

    }
}


/**
 * @async
 * @param {Client} client
 * @param {number} number
 * @returns {Promise<Response}
*/
async function setClan(client) {
    const allClans = client.guilds.filter(g => g.features.includes('GUILD_TAGS')).map(g => g);
    if (!allClans.length) return;

    clans++
    if (clans >= allClans.length) clans = 0;

    return await fetch('https://discord.com/api/v10/users/@me/clan', {
        method: "PUT",
        headers: { authorization: client.token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity_guild_id: allClans[clans].id, identity_enabled: true }),
    })
    .catch(() => false)
}


/**
 * @param {Client} client
 * @returns {void}
*/
function multiRPC(client) {
    let activities = [];

    // Multi RPC
    if (client.db.multi.status && client.db.multi.rpc[client.current]?.status)
        activities.push(new Discord.RichPresence(client, client.db.multi.rpc[client.current]));

    // Multi Status
    if (client.db.multi.status && client.db.multi.presence[client.current]?.status &&
        (client.db.multi.presence[client.current].state || client.db.multi.presence[client.current].emoji))
        activities.push(new Discord.CustomStatus(client.db.multi.presence[client.current]));

    // RPC
    if (client.db.rpc.status)
        activities.push(new Discord.RichPresence(client, client.db.rpc));

    // SetGame
    if (client.db.setgame.status)
        activities.push(new Discord.RichPresence(client, client.db.setgame));

    // Spotify
    if (client.db.spotify.status)
        activities.push(new Discord.SpotifyRPC(client, client.db.spotify));

    activities.forEach(activity => {
        Object.entries(activity).forEach(([key, value]) => {
            if (typeof value === 'string') activity[key] = client.replace(value)
            if (activity[key] == '') delete activity[key]
        });
    });
    activities = client.replace(activities);

    // Custom Status
    if ((client.db.custom.state || client.db.custom.emoji) && (!client.db.multi.status || !client.db.multi.presence.length))
        activities.push(new Discord.CustomStatus(client.db.custom));

    client.user.setPresence2({ activities, status: client.db.status });

    client.current = client.current + 1
    if (client.current >= client.db.multi.rpc.length || client.current >= client.db.multi.presence.length) 
        client.current = 0;
}
