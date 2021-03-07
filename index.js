require('dotenv').config();
const { SERVER_URL, SERVER_PORT } = require('./settings');
const socketIO = require('socket.io-client');
const readline = require('readline');
const axios = require('axios');

const input = readline.createInterface(process.stdin, process.stdout);

input.question('Enter your username?\n', email => {
    input.question('Enter your password', async password => {
        const res = await axios.post(`${SERVER_URL}:${SERVER_PORT}/api/signin`, {
            email,
            password,
        });

        const { data } = res.data;

        if (data.error) {
            console.log(error);
            socket.close();
            input.close();
        }
        
        const { id: userId } = data;
        console.log(data);
        const socket = socketIO.connect(`${SERVER_URL}:${SERVER_PORT}`, {
            reconnect: true,
            query: `userId=${userId}`,
        });

        socket.on('connect', socket => {
            // console.log(`Join chat as ${username}`);
        });

        socket.on('message', message => {
            console.log(message);
        });
        socket.on('disconnect', socket => {
            console.log('Leave chat');
        });

        // const user = new User(username);
        
        input.on('line', message => {
            if (message === '/exit') {
                socket.close();
                input.close();
            }
            socket.emit('sendMessage', userId, message);
        });
    });
});
