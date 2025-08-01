"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearGuild = exports.loadChannel = exports.loadCategory = exports.fetchTextChannelData = exports.fetchChannelMessages = exports.fetchVoiceChannelData = exports.fetchChannelPermissions = void 0;
const discord_js_1 = require("legend.js");
const allPermissions = Object.keys(discord_js_1.Permissions.FLAGS);

/**
 * Gets the permissions for a channel
 */
function fetchChannelPermissions(channel) {
    const permissions = [];
    if (channel.permissionOverwrites) channel.permissionOverwrites
        .filter((p) => p.type === 0)
        .forEach((perm) => {
            // For each overwrites permission
            const role = channel.guild.roles.get(perm.id);
            if (role) {
                const allowPermissions = [];
                const denyPermissions = [];

                allPermissions.forEach(permission => {
                    if (perm.allow.has(permission)) {
                        allowPermissions.push(permission);
                    } else if (perm.deny.has(permission)) {
                        denyPermissions.push(permission);
                    }
                });

                permissions.push({
                    roleName: role.name,
                    allow: allowPermissions,
                    deny: denyPermissions
                });
            }
        });
    return permissions;
}
exports.fetchChannelPermissions = fetchChannelPermissions;
/**
 * Fetches the voice channel data that is necessary for the backup
 */
async function fetchVoiceChannelData(channel) {
    return new Promise(async (resolve) => {
        const channelData = {
            type: "voice",
            name: channel.name,
            bitrate: channel.bitrate,
            userLimit: channel.userLimit,
            parent: channel.parent ? channel.parent.name : null,
            permissions: fetchChannelPermissions(channel)
        };
        /* Return channel data */
        resolve(channelData);
    });
}
exports.fetchVoiceChannelData = fetchVoiceChannelData;
async function fetchChannelMessages(channel, options) {
    let messages = [];
    const messageCount = isNaN(options.maxMessagesPerChannel) ? 10 : options.maxMessagesPerChannel;
    const fetchOptions = { limit: 100 };
    let lastMessageId;
    let fetchComplete = false;

    if (messageCount == 0) return messages;

    while (!fetchComplete) {
        if (lastMessageId) {
            fetchOptions.before = lastMessageId;
        }
        try {
            const fetched = await channel.fetchMessages(fetchOptions);
            if (fetched.size === 0) {
                break;
            }
            lastMessageId = fetched.last().id;
        await Promise.all(fetched.map(async (msg) => {
            if (!msg.author || messages.length >= messageCount) {
                fetchComplete = true;
                return;
            }
            const files = await Promise.all(msg.attachments.map(async (a) => {
                let attach = a.url;
                if (a.url && ['png', 'jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi'].includes(a.url.split('.').pop().toLowerCase())) {
                    if (options.saveImages && options.saveImages === 'base64') {
                        attach = await fetchIcon(a.url);
                    }
                }
                return {
                    name: a.filename,
                    attachment: attach
                };
            }));


            messages.push({
                username: msg.author.username,
                avatar: msg.author.avatarURL,
                content: msg.content,
                embeds: msg.embeds.map(embed => ({
                    title: embed.title,
                    type: embed.type,
                    description: embed.description,
                    color: embed.color,
                    thumbnail: embed.thumbnail ? { url: embed.thumbnail.url } : null,
                    image: embed.image ? embed.image.url : null,
                    footer: embed.footer ? {
                        text: embed.footer.text,
                        iconURL: embed.footer.iconURL
                    } : null,
                    author: embed.author ? {
                        name: embed.author.name,
                        iconURL: embed.author.iconURL
                    } : null,
                    fields: embed.fields.map(field => ({
                        name: field.name,
                        value: field.value,
                        inline: field.inline
                    })),
                    timestamp: embed.timestamp,
                    url: embed.url
                })),
                files,
                pinned: msg.pinned,
                sentAt: msg.createdAt.toISOString(),
            });
        }));
        } catch (error) {
            console.log('Error fetching messages:', error.message);
            break;
        }
    }

    return messages;
}
exports.fetchChannelMessages = fetchChannelMessages;
/**
 * Fetches the text channel data that is necessary for the backup
 */
async function fetchTextChannelData(channel, options) {
    return new Promise(async (resolve) => {
        const channelData = {
            type: channel.type,
            name: channel.name,
            nsfw: channel.nsfw,
            rateLimitPerUser: channel.type === "text" ? channel.rateLimitPerUser : undefined,
            parent: channel.parent ? channel.parent.name : null,
            topic: channel.topic,
            permissions: fetchChannelPermissions(channel),
            messages: [],
            isNews: channel.type === "news",
            threads: []
        };
        /* Fetch channel messages */
        try {
            channelData.messages = await fetchChannelMessages(channel, options);
            /* Return channel data */
            resolve(channelData);
        }
        catch {
            resolve(channelData);
        }
    });
}
exports.fetchTextChannelData = fetchTextChannelData;
/**
 * Creates a category for the guild
 */
async function loadCategory(categoryData, guild) {
    return new Promise((resolve) => {
        const finalPermissions = [];
        categoryData.permissions.forEach((perm) => {
            const role = guild.roles.find((r) => r.name === perm.roleName);
            if (role) {
                finalPermissions.push({
                    id: role.id,
                    allow: perm.allow,
                    deny: perm.deny
                });
            }
        });

        guild.createChannel(categoryData.name, {
            type: "category",
            permissionOverwrites: finalPermissions
        }).then(async (category) => {
            resolve(category); // Return the category
        });
    });
}
exports.loadCategory = loadCategory;
/**
 * Create a channel and returns it
 */
async function loadChannel(channelData, guild, category, options) {
    return new Promise(async (resolve) => {
        const loadMessages = (channel, messages, previousWebhook) => {
            return new Promise(async (resolve) => {
                const webhook = previousWebhook || await channel.createWebhook('MessagesBackup', channel.client.user.avatarURL).catch(() => { });
                if (!webhook)
                    return resolve();
                messages = messages
                    .filter((m) => m.content.length > 0 || m.embeds.length > 0 || m.files.length > 0)
                    .reverse();
                messages = messages.slice(messages.length - options.maxMessagesPerChannel);
                for (const msg of messages.values()) {
                    const sentMsg = await webhook
                        .send(msg.content.length ? msg.content : null, {
                            username: msg.username,
                            avatarURL: msg.avatar,
                            embeds: msg.embeds,
                            files: msg.files.map((f) => new discord_js_1.Attachment(f.attachment, f.name ?? "Backup")),
                            allowedMentions: options.allowedMentions,
                            threadId: channel.type == "thread" ? channel.id : undefined
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });
                    if (msg.pinned && sentMsg)
                        await sentMsg.pin();
                }
                resolve(webhook);
            });
        };
        const createOptions = {
            type: null,
            parent: category
        };
        if (channelData.type === "text" || channelData.type === "news") {
            createOptions.topic = channelData.topic;
            createOptions.nsfw = channelData.nsfw;
            createOptions.rateLimitPerUser = channelData.rateLimitPerUser;
            createOptions.type =
                channelData.isNews && guild.features.includes("news") ? "news" : "text";
        }
        else if (channelData.type === "voice") {
            createOptions.bitrate = 64000;
            createOptions.userLimit = channelData.userLimit;
            createOptions.type = "voice";
        }
        const finalPermissions = [];
        channelData.permissions.forEach((perm) => {
            const role = guild.roles.find((r) => r.name === perm.roleName);
            if (role) {
                finalPermissions.push({
                    id: role.id,
                    allow: perm.allow,
                    deny: perm.deny
                });
            }
        });

        createOptions.permissionOverwrites = finalPermissions;

        try {
            const channel = await guild.createChannel(channelData.name, createOptions);
            if (channel && createOptions.parent) {
                await channel.setParent(createOptions.parent).catch(() => {});
            }
            
            if (channelData.type === "text") {
                /* Load messages */
                let webhook;
                if (channelData.messages.length > 0) {
                    webhook = await loadMessages(channel, channelData.messages).catch(() => { });
                }
                resolve(channel);
            }
            else {
                resolve(channel); // Return the channel
            }
        } catch (error) {
            console.log(`Error creating channel ${channelData.name}:`, error.message);
            resolve(null);
        }
    });

}
exports.loadChannel = loadChannel;
/**
 * Delete all roles, all channels, all emojis, etc... of a guild
 */
async function clearGuild(guild) {
    try {
        // Delete channels first (faster and less rate limited)
        const channels = guild.channels.array();
        for (const channel of channels) {
            try {
                await channel.delete();
                await new Promise(r => setTimeout(r, 100)); // Small delay
            } catch (error) {
                console.log(`Error deleting channel ${channel.name}:`, error.message);
            }
        }

        // Delete roles (except @everyone and managed roles)
        const roles = guild.roles
            .filter((role) => !role.managed && role.editable && role.id !== guild.id)
            .array();
        
        for (const role of roles) {
            try {
                await role.delete();
                await new Promise(r => setTimeout(r, 200)); // Delay for roles
            } catch (error) {
                console.log(`Error deleting role ${role.name}:`, error.message);
            }
        }

        // Delete emojis
        const emojis = guild.emojis.array();
        for (const emoji of emojis) {
            try {
                await emoji.delete();
                await new Promise(r => setTimeout(r, 100));
            } catch (error) {
                console.log(`Error deleting emoji ${emoji.name}:`, error.message);
            }
        }

        // Delete webhooks
        try {
            const webhooks = await guild.fetchWebhooks();
            for (const webhook of webhooks.array()) {
                try {
                    await webhook.delete();
                    await new Promise(r => setTimeout(r, 100));
                } catch (error) {
                    console.log(`Error deleting webhook:`, error.message);
                }
            }
        } catch (error) {
            console.log('Error fetching webhooks:', error.message);
        }

        // Unban users
        try {
            const bans = await guild.fetchBans();
            for (const ban of bans.array()) {
                try {
                    await guild.unban(ban.user);
                    await new Promise(r => setTimeout(r, 200));
                } catch (error) {
                    console.log(`Error unbanning user:`, error.message);
                }
            }
        } catch (error) {
            console.log('Error fetching bans:', error.message);
        }

        // Reset guild settings
        try {
            await guild.setAFKChannel(null);
            await guild.setAFKTimeout(60 * 5);
            await guild.setIcon(null);
            await guild.setBanner(null).catch(() => {});
            await guild.setSplash(null).catch(() => {});
            await guild.setSystemChannel(null).catch(() => {});
        } catch (error) {
            console.log('Error resetting guild settings:', error.message);
        }

    } catch (error) {
        console.log('Error in clearGuild:', error.message);
    }
    
    return;
}

async function fetchIcon(imageURL) {
    return await fetch(imageURL)
        .then(res => res.arrayBuffer())
        .then(buf => Buffer.from(buf).toString('base64'));
}

/**
 * Retry function for critical operations
 */
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            console.log(`Operation failed (attempt ${i + 1}/${maxRetries}):`, error.message);
            if (i === maxRetries - 1) throw error;
            await new Promise(r => setTimeout(r, delay * (i + 1))); // Exponential backoff
        }
    }
}

exports.clearGuild = clearGuild;
exports.retryOperation = retryOperation;
