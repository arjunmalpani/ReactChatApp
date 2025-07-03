import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();
console.log(__dirname);

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
    const staticPath = path.join(__dirname, "../client", "dist");
    const indexPath = path.join(staticPath, "index.html");
    app.use(express.static(staticPath));

    app.get("/*path", (req, res) => {
        res.sendFile(indexPath);
    });

}

server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});