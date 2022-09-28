// Require the necessary discord.js classes
const { Client, GatewayIntentBits, ActivityType, Intents } = require('discord.js');
const { token } = require('./config.json');
const { Commands, hardCodedUsers } = require('./commands.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const commandList = new Commands;

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// set activity to "Playing VIM"
client.options.presence.activities = [{name: 'VIM', type: ActivityType.Playing}];

// determine if the recipient of the command is the author or someone else
// if there is an argument which is an @, send its ID, otherwise send the id of the author
// /[0-9]/g,'' strips the message of numbers and /\D/g,'' strips the message of anything not a number
const commandRecipient = (message, args) => { return (args[0] && args[0].replace(/[0-9]/g,'') === '<@>') ? args[0].replace(/\D/g,'') : message.author.id }

// functionality
client.on('messageCreate', message => {

	// send "gayyyy" quote if abby says gay
	if (/^gay/i.test(message.content) && (hardCodedUsers[message.author.id].name == 'abby')) message.channel.send({ files: ['./images/gay.jpg'] });

	// command code
	if (message.content.substring(0, 1) == '~') {
		var args = message.content.substring(1).split(' ');
		var cmd = args[0].toLowerCase();
		args = args.splice(1);

		switch (cmd) {
			case 'uwu':
				commandList.uwuCommand(message);
				break;
			case 'opinion':
				commandList.opinionCommand(message, commandRecipient(message, args));
				break;
			case 'sylviesay':
				commandList.sylvieSayCommand(message, args);
				break;
			case 'compliment':
				commandList.complimentCommand(message);
				break;
			case 'femball':
				commandList.femballCommand(message);
				break;
			case 'feed':
				commandList.feedCommand(message, args);
				break;
			case 'pp':
				commandList.ppCommand(message);
				break;
			case 'identify':
				client.users.fetch(commandRecipient(message, args)).then((user) => { commandList.identifyCommand(message, user) }).catch(() => { 
					console.error;
					message.channel.send('**Unknown User** you fucking dumbass piece of shit');
				});
				break;
			case 'help':
				commandList.helpCommand(message);
				break;
		}
	}
});

// Login to Discord with your client's token
client.login(token);