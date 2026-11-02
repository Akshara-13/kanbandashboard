
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('./db');
const env = require('./env');

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });

    // Authenticate socket connections using JWT
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(new Error('Authentication token required'));
            }

            const decoded = jwt.verify(token, env.JWT_SECRET);
            socket.user = decoded;

            next();
        } catch (error) {
            next(new Error('Invalid authentication token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.userId}`);

        // Join a board only after checking tenant membership
        socket.on('join_board', async ({ tenantId, boardId }, callback) => {
            try {
                const result = await db.query(
                    `SELECT m.id
                     FROM memberships m
                     JOIN boards b
                       ON b.tenant_id = m.tenant_id
                     WHERE m.tenant_id = $1
                       AND m.user_id = $2
                       AND b.id = $3
                       AND m.is_active = TRUE`,
                    [tenantId, socket.user.userId, boardId]
                );

                if (result.rows.length === 0) {
                    return callback?.({
                        success: false,
                        message: 'Board access denied'
                    });
                }

                const room = `tenant:${tenantId}:board:${boardId}`;

                socket.join(room);

                callback?.({
                    success: true,
                    message: 'Joined board successfully'
                });

            } catch (error) {
                console.error('Socket board join error:', error.message);

                callback?.({
                    success: false,
                    message: 'Unable to join board'
                });
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.userId}`);
        });
    });
    //socket.join(`user:${socket.user.userId}`);

    console.log('Socket.IO initialized');

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO has not been initialized');
    }

    return io;
};

module.exports = {
    initializeSocket,
    getIO
};
