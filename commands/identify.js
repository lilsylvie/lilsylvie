const { EmbedBuilder } = require('discord.js');
const { commandRecipient } = require('../utility');

// sends the username and id of the target in an embed format
module.exports = async (message, args, users) => {
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
}