const {
    WAConnection: _WAConnection, 
    MessageType,
    WAMessageProto
} = require('@adiwajshing/baileys');
const {
    Collection 
} = require('@discordjs/collection');
const { color } = require('./function');

/**
 * Main Class with Modification / Simplified
 */
class WAConnection extends _WAConnection {
    constructor() {
        super()
        // Abaikan ini
        this.on('chat-update', (message) => {
            if (!message.hasNewMessage) return
            this.mek = message.messages.all()[0]
            this.mek.message = (Object.keys(this.mek.message)[0] === 'ephemeralMessage') ? this.mek.message.ephemeralMessage.message : this.mek.message
            if (this.mek.key.fromMe) return
            this.from = this.mek.key.remoteJid
        })
    }
    /**
     * Get list admin in Group
     * @param {string} jid 
     */
    async getGroupAdmin(jid) {
        if (!jid.endsWith('g.us')) throw new Error(color('[Baileys]', 'cyan'), color('Not a Group Jid!'));
        const metadata = await this.groupMetadata(jid)
        const adminlist = []
        for (let member of metadata.participants) {
            adminlist.push(member.isAdmin ? member.jid : '')
        }
        return adminlist
    }
    
    /**
     * Reply with text
     * @param {string} text 
     */
    replyWithText(text) {
        this.sendMessage(this.from, text, MessageType.text, {
            quoted: this.mek
        })
    }
}

module.exports = {
    WAConnection,
    Collection
}