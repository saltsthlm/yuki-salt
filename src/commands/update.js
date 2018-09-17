const child_process = require('child_process')

const ACK = 'はい'
const COMMANDS = [ 'update' ]

module.exports = (text, message, { settings }) => {
    if (COMMANDS.includes(text)) {
        if (!settings.admins.includes(message.author.id)) {
            return message.channel.send('Request denied.')
        }
        const result = child_process.execSync('npm run bot:update').toString()
        console.log(result)
        if (result.includes('Already up-to-date.') || result.includes('Already up to date.')) {
            return message.channel.send(`This interface is already in sync with the latest version.`)
        }
        return message.channel.send(ACK)
            .then(() => {
                console.log('Spawning restart process...')
                const child = child_process.spawn('npm', [ 'run', 'bot:restart' ])
                child.stdout.on('data', data => console.log(data.toString()))
                child.stderr.on('data', data => console.log('ERROR', data.toString()))
                console.log('Done.')
            })
    }
}