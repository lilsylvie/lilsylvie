const hardCodedUsers = require('../cloud9_data/hardCodedUsers.json');

// parrots the message after the command if it was sent by sylvie
module.exports = (message, args) => {
    if (hardCodedUsers[message.author.id].name === 'sylvie') {
        message.channel.send(args.join(' '));
        message.delete();
    }
}