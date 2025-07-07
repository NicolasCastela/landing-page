// 💬 Chat WebSocket Server - Tutorial Prático
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando servidor de chat WebSocket...');

// Criar servidor HTTP para servir arquivos
const server = http.createServer((req, res) => {
    let filePath = req.url;
    
    // Rota padrão
    if (filePath === '/') {
        filePath = '/chat-client1.html';
    }
    
    const fullPath = path.join(__dirname, filePath);
    
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <h1>404 - Arquivo não encontrado</h1>
                <p>Arquivo: ${filePath}</p>
                <a href="/">Voltar ao chat</a>
            `);
            return;
        }
        
        // Definir content-type
        const ext = path.extname(filePath);
        const contentTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css'
        };
        
        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
        res.end(data);
    });
});

// Criar servidor WebSocket
const wss = new WebSocket.Server({ server });

// Armazenar clientes conectados
const clients = new Map();
let clientIdCounter = 1;

console.log('🔌 Servidor WebSocket configurado');

// Quando um cliente conecta
wss.on('connection', (ws, req) => {
    const clientId = clientIdCounter++;
    const clientInfo = {
        id: clientId,
        ws: ws,
        name: `Usuário ${clientId}`,
        joinTime: new Date()
    };
    
    clients.set(clientId, clientInfo);
    
    console.log(`👤 Cliente ${clientId} conectado (Total: ${clients.size})`);
    
    // Enviar mensagem de boas-vindas
    ws.send(JSON.stringify({
        type: 'welcome',
        message: `Bem-vindo ao chat! Você é o ${clientInfo.name}`,
        clientId: clientId,
        timestamp: new Date().toLocaleTimeString('pt-BR')
    }));
    
    // Notificar outros usuários
    broadcastToOthers({
        type: 'user-joined',
        message: `${clientInfo.name} entrou no chat`,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        userCount: clients.size
    }, clientId);
    
    // Enviar lista de usuários online
    sendUserList();
    
    // Quando recebe uma mensagem
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log(`📨 Mensagem de ${clientInfo.name}:`, message.message);
            
            // Processar diferentes tipos de mensagem
            switch (message.type) {
                case 'chat':
                    handleChatMessage(clientId, message);
                    break;
                case 'typing':
                    handleTypingIndicator(clientId, message);
                    break;
                case 'name-change':
                    handleNameChange(clientId, message);
                    break;
                default:
                    console.log('Tipo de mensagem desconhecido:', message.type);
            }
            
        } catch (error) {
            console.error('❌ Erro ao processar mensagem:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Erro ao processar mensagem',
                timestamp: new Date().toLocaleTimeString('pt-BR')
            }));
        }
    });
    
    // Quando cliente desconecta
    ws.on('close', () => {
        console.log(`👤 Cliente ${clientId} (${clientInfo.name}) desconectou`);
        
        // Notificar outros usuários
        broadcastToOthers({
            type: 'user-left',
            message: `${clientInfo.name} saiu do chat`,
            timestamp: new Date().toLocaleTimeString('pt-BR'),
            userCount: clients.size - 1
        }, clientId);
        
        // Remover cliente
        clients.delete(clientId);
        
        // Atualizar lista de usuários
        sendUserList();
        
        console.log(`📊 Usuários online: ${clients.size}`);
    });
    
    // Tratar erros
    ws.on('error', (error) => {
        console.error(`❌ Erro no cliente ${clientId}:`, error);
    });
});

// Função para lidar com mensagens de chat
function handleChatMessage(senderId, message) {
    const sender = clients.get(senderId);
    if (!sender) return;
    
    const chatMessage = {
        type: 'message',
        senderId: senderId,
        senderName: sender.name,
        message: message.message,
        timestamp: new Date().toLocaleTimeString('pt-BR')
    };
    
    // Enviar para todos os clientes
    broadcastToAll(chatMessage);
}

// Função para indicador de digitação
function handleTypingIndicator(senderId, message) {
    const sender = clients.get(senderId);
    if (!sender) return;
    
    broadcastToOthers({
        type: 'typing',
        senderName: sender.name,
        isTyping: message.isTyping
    }, senderId);
}

// Função para mudança de nome
function handleNameChange(clientId, message) {
    const client = clients.get(clientId);
    if (!client) return;
    
    const oldName = client.name;
    const newName = message.newName.trim();
    
    if (newName && newName !== oldName) {
        client.name = newName;
        
        broadcastToAll({
            type: 'name-changed',
            message: `${oldName} mudou o nome para ${newName}`,
            timestamp: new Date().toLocaleTimeString('pt-BR')
        });
        
        sendUserList();
    }
}

// Enviar mensagem para todos os clientes
function broadcastToAll(message) {
    const messageStr = JSON.stringify(message);
    
    clients.forEach((client) => {
        if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(messageStr);
        }
    });
}

// Enviar mensagem para todos exceto o remetente
function broadcastToOthers(message, excludeId) {
    const messageStr = JSON.stringify(message);
    
    clients.forEach((client, clientId) => {
        if (clientId !== excludeId && client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(messageStr);
        }
    });
}

// Enviar lista de usuários online
function sendUserList() {
    const userList = Array.from(clients.values()).map(client => ({
        id: client.id,
        name: client.name,
        joinTime: client.joinTime
    }));
    
    broadcastToAll({
        type: 'user-list',
        users: userList,
        count: clients.size
    });
}

// Estatísticas do servidor
function getServerStats() {
    return {
        connectedClients: clients.size,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
    };
}

// Log de estatísticas a cada 30 segundos
setInterval(() => {
    const stats = getServerStats();
    console.log(`📊 Stats: ${stats.connectedClients} clientes, Uptime: ${Math.floor(stats.uptime)}s`);
}, 30000);

// Iniciar servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`🔌 WebSocket disponível em ws://localhost:${PORT}`);
    console.log(`👥 Abra múltiplas abas para testar o chat`);
    console.log(`📱 Acesse:`);
    console.log(`   - http://localhost:${PORT} (Cliente 1)`);
    console.log(`   - http://localhost:${PORT}/chat-client2.html (Cliente 2)`);
    console.log('');
    console.log('💡 Dicas:');
    console.log('   - Abra 2+ abas para simular múltiplos usuários');
    console.log('   - Digite mensagens para ver comunicação em tempo real');
    console.log('   - Feche abas para ver notificações de saída');
    console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando servidor...');
    
    // Notificar clientes sobre shutdown
    broadcastToAll({
        type: 'server-shutdown',
        message: 'Servidor está sendo encerrado...',
        timestamp: new Date().toLocaleTimeString('pt-BR')
    });
    
    // Fechar conexões
    clients.forEach(client => {
        client.ws.close();
    });
    
    server.close(() => {
        console.log('✅ Servidor encerrado');
        process.exit(0);
    });
});

module.exports = { server, wss };