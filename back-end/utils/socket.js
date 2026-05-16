const {Server} = require('socket.io')
const http = require('http')
const express = require('express')
const { isTokenValid } = require('./jwt')

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"]
    },
})

function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

const userSocketMap = {};

io.on('connection', (socket) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        if (!token) {
            socket.disconnect();
            return;
        }
        
        const payload = isTokenValid(token);
        const userId = payload.user.userId;
        
        if(!userId) {
            socket.disconnect();
            return;
        }

        console.log('A user connected', socket.id);
        userSocketMap[userId] = socket.id
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    } catch (error) {
        console.error('WebSocket auth error:', error.message);
        socket.disconnect();
    }

    socket.on('disconnect', () => {
        console.log('A user disconnected', socket.id)
        const userId = Object.keys(userSocketMap).find(key => userSocketMap[key] === socket.id);
        if (userId) {
            delete userSocketMap[userId]
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

module.exports = {
    io,
    app,
    server,
    getReceiverSocketId,
}