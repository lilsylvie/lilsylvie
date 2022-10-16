const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');
const hardCodedUsers = require('./cloud9_data/hardCodedUsers.json');
const compliments = require('./cloud9_data/compliments.json');
const femball = require('./cloud9_data/femball.json');

// Utility Functions

const randomNum = (min, max) => Math.floor(Math.random() * (max - min) + min); // produces a random number between (min) and (max - 1)
const randomChoice = (message, arr) => message.channel.send(arr[randomNum(0, arr.length)]); // chooses a random item in an array

// determine if the recipient of the command is the author or someone else
// if there is an argument which is an @, send its ID, otherwise send the id of the author
// /[0-9]/g,'' strips the message of numbers and /\D/g,'' strips the message of anything not a number
const commandRecipient = (message, args) => (args[0] && args[0].replace(/[0-9]/g,'') === '<@>') ? args[0].replace(/\D/g,'') : message.author.id;

// draws a given number of user pfps on a background image
/* profiles should be an array with the following structure:
    [
        {
            id, avatarUrl, x, y, radius, diameter
        }
    ]
*/
const pfpDrawer = async (channel, height, width, backgroundImage, profiles, imageName, fileType) => {
    // create canvas
    const canvas = Canvas.createCanvas(height, width);
    const context = canvas.getContext('2d');

    // load background
    const background = await Canvas.loadImage(backgroundImage);

    // stretch background to fill canvas
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.beginPath();

    // load and draw profile pictures
    for (let profile of profiles) {
        const body = profile.avatarUrl;
        const avatar = await Canvas.loadImage(await body.arrayBuffer());

        // clip avatar into circle
        context.arc(profile.x + profile.radius, profile.y + profile.radius, profile.radius, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        context.drawImage(avatar, profile.x, profile.y, profile.diameter, profile.diameter);
    }

    // contruct attachment and send it
    const attachment = new AttachmentBuilder(await canvas.encode(fileType), { name: imageName + '.' + fileType});
    channel.send({ files: [attachment] });
}

let commands = {

    /* SMALL COMMANDS*/

    "booCommand": (message) => message.channel.send('AHHHHHHH!!! :scream:'), // responds to "boo" with a scream

    "uwuCommand": (message) => message.channel.send('*Rawr* ​x3 *nuzzles*, *pounces on you*, UwU you so warm'), // responds to "uwu" with a line from the bad furry rap

    "feedCommand": (message, args) => message.channel.send((args[0].toLowerCase() === 'takis' ? 'YUMMYYYY!!! :3' : 'Ewwwww nooo :sob:')), // only likes takis

    "ppCommand": (message) => message.channel.send('8' + '='.repeat(randomNum(0, 16)) + 'D'), // random size pp

    "complimentCommand": (message) => randomChoice(message, compliments), // sends a random compliment

    "femballCommand": (message) => randomChoice(message, femball), // random 8ball answer

    /* LARGE COMMANDS */

    // sends an image of the author pointing a gun at the recipient
    ////////////////////////////////////////////////////////////////

    // sends an image of astolfo with the authors pfp in place of his face
    "femboymeCommand": async (message) => {
        // gets url for avatar
        const { body } = await request(message.author.displayAvatarURL({ extension: 'jpg' }));
        // draws and sends imaage with author's pfp on astolfo
        pfpDrawer(message.channel, 1598, 2400, './images/astolfo_full.webp', [{ id: message.author.id, avatarUrl: body, x: 560, y: 270, radius: 170, diameter: 340 }], 'femboyed', 'webp');
    },

    // gives a hardcoded opinion for certain users
    "opinionCommand": (message, args) => {
        let id = commandRecipient(message, args);
        // if the id is in the list of users
        if (hardCodedUsers[id])
            // send a random opinion from the opinions array
            randomChoice(message, hardCodedUsers[id].opinions);
        else
            message.channel.send('Ask sylvie to add an opinion for ya! UwU');
    },

    // parrots the message after the command if it was sent by sylvie
    "sylviesayCommand": (message, args) => {
        if (hardCodedUsers[message.author.id].name === 'sylvie') {
            message.channel.send(args.join(' '));
            message.delete();
        }
    },

    // sends the username and id of the target in an embed format
    "identifyCommand": async (message, args, users) => {
        try {
            let target = await users.fetch(commandRecipient(message, args)).then((user) => { return user });

            // creates and posts embed
            const identityEmbed = new EmbedBuilder()
            .setColor(0xf2d2d6)
            .setTitle('Omggg silly how do you not know this? :face_with_hand_over_mouth:')
            .setThumbnail('https://cdn.statically.io/img/cuddlyoctopus.com/wp-content/uploads/2019/11/KI-032A-Astolfo.png?quality=100&f=auto')
            .addFields(
                { name: 'Name:', value: target.username + '#' + target.discriminator },
                { name: 'ID:', value: target.id }
            );
            message.channel.send({ embeds: [identityEmbed] });
        } catch {
            message.channel.send('Sorry, but i\'m not too sure who that is :sweat:');
        }
    },

    // sends a list of commands and their descriptions in an embed format
    "helpCommand": (message) => {
        // creates and posts embed
        const helpEmbed = new EmbedBuilder()
        .setColor(0xf2d2d6)
        .setTitle('Command List')
        .setAuthor({ name: 'lil sylvie', iconURL: 'https://cdn.statically.io/img/cuddlyoctopus.com/wp-content/uploads/2019/11/KI-032A-Astolfo.png?quality=100&f=auto' })
        .setDescription('All of lil sylvie\'s commands\nMake sure to include the \'~\' prefix')
        .setThumbnail('https://cdn.statically.io/img/cuddlyoctopus.com/wp-content/uploads/2019/11/KI-032A-Astolfo.png?quality=100&f=auto')
        .addFields(
            { name: '~boo', value: 'Gives a list of commands' },
            { name: '~uwu', value: 'Responds with a line from the bad furry rap' },
            { name: '~feed', value: 'Give lil sylvie a snacc' },
            { name: '~pp', value: 'Generate a random size pp' },
            { name: '~femball', value: 'Answers a yes or no question' },
            { name: '~femboyme', value: 'Turns you into a femboy' },
            { name: '~opinion', value: 'Gives out an opinion on certain users' },
            { name: '~compliment', value: 'Gives out a random compliment' },
            { name: '~identify', value: 'Gives the name and ID of the specified user' },
            { name: '~help', value: 'Gives a list of commands' },
        );
        message.channel.send({ embeds: [helpEmbed] });
    }

}

module.exports = {
    commands: commands,
    hardCodedUsers: hardCodedUsers,
    commandRecipient: commandRecipient
}