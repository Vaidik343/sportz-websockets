import { WebSocket, WebSocketServer } from 'ws';
import { wsArcjet } from '../arcjet.js';

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
  const message = JSON.stringify(payload);

  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;
    client.send(message);
  }
}

export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    path: '/ws',
    maxPayload: 1024 * 1024,
  });

  wss.on('connection', async (socket, req) => {

    if(wsArcjet)
    {
      try {
        const decision = await wsArcjet.protect(req);

       if(decision.isDenied())
       {
         if(decision.reason.isRateLimit()) {
          socket.write('HTTP/1.1 429 Too Many Requests\r\n\r\n');
        } else {
          socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        }
        socket.destroy();
        return;
       }
      } catch (e) {

        console.error('ws connection error', e);
        socket.close(1011, 'Server security error');
        return;

        
      }
    }
    socket.isAlive = true;
    socket.on('pong', () => {socket.isAlive = true;});
    console.log('🔌 WS connected');
    sendJson(socket, { type: 'welcome' });

    socket.on('error', console.error);

    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if(ws.isAlive === false) return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    socket.on('message', (data) => {
      console.log('📨 WS message:', data.toString());
    });

    socket.on('close', () => {
      console.log('❌ WS disconnected');
    });

    socket.on('error', (err) => {
      console.error('⚠️ WS error:', err);
    });
  });

  function broadcastMatchCreated(match) {
    broadcast(wss, { type: 'match_created', data: match });
  }

  return { broadcastMatchCreated };
}

