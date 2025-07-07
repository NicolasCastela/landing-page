// 🚀 WebSocket Server para GUNIC Meet
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');

class GunicMeetServer {
    constructor() {
        this.port = 8080;
        this.rooms = new Map();
        this.clients = new Map();
        this.init();
    }

    init() {
        // Criar servidor HTTP
        this.server = http.createServer((req, res) => {
            this.handleHttpRequest(req, res);
        });

        // Criar servidor WebSocket
        this.wss = new WebSocket.Server({ server: this.server });
        this.setupWebSocket();

        // Iniciar servidor
        this.server.listen(this.port, () => {
            console.log(`🚀 GUNIC Meet Server rodando em http://localhost:${this.port}`);
            console.log(`📹 WebSocket disponível em ws://localhost:${this.port}`);
        });
    }

    handleHttpRequest(req, res) {
        // Servir arquivos estáticos
        let filePath = req.url === '/' ? '/video-chat.html' : req.url;
        const fullPath = path.join(__dirname, filePath);

        fs.readFile(fullPath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Arquivo não encontrado');
                return;
            }

            // Definir content-type
            const ext = path.extname(filePath);
            const contentTypes = {
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.css': 'text/css',
                '.json': 'application/json'
            };

            res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
            res.end(data);
        });
    }

    setupWebSocket() {
        this.wss.on('connection', (ws, req) => {
            const clientId = this.generateId();
            console.log(`👤 Cliente conectado: ${clientId}`);

            // Armazenar cliente
            this.clients.set(clientId, {
                ws: ws,
                id: clientId,
                room: null,
                name: null
            });

            // Configurar handlers
            ws.on('message', (data) => {
                this.handleMessage(clientId, data);
            });

            ws.on('close', () => {
                this.handleDisconnect(clientId);
            });

            ws.on('error', (error) => {
                console.error(`❌ Erro WebSocket ${clientId}:`, error);
            });

            // Enviar ID do cliente
            this.sendToClient(clientId, {
                type: 'connected',
                clientId: clientId
            });
        });
    }

    handleMessage(clientId, data) {
        try {
            const message = JSON.parse(data);
            const client = this.clients.get(clientId);

            if (!client) return;

            switch (message.type) {
                case 'join-room':
                    this.handleJoinRoom(clientId, message.data);
                    break;
                case 'leave-room':
                    this.handleLeaveRoom(clientId);
                    break;
                case 'chat-message':
                    this.handleChatMessage(clientId, message.data);
                    break;
                case 'webrtc-offer':
                    this.handleWebRTCOffer(clientId, message.data);
                    break;
                case 'webrtc-answer':
                    this.handleWebRTCAnswer(clientId, message.data);
                    break;
                case 'webrtc-ice-candidate':
                    this.handleWebRTCIceCandidate(clientId, message.data);
                    break;
                case 'media-state':
                    this.handleMediaState(clientId, message.data);
                    break;
            }
        } catch (error) {
            console.error(`❌ Erro ao processar mensagem de ${clientId}:`, error);
        }
    }

    handleJoinRoom(clientId, data) {
        const client = this.clients.get(clientId);
        if (!client) return;

        const { roomId, userName } = data;
        
        // Sair da sala anterior se existir
        if (client.room) {
            this.handleLeaveRoom(clientId);
        }

        // Criar sala se não existir
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, {
                id: roomId,
                clients: new Set(),
                createdAt: Date.now()
            });
        }

        const room = this.rooms.get(roomId);
        
        // Adicionar cliente à sala
        room.clients.add(clientId);
        client.room = roomId;
        client.name = userName;

        console.log(`👤 ${userName} entrou na sala ${roomId}`);

        // Notificar outros usuários na sala
        this.broadcastToRoom(roomId, {
            type: 'user-joined',
            data: {
                clientId: clientId,
                userName: userName,
                timestamp: Date.now()
            }
        }, clientId);

        // Enviar lista de usuários para o novo cliente
        const roomUsers = Array.from(room.clients)
            .map(id => {
                const c = this.clients.get(id);
                return c ? { clientId: id, userName: c.name } : null;
            })
            .filter(Boolean);

        this.sendToClient(clientId, {
            type: 'room-joined',
            data: {
                roomId: roomId,
                users: roomUsers,
                userCount: room.clients.size
            }
        });

        // Atualizar contagem de usuários
        this.broadcastToRoom(roomId, {
            type: 'user-count-updated',
            data: { count: room.clients.size }
        });
    }

    handleLeaveRoom(clientId) {
        const client = this.clients.get(clientId);
        if (!client || !client.room) return;

        const room = this.rooms.get(client.room);
        if (!room) return;

        // Remover cliente da sala
        room.clients.delete(clientId);

        console.log(`👤 ${client.name} saiu da sala ${client.room}`);

        // Notificar outros usuários
        this.broadcastToRoom(client.room, {
            type: 'user-left',
            data: {
                clientId: clientId,
                userName: client.name,
                timestamp: Date.now()
            }
        });

        // Atualizar contagem
        this.broadcastToRoom(client.room, {
            type: 'user-count-updated',
            data: { count: room.clients.size }
        });

        // Remover sala se vazia
        if (room.clients.size === 0) {
            this.rooms.delete(client.room);
            console.log(`🗑️ Sala ${client.room} removida (vazia)`);
        }

        client.room = null;
    }

    handleChatMessage(clientId, data) {
        const client = this.clients.get(clientId);
        if (!client || !client.room) return;

        const message = {
            type: 'chat-message',
            data: {
                clientId: clientId,
                userName: client.name,
                message: data.message,
                timestamp: Date.now()
            }
        };

        // Broadcast para toda a sala
        this.broadcastToRoom(client.room, message);
    }

    handleWebRTCOffer(clientId, data) {
        const client = this.clients.get(clientId);
        if (!client || !client.room) return;

        // Encaminhar offer para o cliente específico
        this.sendToClient(data.targetClientId, {
            type: 'webrtc-offer',
            data: {
                fromClientId: clientId,
                offer: data.offer
            }
        });
    }

    handleWebRTCAnswer(clientId, data) {
        const client = this.clients.get(clientId);
        if (!client || !client.room) return;

        // Encaminhar answer para o cliente específico
        this.sendToClient(data.targetClientId, {
            type: 'webrtc-answer',
            data: {
                fromClientId: clientId,
                answer: data.answer
            }
        });
    }

    handleWebRTCIceCandidate(clientId, data) {
        const client = this.clients.get(clientId);
        if (!client || !client.room) return;

        // Encaminhar ICE candidate para o cliente específico
        this.sendToClient(data.targetClientId, {
            type: 'webrtc-ice-candidate',
            data: {
                fromClientId: clientId,
                candidate: data.candidate
            }
        });
    }

    handleMediaState(clientId, data) {
        const client = this.clients.get(clientId);
        if (!client || !client.room) return;

        // Broadcast estado da mídia para a sala
        this.broadcastToRoom(client.room, {
            type: 'media-state-changed',
            data: {
                clientId: clientId,
                userName: client.name,
                audioEnabled: data.audioEnabled,
                videoEnabled: data.videoEnabled
            }
        }, clientId);
    }

    handleDisconnect(clientId) {
        const client = this.clients.get(clientId);
        if (!client) return;

        console.log(`👤 Cliente desconectado: ${clientId}`);

        // Sair da sala se estiver em uma
        if (client.room) {
            this.handleLeaveRoom(clientId);
        }

        // Remover cliente
        this.clients.delete(clientId);
    }

    sendToClient(clientId, message) {
        const client = this.clients.get(clientId);
        if (client && client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(JSON.stringify(message));
        }
    }

    broadcastToRoom(roomId, message, excludeClientId = null) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        room.clients.forEach(clientId => {
            if (clientId !== excludeClientId) {
                this.sendToClient(clientId, message);
            }
        });
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // Método para obter estatísticas
    getStats() {
        return {
            connectedClients: this.clients.size,
            activeRooms: this.rooms.size,
            rooms: Array.from(this.rooms.values()).map(room => ({
                id: room.id,
                userCount: room.clients.size,
                createdAt: room.createdAt
            }))
        };
    }
}

// Inicializar servidor
const server = new GunicMeetServer();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando servidor...');
    server.wss.close(() => {
        server.server.close(() => {
            console.log('✅ Servidor encerrado');
            process.exit(0);
        });
    });
});

module.exports = GunicMeetServer;