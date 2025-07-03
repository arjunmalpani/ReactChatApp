import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { log } from 'console';


const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: [process.env.CLIENT_URL]
    },
})

export function getRecieverSocketId(usesId) {
    // This function retrieves the socket ID of a user based on their userId
    return userSocketMap.get(usesId);
}

const userSocketMap = new Map();


io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap.set(userId, socket.id);

    // io.emit used to broadcast messages to all connected clients
    // For example, you can emit a message to all clients when a user connects
    io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));

    socket.on('disconnect', () => {
        console.log("A user disconnected", socket.id);
        userSocketMap.delete(userId);
        // Emit the updated list of online users to all clients
        io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));
    })
})
export { io, app, server }