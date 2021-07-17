const chalk = require('chalk');
const cf = require('cfonts');

/**
 * Get color with text
 * @param {string} text 
 * @param {string} [color] 
 */
function color(text, color) {
    return color ? chalk.keyword(color)(text) : chalk.green(text)
}

/**
 * Get text with banner
 * @param {string} text 
 * @param {string} [color]
 */
function banner(text, color) {
    const warna = color ? color : 'cyan'
    cf.say(text, {
        font: 'block',
        align: 'center',
        colors: [warna]
    })
}

module.exports = {
    color,
    banner
}