const { User } = require('./models');
const { SERVER_URL, SERVER_PORT } = require('./settings');
const socketIO = require('socket.io-client');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const logFile = 'file.log';
const filepath = path.join(__dirname, logFile);

const input = readline.createInterface(process.stdin, process.stdout);
input.question('Enter your username?\n', username => {
    const socket = socketIO.connect(`${SERVER_URL}:${SERVER_PORT}`, {
        reconnect: true,
    });

    socket.on('connect', socket => {
        console.log(`Join chat as ${username}`);
    });

    socket.on('message', message => {
        console.log(message);
        fs.appendFile(filepath, `${message}\n`, (err) => {
            if (err) throw new Error(err);
        })
    });
    socket.on('disconnect', socket => {
        console.log('Leave chat');
    });

    const user = new User(username);
    
    input.on('line', message => {
        if (message === '/exit') {
            socket.close();
            input.close();
        }
        socket.emit('message', user.say(message));
    });
});
