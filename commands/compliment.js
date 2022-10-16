const { randomChoice } = require('../utility');
const compliments = require('../cloud9_data/compliments.json');

module.exports = (message) => randomChoice(message, compliments); // sends a random compliment