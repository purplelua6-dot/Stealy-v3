"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEmbedChannel = exports.loadBans = exports.loadEmojis = exports.loadAFK = exports.loadChannels = exports.loadRoles = exports.loadConfig = void 0;
const discord_js_1 = require("discord.js");
const util_1 = require("./util");
/**
 * Restores the guild configuration
 */
const loadConfig = (guild, backupData) => {
    const configPromises = [];
    if (backupData.name) {
        configPromises.push(guild.setName(backupData.name));
    }
    if (backupData.iconBase64) {
        configPromises.push(guild.setIcon(Buffer.from(backupData.iconBase64, 'base64')));
    }
    else if (backupData.iconURL) {
        configPromises.push(guild.setIcon(backupData.iconURL));
    }
    if (backupData.splashBase64) {
        configPromises.push(guild.setSplash(Buffer.from(backupData.splashBase64, 'base64')));
    }
    else if (backupData.splashURL) {
        configPromises.push(guild.setSplash(backupData.splashURL));
    }
    if (backupData.bannerBase64) {
        configPromises.push(guild.setBanner(Buffer.from(backupData.bannerBase64, 'base64')));
    }
    else if (backupData.bannerURL) {
        configPromises.push(guild.setBanner(backupData.bannerURL));
    }
    if (backupData.verificationLevel) {
        configPromises.push(guild.setVerificationLevel(backupData.verificationLevel));
    }
    if (backupData.defaultMessageNotifications) {
        configPromises.push(guild.setDefaultMessageNotifications(backupData.defaultMessageNotifications));
    }
    const changeableExplicitLevel = guild.features.includes(discord_js_1.GuildFeature.Community);
    if (backupData.explicitContentFilter && changeableExplicitLevel) {
        configPromises.push(guild.setExplicitContentFilter(backupData.explicitContentFilter));
    }
    return Promise.all(configPromises);
};
exports.loadConfig = loadConfig;
/**
 * Restore the guild roles
 */
const loadRoles = async (guild, backupData) => {
    const createdRoles = [];
    
    // Sort roles by position to maintain hierarchy (lowest position first)
    const sortedRoles = backupData.roles.sort((a, b) => (a.position || 0) - (b.position || 0));
    
    // First, edit the @everyone role
    const everyoneRole = sortedRoles.find(role => role.isEveryone);
    if (everyoneRole) {
        try {
            await guild.roles.get(guild.id).edit({
                name: everyoneRole.name,
                color: everyoneRole.color,
                permissions: everyoneRole.permissions,
                mentionable: everyoneRole.mentionable
            });
            console.log(`Successfully edited @everyone role`);
        } catch (error) {
            console.log(`Error editing @everyone role:`, error.message);
        }
    }
    
    // Then create other roles sequentially to maintain proper hierarchy
    for (const roleData of sortedRoles) {
        if (!roleData.isEveryone) {
            try {
                const createdRole = await guild.createRole({
                    name: roleData.name,
                    color: roleData.color,
                    hoist: roleData.hoist,
                    permissions: roleData.permissions,
                    mentionable: roleData.mentionable
                });
                createdRoles.push(createdRole);
                
                // Add delay between role creations to avoid rate limits
                await new Promise(r => setTimeout(r, 500));
            } catch (error) {
                console.log(`Error creating role ${roleData.name}:`, error.message);
            }
        }
    }
    
    return createdRoles;
};
exports.loadRoles = loadRoles;
/**
 * Restore the guild channels
 */
const loadChannels = async (guild, backupData, options) => {
    const allCreations = [];

    for (const categoryData of backupData.channels.categories.values()) {
        const createdCategory = await util_1.loadCategory(categoryData, guild);
        await new Promise(r => setTimeout(r, 500));

        for (const channelData of categoryData.children.values()) {
            allCreations.push(async () => {
                util_1.loadChannel(channelData, guild, createdCategory, options)
            });
        }
    }

    backupData.channels.others.forEach((channelData) => {
        allCreations.push(async () => {
            util_1.loadChannel(channelData, guild, null, options);
        });
    });

    for (let i = 0; i < allCreations.length; i += 4) {
        const batch = allCreations.slice(i, i + 4);
        await Promise.all(batch.map(fn => fn()));
        await new Promise(r => setTimeout(r, 4000));
    }
};
exports.loadChannels = loadChannels;
/**
 * Restore the afk configuration
 */
const loadAFK = (guild, backupData) => {
    const afkPromises = [];
    if (backupData.afk) {
        afkPromises.push(guild.setAFKChannel(guild.channels.find((ch) => ch.name === backupData.afk.name && ch.type === discord_js_1.ChannelType.GuildVoice)));
        afkPromises.push(guild.setAFKTimeout(backupData.afk.timeout));
    }
    return Promise.all(afkPromises);
};
exports.loadAFK = loadAFK;
/**
 * Restore guild emojis
 */
const loadEmojis = (guild, backupData) => {
    const emojiPromises = [];
    backupData.emojis.forEach((emoji) => {
        if (emoji.url) {
            emojiPromises.push(guild.createEmoji(
                emoji.url,
                emoji.name
            ));
        }
        else if (emoji.base64) {
            emojiPromises.push(guild.createEmoji(
                Buffer.from(emoji.base64, 'base64'),
                emoji.name,
            ));
        }
    });
    return Promise.all(emojiPromises);
};
exports.loadEmojis = loadEmojis;
/**
 * Restore guild bans
 */
const loadBans = (guild, backupData) => {
    const banPromises = [];
    backupData.bans.forEach((ban) => {
        banPromises.push(guild.members.ban(ban.id, {
            reason: ban.reason
        }));
    });
    return Promise.all(banPromises);
};
exports.loadBans = loadBans;
/**
 * Restore embedChannel configuration
 */
const loadEmbedChannel = (guild, backupData) => {
    const embedChannelPromises = [];
    if (backupData.widget.channel) {
        embedChannelPromises.push(guild.setWidgetSettings({
            enabled: backupData.widget.enabled,
            channel: guild.channels.find((ch) => ch.name === backupData.widget.channel)
        }));
    }
    return Promise.all(embedChannelPromises);
};
exports.loadEmbedChannel = loadEmbedChannel;
