// Require the necessary discord.js classes
const { Client, GatewayIntentBits, ActivityType, Intents } = require('discord.js');
const { token } = require('./config.json');

const fs = require('fs');
const hardCodedUsers = require('./cloud9_data/hardCodedUsers.json');

const Filter = require('bad-words');
let filter = new Filter;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// creates commands object
let commands = {};
const files = fs.readdirSync('./commands');
// for each file, add a "file" command to the object
for (let file of files) 
    commands[file.slice(0, -3)] = require('./commands/' + file);

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// set activity to "Playing VIM"

client.options.presence.activities = [{name: 'vscode', type: ActivityType.Playing}];

// functionality
client.on('messageCreate', message => {
	// send "gayyyy" quote if abby says gay at the beginning of a message (not case sensitive)
	if (/^gay/i.test(message.content) && hardCodedUsers[message.author.id] && hardCodedUsers[message.author.id].name == 'abby') return message.channel.send({ files: ['./images/gay.jpg'] });

	// checks for any bad words in a message
	if (filter.isProfane(message.content) &&  hardCodedUsers[message.author.id] && hardCodedUsers[message.author.id].name == "sylvie") message.reply('Watch your language!!! :sob:');

	// command code
	// if message content begins with '~'
	if (/^~/.test(message.content)) {
		// split message into commands and arguments
		let args = message.content.substring(1).split(' ');
		let cmd = args[0].toLowerCase();
		args = args.splice(1);

		// call the chosen command
		try {
			commands[cmd](message, args, client.users);
		} catch {
			// triggers if the command doesn't exist
			message.channel.send("Sorry 3: I don't know how to do that >_<");	
		}
	}
});

// Login to Discord with your client's token
client.login(token);