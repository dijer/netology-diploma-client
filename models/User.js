class User {
    constructor(username) {
        this.username = username;
    }

    say(message) {
        return {
            username: this.username,
            message,
            date: new Date(),
        };
    }
}

module.exports = User;