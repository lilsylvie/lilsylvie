const { EmbedBuilder } = require('discord.js');
const hardCodedUsers = require('./cloud9_data/hardCodedUsers.json');
const compliments = require('./cloud9_data/compliments.json');
const femball = require('./cloud9_data/femball.json');

// Utility Functions

const randomNum = (min, max) => Math.floor(Math.random() * (max - min) + min);

const randomChoice = (message, arr) => message.channel.send(arr[randomNum(0, arr.length)]);

class Commands {

    /* SMALL COMMANDS*/

    uwuCommand = (message) => message.channel.send('*Rawr* ​x3 *nuzzles*, *pounces on you*, UwU you so warm'); // bad furry rap

    feedCommand = (message, args) => message.channel.send((args[0].toLowerCase() === 'cum' ? 'YUMMYYYY!!! :3' : 'Ewwwww nooo :sob:')); // only likes milk

    ppCommand = (message) => message.channel.send('8' + '='.repeat(randomNum(0, 16)) + 'D'); // random size pp

    complimentCommand = (message) => randomChoice(message, compliments); // sends a random compliment

    femballCommand = (message) => randomChoice(message, femball); // random 8ball answer

    /* LARGE COMMANDS */

    opinionCommand = (message, id) => { // gives a hardcoded opinion for certain users
        if (hardCodedUsers[id])
            randomChoice(message, hardCodedUsers[id].opinions); // sends a random opinion from the opinions array
        else
            message.channel.send('Ask sylvie to add an opinion for ya! UwU');
    }

    sylvieSayCommand = (message, args) => { // parrots sylvie's message
        if (hardCodedUsers[message.author.id].name === 'sylvie') {
            message.channel.send(args.join(' '));
            message.delete();
        }
    }

    identifyCommand = (message, target) => {
        const identityEmbed = new EmbedBuilder()
        .setColor(0xf2d2d6)
        .setTitle('Omggg silly how do you not know this? :face_with_hand_over_mouth:')
        .setThumbnail('https://cdn.statically.io/img/cuddlyoctopus.com/wp-content/uploads/2019/11/KI-032A-Astolfo.png?quality=100&f=auto')
        .addFields(
            { name: 'Name:', value: target.username + '#' + target.discriminator },
            { name: 'ID:', value: target.id }
        );
        message.channel.send({ embeds: [identityEmbed] });
    }

    helpCommand = (message) => {
        const helpEmbed = new EmbedBuilder()
        .setColor(0xf2d2d6)
        .setTitle('Command List')
        .setAuthor({ name: 'lil sylvie', iconURL: 'https://cdn.statically.io/img/cuddlyoctopus.com/wp-content/uploads/2019/11/KI-032A-Astolfo.png?quality=100&f=auto' })
        .setDescription('All of lil sylvie\'s commands\nMake sure to include the \'~\' prefix')
        .setThumbnail('https://cdn.statically.io/img/cuddlyoctopus.com/wp-content/uploads/2019/11/KI-032A-Astolfo.png?quality=100&f=auto')
        .addFields(
            { name: '~uwu', value: 'Responds with a line from the bad furry rap' },
            { name: '~opinion', value: 'Gives out an opinion on certain users' },
            { name: '~compliment', value: 'Gives out a random compliment' },
            { name: '~help', value: 'Gives a list of commands' },
        );
        message.channel.send({ embeds: [helpEmbed] });
    }

}

module.exports = {
    Commands: Commands,
    hardCodedUsers: hardCodedUsers
}