// Baileys Modified
const {
    Collection,
    WAConnection
} = require('../lib/modified')
// Baileys Default
const {
    MessageType
} = require('@adiwajshing/baileys')
const config = require(`../config.json`)
// Modules Import
const fs = require('fs');
const { color } = require('../lib/function');
const mess = require('./lang/ind.js')

// Read Plugin
const plugin = new Collection();
const pluginFiles = fs.readdirSync('./plugin').filter(file => file.endsWith('.js'))
for (let files of pluginFiles) {
    const plugins = require(`../plugin/${files}`)
    plugin.set(plugins.name, plugins)
}


// Configuration
const prefix = /^[#!$/&-]/

/**
 * Message Handler && Chat Handler
 */
const msgHandler = async (client = new WAConnection()) => {
    client.on('chat-update', async (message) => {
        try {
            if (!message.hasNewMessage) return
            const { messages, t } = message
            let mek = messages.all()[0]
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (!mek.message) return
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (mek.key.fromMe) return
            const content = JSON.stringify(mek.message)
            const from = mek.key.remoteJid
            let { conversation, videoMessage, imageMessage, extendedTextMessage } = mek.message
            const { text, video, extendedText, product, audio, sticker, image, liveLocation, location, document, contact, listMessage, buttonsMessage } = MessageType
            const body = conversation ? conversation : videoMessage ? videoMessage.caption : imageMessage ? imageMessage.caption : extendedTextMessage ? extendedTextMessage.text : ''
            const commandsName = body.slice(1).trim().split(" ").shift().toLowerCase()
            const args = body.trim().split(" ").slice(1)
            const isCmd = prefix.test(commandsName)
            const commandPlugin = plugin.get(commandsName) || plugin.find(pluginss => pluginss.aliases && pluginss.aliases.includes(commandsName))
            // Validator & Configuration
            const botNumber = client.user.jid
            const ownerNumber = [`${config.ownerNumber}@s.whatsapp.net`]
            const isGroup = from.endsWith('g.us')
            const sender = isGroup ? mek.participant : mek.key.remoteJid
            const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
            const groupName = isGroup ? groupMetadata.subject : ''
            const groupJid = isGroup ? groupMetadata.jid : ''
            const groupMember = isGroup ? groupMetadata.participants : ''
            const groupAdmin = isGroup ? await client.getGroupAdmin(from) : ''
            const isBotGroupAdmin = groupAdmin.includes(botNumber) || false
            const isGroupAdmin = groupAdmin.includes(sender) || false
            const isOwner = ownerNumber.includes(sender)
            let mentioned
            // Check if is mentioned or not
            try {
                mek.message.extendedTextMessage.contextInfo.mentionedJid[0].endsWith('s.whatsap.net')
                mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
            } catch(error) {
                mentioned = false
            }
            
            if (commandPlugin) {
                if (!isCmd) return
                commandPlugin.execute(client)
            } else {
                switch(commandsName) {
                    case 'ping':
                        client.replyWithText('Pong!');
                    break
                    default:
                        if (isCmd) {
                            client.replyWithText('Fitur itu tidak ada bosku')
                        }
                }
            }
            // Abaikan
            // msgConfig.push(mek, message)
        } catch (error) {
            console.log(error)
        }
    })
}

module.exports = msgHandler
