const { randomChoice, commandRecipient } = require('../utility');
const hardCodedUsers = require('../cloud9_data/hardCodedUsers.json');

// gives a hardcoded opinion for certain users
module.exports = (message, args) => {

    let id = commandRecipient(message, args);
    // if the id is in the list of users
    if (hardCodedUsers[id])
        // send a random opinion from the opinions array
        randomChoice(message, hardCodedUsers[id].opinions);
    else
        message.channel.send('Ask sylvie to add an opinion for ya! UwU');
}