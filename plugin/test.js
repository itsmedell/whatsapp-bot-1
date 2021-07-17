const { WAConnection } = require("../lib/modified");

module.exports = {
    name: 'test',
    aliases: 'testing',
    execute(client = new WAConnection()) {
        client.replyWithText('Testing 123')
    }
}