const example = require('./Structures/files/exemple.json');
const Handler = require('./Structures/files/Handlers');
  const { spawn } = require("node:child_process");
const Selfbot = require('./Structures/files/Client');
const config = require('./config.json');
const Discord = require('discord.js');
const crypto = require('crypto');
const os = require('os');
const fs = require('fs');

const runtimeInfo = getRuntimeInfo();
if (runtimeInfo.runtime !== 'bun'){
    console.log("Veuillez lancer le script avec BUN !\nInstallation: npm i -g bun\nLancement: pm2 start index.js -n \"nom du projet\" --interpreter bun");
    process.exit(0);
}

if (!fs.existsSync('./Structures/backups'))
    fs.mkdirSync('./Structures/backups');

const manager = new Discord.Client({ 
    intents: Object.keys(Discord.GatewayIntentBits), 
    partials: [Discord.Partials.Channel, Discord.Partials.GuildMember, Discord.Partials.GuildScheduledEvent, Discord.Partials.Message, Discord.Partials.Reaction, Discord.Partials.ThreadMember, Discord.Partials.User], 
});
if (config.token) manager.login(config.token.includes('.') ? config.token : decrypt(config.token));

global.clients = {};
manager.connected = global.clients;
manager.config = config;
manager.emojis = { cross: "<:off:1327710569184366726>", check: "<:on:1345720302105002036>" }
manager.ms = x => ms(x);
manager.encrypt = x => encrypt(x);
manager.decrypt = x => decrypt(x);
manager.save_codes = () => saveCodes();
manager.token_push = x => pushAndSave(x);
manager.get_database = x => loadDatabase(x);
manager.load_token = async x => { const token = x.includes('.') ? x : decrypt(x); await loadClient(token) }
Handler.loadCommands(manager, "Manager/commands");
Handler.loadEvents(manager, "Manager/events");

for (const encryptToken of config.users.values())
    loadClient(encryptToken.includes('.') ? encryptToken : decrypt(encryptToken));


if (config.token.includes('.'))
{
    config.token = encrypt(config.token);
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
}





function saveCodes()
{
    const json_codes = fs.readFileSync('./Structures/files/codes.json', 'utf8');
    const codes = JSON.parse(json_codes);

    fs.writeFileSync('./Structures/files/codes.json', JSON.stringify(codes, null, 4));
}

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

async function loadDatabase(encrypted_token)
{
    const token = Number(encrypted_token) ? encrypted_token : encrypted_token.includes('.') ? encrypted_token : decrypt(encrypted_token);
    const userId = Number(encrypted_token) ? encrypted_token : Buffer.from(token.split('.')[0], 'base64').toString();
    const dbPath = `./Structures/databases/${userId}.json`;

    if (fs.existsSync(dbPath)) {
        const content = fs.readFileSync(dbPath, 'utf8');
        try {
            const parsed = JSON.parse(content);
            Object.keys(example)
                .filter(key => !Object.keys(parsed).includes(key))
                .forEach(key => parsed[key] = example[key]);

            Object.keys(example)
                .filter(key => typeof example[key] == 'object')
                .forEach(key => example[key] && Object.keys(example[key])
                    .filter(subKey => !Object.keys(parsed[key]).includes(subKey))
                    .forEach(subKey => parsed[key][subKey] = example[key][subKey])
            )

            fs.writeFileSync(dbPath, JSON.stringify(parsed, null, 4), 'utf-8');
            return parsed;
        } catch (e) {
            await fs.promises.writeFile(dbPath, JSON.stringify(example, null, 4), 'utf-8');
            return JSON.parse(JSON.stringify(example));
        }
    } else {
        await fs.promises.writeFile(dbPath, JSON.stringify(example, null, 4), 'utf-8');
        return JSON.parse(JSON.stringify(example));
    }
}


function pushAndSave(Encrypt_token)
{
    if (config.users.includes(Encrypt_token.includes('.') ? Encrypt_token : decrypt(Encrypt_token)))
        config.users = config.users.filter(user => user !== (Encrypt_token.includes('.') ? Encrypt_token : decrypt(Encrypt_token)));

    if (!config.users.includes(Encrypt_token.includes('.') ? encrypt(Encrypt_token) : Encrypt_token)) 
        config.users.push(Encrypt_token.includes('.') ? encrypt(Encrypt_token) : Encrypt_token);
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
}

async function loadClient(token)
{
    const userId = Buffer.from(token.split('.')[0], 'base64').toString();
    if (global.clients[userId] && typeof global.clients[userId].destroy === 'function') {
        try {
            await global.clients[userId].destroy();
        } catch (error) {
            console.error(`Error destroying existing client for ${userId}:`, error);
        }
    }

    if (!config.users.includes(encrypt(token))) pushAndSave(token);
    const database = await loadDatabase(token);
    if (database && !database.enable) return;

    new Selfbot({ token, database });
}


function decrypt(encryptedData)
{
    const key = crypto.pbkdf2Sync('oiizebfdddozuiebfouzebn', 'selUnique', 100000, 32, 'sha256');
    const iv = crypto.pbkdf2Sync('oiizebfdddozuiebfouzebn', 'selUnique', 100000, 16, 'sha256');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function encrypt(text)
{
    const key = crypto.pbkdf2Sync('oiizebfdddozuiebfouzebn', 'selUnique', 100000, 32, 'sha256');
    const iv = crypto.pbkdf2Sync('oiizebfdddozuiebfouzebn', 'selUnique', 100000, 16, 'sha256');

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function getRuntimeInfo() {
  const info = {
    runtime: 'unknown',
    version: null,
    executable: null
  };

  if (typeof process !== 'undefined') {
    if (typeof Bun !== 'undefined' || (process.versions && process.versions.bun)) {
      info.runtime = 'bun';
      info.version = process.versions?.bun || Bun.version;
    }
    
    else if (process.versions && process.versions.node) {
      info.runtime = 'node';
      info.version = process.versions.node;
    }

    info.executable = process.argv0;
  }

  return info;
}
async function errorHandler(error) {
    const errors = [ 0, 400, 10062, 10008, 50035, 40032, 50013, 40002]
    if (errors.includes(error.code)) return;

    console.error(error)
};

process.on("unhandledRejection", errorHandler);
process.on("uncaughtException", errorHandler);
process.on('warning', () => false);
