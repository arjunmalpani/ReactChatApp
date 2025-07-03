import { configDotenv } from 'dotenv';
configDotenv()
import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import { app , server , io } from './lib/socket.js';
import path from 'path';
const PORT = process.env.PORT


const __dirname = path.resolve();
// Middlewares
app.use(cookieParser())
app.use(express.json({ limit: '10mb' })) // Increase JSON payload limit
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // Allow cookies to be sent
}))
// Routes
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});


app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
    });
}
server.listen(PORT, () => {
    console.log('Server is running at PORT:', PORT);
    connectDB()
})