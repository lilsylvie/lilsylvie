const { randomChoice } = require('../utility');
const femball = require('./../cloud9_data/femball.json');

module.exports = (message) => randomChoice(message, femball); // random 8ball answer