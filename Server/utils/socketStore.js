class SocketStore {
    constructor() {
        this.userToScoket = {};
        this.socketToUser = {};
    }


    addUser(socketId, userId) {

        this.userToScoket[userId] = socketId;
        this.socketToUser[socketId] = userId;
    }

    getSocketOfUser(userId) {
        return this.userToScoket[userId];
    }

    getUserIdofSocket(socketId) {
        return this.socketToUser[socketId];
    }

    removeUser(socketId) {
        const userId = this.socketToUser[socketId];
        delete this.socketToUser[socketId];
        delete this.userToScoket[userId];
    }
    
}

module.exports = new SocketStore();