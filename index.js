require('dotenv').config();
const { SERVER_URL, SERVER_PORT } = require('./settings');
const socketIO = require('socket.io-client');
const readline = require('readline');
const axios = require('axios');

const input = readline.createInterface(process.stdin, process.stdout);

input.question('Enter your username?\n', email => {
    input.question('Enter your password\n', async password => {
        const { data, headers } = await axios.post(`${SERVER_URL}:${SERVER_PORT}/api/signin`, {
            email,
            password,
        });

        if (data.error) {
            console.log(data.error);
            input.close();
            return;
        }

        const cookie = headers['set-cookie'];
        
        const socket = socketIO.connect(`${SERVER_URL}:${SERVER_PORT}`, {
            reconnect: true,
            extraHeaders: {
                cookie: cookie.join(', '),
            },
        });

        socket.on('connect', socket => {
            // console.log(`Join chat as ${username}`);
        });

        socket.on('newMessage', message => {
            console.log(message);
        });
        socket.on('disconnect', socket => {
            console.log('Leave chat');
        });

        socket.on('chatHistory', messages => {
            messages.forEach(message => console.log(message.text));
        });
        
        input.question('Reciever email:\n', recieverEmail => {
            const history = socket.emit('getHistory', recieverEmail);
            input.on('line', message => {
                if (message === '/exit') {
                    socket.close();
                    input.close();
                }
                socket.emit('sendMessage', recieverEmail, message);
            });
        });
    });
});
