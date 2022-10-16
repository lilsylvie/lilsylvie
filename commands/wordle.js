const wordleAnswers = require('../cloud9_data/wordleAnswers.json');
const wordleGuesses = require('../cloud9_data/wordleGuesses.json');

// lets the user play a game of wordle
module.exports = async (message) => {
    // choose a random word from the answers array
    let word = wordleAnswers[Math.floor(Math.random() * wordleAnswers.length)];

    // creates a multi-dimensional array of size [6][5] filled with blank spaces
    let board = Array.from(Array(6), x => Array.from(Array(5), x => ' '));

    // loop checks this to see if the game is finished
    let gameOver = false;

    // placeholder for the message, and for the message output
    let gameMessage;
    let boardOutput = '```css\nSend a 5 letter word to begin\n```';
    
    // send primary message then copy it into gameMessage
    await message.channel.send(boardOutput)
    .then(sent => {
        message.channel.messages.fetch(sent.id)
        .then(message => {gameMessage = message})
        .catch(console.error);
    });

    // `m` is a message object that will be passed through the filter function
    // checks if the word is in the answers or guesses lists as well as if the author is correct
    const filter = m => (wordleGuesses.includes(m.content.toLowerCase()) || wordleAnswers.includes(m.content.toLowerCase())) && m.author.id === message.author.id;

    for (let row in board) {
        await message.channel.awaitMessages({ filter, max: 1, time: 500000, errors: ['time'] })
        .then(collected => {
            // populates the row away with the guess string
            board[row] = Array.from(collected.first().content.toLowerCase(), x => [x, 0]);
            collected.first().delete();

            // loops through each letter in the word and puts them into a table (letter: occurenceCount)
            let letterOccurence = {};
            for (let letter of word)
                letterOccurence[letter] = (letterOccurence[letter]) ? letterOccurence[letter] + 1 : 1;

            // loops through twice
            for (let i of [1, 0]) {
                // loops through each letter in the guess and changes their "correctness" identifier based on the iteration and boolean statements
                // If it is the first iteration, and the letter is in the right spot, its identifier is set to 2 and its occurence decremented
                // If it is the second iteration, the letter is in the word, has occurences left, and hasn't already been identified, its identifier is set to one, and its occurence decremented
                for (let j in board[row]) {
                    // current letter
                    let curLtr = board[row][j][0];
                    if (((curLtr == word[j]) && i) || (word.includes(curLtr) && letterOccurence[curLtr] && board[row][j][1] != 2 && !i)) {
                        board[row][j][1] = i + 1;
                        letterOccurence[curLtr]--;
                    }
                }
            }

            // based on the letterRelation, the letter is surrounded with certain symbols to color it
            for (let i in board[row])
                board[row][i] = ' [#'[board[row][i][1]] + board[row][i][0] + ' ] '[board[row][i][1]];

            // turns the board into a string to send
            boardOutput = '```css\n' + message.author.username + '\n' + board.map(x => x.join('')).join('\n') + '\n```';

            // updates the game message
            gameMessage.edit(boardOutput);

            // if the guess is correct, the game ends
            if (collected.first().content === word) gameOver = true;
        }).catch(collected => {
            message.channel.send('Looks like nobody got the answer this time.');
            gameOver = true;
        });
        if (gameOver) break;
    }
    message.channel.send(word);
}