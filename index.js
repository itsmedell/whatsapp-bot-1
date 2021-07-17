const {
    WAConnection
} = require('./lib/modified');
const fs = require('fs');

// Handler && Function Loader
const {
    eventHandler,
    msgHandler
} = require('./handler/exports');
const {
    color,
    banner
} = require('./lib/function')

/**
 * Start Function
 */
const starts = async (client = new WAConnection()) => {
    // Entahlah w gk tau fungsi ini apaan
    client.version = [2, 2126, 7]
    client.logger.level = 'warn'

    // Scan kode qr
    client.on('qr', () => {
        console.log(color('[System]', 'cyan'), color('Mohon scan kode qr diatas!'))
    })

    // Load Auth Info
    fs.existsSync('./session.json') && client.loadAuthInfo('./session.json');
    client.on('connecting', () => {
        console.log(color('[Baileys]', 'cyan'), color('Connecting...'))
    })

    client.on('open', () => {
        console.log(color('[Baileys]', 'cyan'), color('Connected'))
        const base64encoded = client.base64EncodedAuthInfo();
        fs.writeFileSync('./session.json', JSON.stringify(base64encoded, null, 2))
    })
    await client.connect();
    // Handler
    eventHandler(client)
    msgHandler(client)

}

banner('TRT|WABOT', 'cyan')
starts();