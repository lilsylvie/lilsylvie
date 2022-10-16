const { pfpDrawer } = require("../utility");
const { request } = require('undici');

// sends an image of astolfo with the authors pfp in place of his face
module.exports = async (message) => {
    // gets url for avatar
    const { body } = await request(message.author.displayAvatarURL({ extension: 'jpg' }));

    // draws and sends imaage with author's pfp on astolfo
    pfpDrawer(message.channel, 1598, 2400, './images/astolfo_full.webp', [{ id: message.author.id, avatarUrl: body, x: 560, y: 270, radius: 170, diameter: 340 }], 'femboyed', 'webp');
}