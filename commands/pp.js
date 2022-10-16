let { randomNum } = require('../utility');
module.exports = (message) => message.channel.send('8' + '='.repeat(randomNum(0, 16)) + 'D'); // random size pp