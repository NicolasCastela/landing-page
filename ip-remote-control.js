const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const ScreenCapture = require('./screen-capture');

class IPRemoteControl {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
        this.connectedIPs = new Map(); // IP -> WebSocket
        this.screenCapture = new ScreenCapture();
        
        this.setupRoutes();
        this.setupWebSocket();
    }

    setupRoutes() {
        this.app.use(express.static('.'));
        this.app.use(express.json());

        // Conectar diretamente por IP
        this.app.post('/api/connect-ip', (req, res) => {
            const { targetIP } = req.body;
            const clientWS = this.connectedIPs.get(targetIP);
            
            if (clientWS && clientWS.readyState === WebSocket.OPEN) {
                res.json({ success: true, status: 'online', ip: targetIP });
            } else {
                res.json({ success: false, status: 'offline', ip: targetIP });
            }
        });

        // Listar IPs conectados
        this.app.get('/api/connected-ips', (req, res) => {
            const ips = Array.from(this.connectedIPs.keys());
            res.json({ ips, count: ips.length });
        });
    }

    setupWebSocket() {
        this.wss.on('connection', (ws, req) => {
            const clientIP = req.socket.remoteAddress.replace('::ffff:', '');
            console.log(`[+] Cliente conectado: ${clientIP}`);
            
            this.connectedIPs.set(clientIP, ws);
            
            ws.send(JSON.stringify({ 
                type: 'connected', 
                your_ip: clientIP,
                timestamp: Date.now()
            }));

            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data);
                    message.source_ip = clientIP;
                    this.handleMessage(ws, message);
                } catch (error) {
                    console.error('Mensagem inválida:', error);
                }
            });

            ws.on('close', () => {
                console.log(`[-] Cliente desconectado: ${clientIP}`);
                this.connectedIPs.delete(clientIP);
            });
        });
    }

    handleMessage(ws, message) {
        switch (message.type) {
            case 'control-event':
                this.handleControlEvent(message);
                break;

            case 'request-screen':
                this.sendScreenToIP(message.target_ip, message.source_ip);
                break;

            case 'start-sharing':
                this.startScreenSharing(message.source_ip);
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

    sendScreenToIP(targetIP, sourceIP) {
        const targetWS = this.connectedIPs.get(targetIP);
        if (!targetWS || targetWS.readyState !== WebSocket.OPEN) return;

        this.screenCapture.captureScreen().then(screenData => {
            targetWS.send(JSON.stringify({
                type: 'screen-data',
                data: screenData,
                source_ip: sourceIP
            }));
        }).catch(console.error);
    }

    startScreenSharing(sourceIP) {
        this.screenCapture.startStreaming((screenData) => {
            // Enviar para todos os outros IPs conectados
            for (const [ip, ws] of this.connectedIPs.entries()) {
                if (ip !== sourceIP && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        type: 'screen-data',
                        data: screenData,
                        source_ip: sourceIP
                    }));
                }
            }
        });
    }

    start(port = 5003) {
        this.server.listen(port, '0.0.0.0', () => {
            console.log(`🌐 IP Remote Control Server running on port ${port}`);
            console.log(`📡 Accepting connections from any IP`);
        });
    }
}

const server = new IPRemoteControl();
server.start();

module.exports = IPRemoteControl;