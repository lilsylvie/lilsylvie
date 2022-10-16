const { AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');

let utility = {
    randomNum: (min, max) => Math.floor(Math.random() * (max - min) + min), // produces a random number between (min) and (max - 1)

    randomChoice: (message, arr) => message.channel.send(arr[utility.randomNum(0, arr.length)]), // chooses a random item in an array

    // determine if the recipient of the command is the author or someone else
    // if there is an argument which is an @, send its ID, otherwise send the id of the author
    // /[0-9]/g,'' strips the message of numbers and /\D/g,'' strips the message of anything not a number
    commandRecipient: (message, args) => (args[0] && args[0].replace(/[0-9]/g,'') === '<@>') ? args[0].replace(/\D/g,'') : message.author.id,

    // draws a given number of user pfps on a background image
    /* profiles should be an array with the following structure:
        [
            {
                id, avatarUrl, x, y, radius, diameter
            }
        ]
    */
    pfpDrawer: async (channel, height, width, backgroundImage, profiles, imageName, fileType) => {
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
}

module.exports = utility;