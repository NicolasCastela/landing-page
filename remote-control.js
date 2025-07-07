const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const ScreenCapture = require('./screen-capture');

class RemoteControlServer {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
        this.clients = new Map();
        this.sessions = new Map();
        this.screenCapture = new ScreenCapture();
        
        this.setupRoutes();
        this.setupWebSocket();
    }

    setupRoutes() {
        this.app.use(express.static('.'));
        this.app.use(express.json());

        this.app.get('/api/generate-id', (req, res) => {
            const id = Math.random().toString(36).substr(2, 9);
            res.json({ id, timestamp: Date.now() });
        });

        this.app.post('/api/connect', (req, res) => {
            const { targetId } = req.body;
            const client = this.clients.get(targetId);
            
            if (client && client.readyState === WebSocket.OPEN) {
                res.json({ success: true, status: 'online' });
            } else {
                res.json({ success: false, status: 'offline' });
            }
        });
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data);
                    this.handleMessage(ws, message);
                } catch (error) {
                    console.error('Invalid message:', error);
                }
            });

            ws.on('close', () => {
                for (const [id, client] of this.clients.entries()) {
                    if (client === ws) {
                        this.clients.delete(id);
                        break;
                    }
                }
            });
        });
    }

    handleMessage(ws, message) {
        switch (message.type) {
            case 'register':
                this.clients.set(message.id, ws);
                ws.send(JSON.stringify({ type: 'registered', id: message.id }));
                break;

            case 'offer':
            case 'answer':
            case 'ice-candidate':
                const target = this.clients.get(message.target);
                if (target && target.readyState === WebSocket.OPEN) {
                    target.send(JSON.stringify(message));
                }
                break;

            case 'screen-data':
                const viewer = this.clients.get(message.target);
                if (viewer && viewer.readyState === WebSocket.OPEN) {
                    viewer.send(JSON.stringify(message));
                }
                break;

            case 'control-event':
                this.handleControlEvent(message);
                break;

            case 'start-sharing':
                this.startScreenSharing(ws, message.id);
                break;

            case 'stop-sharing':
                this.screenCapture.stopStreaming();
                break;
        }
    }

    handleControlEvent(message) {
        const { event } = message;
        
        if (event.type === 'mouse' && event.action === 'click') {
            this.screenCapture.simulateMouseClick(event.x, event.y);
        } else if (event.type === 'keyboard') {
            this.screenCapture.simulateKeyPress(event.key, event.action);
        }
    }

    startScreenSharing(ws, clientId) {
        this.screenCapture.startStreaming((screenData) => {
            // Enviar para todos os clientes conectados a este ID
            for (const [id, client] of this.clients.entries()) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'screen-data',
                        data: screenData,
                        source: clientId
                    }));
                }
            }
        });
    }

    start(port = 5002) {
        this.server.listen(port, () => {
            console.log(`🖥️ Remote Control Server running on port ${port}`);
            console.log(`📺 Screen sharing enabled`);
            console.log(`🎮 Remote control enabled`);
        });
    }
}

const server = new RemoteControlServer();
server.start();

module.exports = RemoteControlServer;