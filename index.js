// Require the necessary discord.js classes
const { Client, GatewayIntentBits, ActivityType, Intents } = require('discord.js');
const { token } = require('./config.json');
const { commands, hardCodedUsers, commandRecipient } = require('./commands.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// set activity to "Playing VIM"
client.options.presence.activities = [{name: 'VIM', type: ActivityType.Playing}];

// functionality
client.on('messageCreate', message => {

	// send "gayyyy" quote if abby says gay at the beginning of a message (not case sensitive)
	if (/^gay/i.test(message.content) && (hardCodedUsers[message.author.id].name == 'abby')) return message.channel.send({ files: ['./images/gay.jpg'] });

	// command code
	// if message content begins with '~'
	if (/^~/.test(message.content)) {
		// split message into commands and arguments
		let args = message.content.substring(1).split(' ');
		let cmd = args[0].toLowerCase();
		args = args.splice(1);

		// call the chosen command
		commands[cmd + "Command"](message, args, client.users);
	}
});

// Login to Discord with your client's token
client.login(token);