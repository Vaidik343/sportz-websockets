import express from 'express'
import http from 'http'
import { matchRouter } from './routes/matches.js';
import {commentaryRouter} from "./routes/commentary.js";
import { attachWebSocketServer } from './ws/server.js';
import { securityMiddleware } from './arcjet.js';


const app = express();
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());
const server = http.createServer(app);

// Apply Arcjet security middleware to protect all routes
app.use(securityMiddleware());

app.get('/', (req, res) => {
    res.send('Hello from Express server!');
});

app.use('/matches', matchRouter);
app.use('/matches/:id/commentary', commentaryRouter);

const {broadcastMatchCreated,broadcastMatchCommentary} = attachWebSocketServer(server);
console.log("🚀 ~ broadcastMatchCommentary:", broadcastMatchCommentary)
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastMatchCommentary = broadcastMatchCommentary

server.listen(PORT, () => {

    const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

    console.log(`Server is running ${baseUrl}`);
    console.log(`WebSocket Server is running on ${baseUrl.replace('http', 'ws')}/ws`);
})
