const { EmbedBuilder } = require('discord.js');

// sends a list of commands and their descriptions in an embed format
module.exports = (message) => {
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