# 🔌 WebSocket Tutorial - Chat Local Entre 2 Pessoas

## 📚 O que é WebSocket?

WebSocket é uma tecnologia que permite **comunicação em tempo real** entre cliente e servidor:
- **Bidirecional**: Cliente ↔ Servidor
- **Tempo Real**: Instantâneo
- **Persistente**: Conexão sempre aberta
- **Eficiente**: Menos overhead que HTTP

## 🎯 Exemplo Prático: Chat Local

Vamos criar um chat onde 2 pessoas conversam em tempo real.

### 📁 Estrutura do Projeto
```
websocket-chat/
├── server.js          # Servidor WebSocket
├── client1.html       # Pessoa 1
├── client2.html       # Pessoa 2
├── package.json       # Dependências
└── start.bat          # Script para iniciar
```

## 🚀 Passo a Passo

### 1. Criar package.json
```json
{
  "name": "websocket-chat",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "ws": "^8.14.2"
  }
}
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Criar Servidor (server.js)
```javascript
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Criar servidor HTTP
const server = http.createServer((req, res) => {
    let filePath = req.url === '/' ? '/client1.html' : req.url;
    const fullPath = path.join(__dirname, filePath);
    
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Arquivo não encontrado');
            return;
        }
        
        const ext = path.extname(filePath);
        const contentType = ext === '.html' ? 'text/html' : 'text/plain';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

// Criar servidor WebSocket
const wss = new WebSocket.Server({ server });

// Lista de clientes conectados
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('👤 Cliente conectado');
    clients.add(ws);
    
    // Enviar mensagem de boas-vindas
    ws.send(JSON.stringify({
        type: 'system',
        message: 'Conectado ao chat!',
        timestamp: new Date().toLocaleTimeString()
    }));
    
    // Notificar outros sobre novo usuário
    broadcast({
        type: 'user-joined',
        message: 'Novo usuário entrou no chat',
        timestamp: new Date().toLocaleTimeString()
    }, ws);
    
    // Receber mensagens
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('📨 Mensagem recebida:', message);
            
            // Reenviar para todos os clientes
            broadcast({
                type: 'message',
                user: message.user || 'Anônimo',
                message: message.message,
                timestamp: new Date().toLocaleTimeString()
            });
            
        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
        }
    });
    
    // Cliente desconectou
    ws.on('close', () => {
        console.log('👤 Cliente desconectado');
        clients.delete(ws);
        
        broadcast({
            type: 'user-left',
            message: 'Usuário saiu do chat',
            timestamp: new Date().toLocaleTimeString()
        });
    });
});

// Função para enviar mensagem para todos
function broadcast(message, exclude = null) {
    const messageStr = JSON.stringify(message);
    
    clients.forEach(client => {
        if (client !== exclude && client.readyState === WebSocket.OPEN) {
            client.send(messageStr);
        }
    });
}

// Iniciar servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`🔌 WebSocket disponível em ws://localhost:${PORT}`);
    console.log(`👥 Abra 2 abas para testar o chat`);
});
```

### 4. Criar Cliente 1 (client1.html)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Chat - Pessoa 1</title>
    <style>
        body { font-family: Arial; margin: 20px; background: #f0f0f0; }
        .chat-container { max-width: 500px; margin: 0 auto; }
        .chat-header { background: #007bff; color: white; padding: 15px; border-radius: 10px 10px 0 0; }
        .chat-messages { background: white; height: 400px; overflow-y: auto; padding: 15px; border: 1px solid #ddd; }
        .chat-input { display: flex; background: white; padding: 15px; border-radius: 0 0 10px 10px; }
        .chat-input input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .chat-input button { padding: 10px 20px; margin-left: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .message { margin: 10px 0; padding: 8px; border-radius: 5px; }
        .message.own { background: #007bff; color: white; text-align: right; }
        .message.other { background: #e9ecef; }
        .message.system { background: #28a745; color: white; text-align: center; font-style: italic; }
        .status { padding: 5px; text-align: center; font-size: 12px; color: #666; }
        .online { color: #28a745; }
        .offline { color: #dc3545; }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h2>💬 Chat WebSocket - Pessoa 1</h2>
            <div class="status" id="status">Conectando...</div>
        </div>
        
        <div class="chat-messages" id="messages"></div>
        
        <div class="chat-input">
            <input type="text" id="messageInput" placeholder="Digite sua mensagem..." onkeypress="handleKeyPress(event)">
            <button onclick="sendMessage()">Enviar</button>
        </div>
    </div>

    <script>
        const ws = new WebSocket('ws://localhost:3000');
        const messagesDiv = document.getElementById('messages');
        const messageInput = document.getElementById('messageInput');
        const statusDiv = document.getElementById('status');
        const userName = 'Pessoa 1';

        // Conexão aberta
        ws.onopen = function() {
            console.log('🔌 Conectado ao WebSocket');
            statusDiv.textContent = '🟢 Online';
            statusDiv.className = 'status online';
        };

        // Receber mensagens
        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log('📨 Mensagem recebida:', data);
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            
            if (data.type === 'system' || data.type === 'user-joined' || data.type === 'user-left') {
                messageDiv.className += ' system';
                messageDiv.innerHTML = `${data.message} <small>(${data.timestamp})</small>`;
            } else if (data.type === 'message') {
                if (data.user === userName) {
                    messageDiv.className += ' own';
                    messageDiv.innerHTML = `Você: ${data.message} <small>(${data.timestamp})</small>`;
                } else {
                    messageDiv.className += ' other';
                    messageDiv.innerHTML = `${data.user}: ${data.message} <small>(${data.timestamp})</small>`;
                }
            }
            
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        };

        // Conexão fechada
        ws.onclose = function() {
            console.log('❌ Conexão fechada');
            statusDiv.textContent = '🔴 Offline';
            statusDiv.className = 'status offline';
        };

        // Erro na conexão
        ws.onerror = function(error) {
            console.error('❌ Erro WebSocket:', error);
            statusDiv.textContent = '⚠️ Erro de conexão';
            statusDiv.className = 'status offline';
        };

        // Enviar mensagem
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    user: userName,
                    message: message
                }));
                messageInput.value = '';
            }
        }

        // Enter para enviar
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }
    </script>
</body>
</html>
```

### 5. Criar Cliente 2 (client2.html)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Chat - Pessoa 2</title>
    <style>
        body { font-family: Arial; margin: 20px; background: #f0f0f0; }
        .chat-container { max-width: 500px; margin: 0 auto; }
        .chat-header { background: #28a745; color: white; padding: 15px; border-radius: 10px 10px 0 0; }
        .chat-messages { background: white; height: 400px; overflow-y: auto; padding: 15px; border: 1px solid #ddd; }
        .chat-input { display: flex; background: white; padding: 15px; border-radius: 0 0 10px 10px; }
        .chat-input input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .chat-input button { padding: 10px 20px; margin-left: 10px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .message { margin: 10px 0; padding: 8px; border-radius: 5px; }
        .message.own { background: #28a745; color: white; text-align: right; }
        .message.other { background: #e9ecef; }
        .message.system { background: #007bff; color: white; text-align: center; font-style: italic; }
        .status { padding: 5px; text-align: center; font-size: 12px; color: #666; }
        .online { color: #28a745; }
        .offline { color: #dc3545; }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h2>💬 Chat WebSocket - Pessoa 2</h2>
            <div class="status" id="status">Conectando...</div>
        </div>
        
        <div class="chat-messages" id="messages"></div>
        
        <div class="chat-input">
            <input type="text" id="messageInput" placeholder="Digite sua mensagem..." onkeypress="handleKeyPress(event)">
            <button onclick="sendMessage()">Enviar</button>
        </div>
    </div>

    <script>
        const ws = new WebSocket('ws://localhost:3000');
        const messagesDiv = document.getElementById('messages');
        const messageInput = document.getElementById('messageInput');
        const statusDiv = document.getElementById('status');
        const userName = 'Pessoa 2';

        // Conexão aberta
        ws.onopen = function() {
            console.log('🔌 Conectado ao WebSocket');
            statusDiv.textContent = '🟢 Online';
            statusDiv.className = 'status online';
        };

        // Receber mensagens
        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log('📨 Mensagem recebida:', data);
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            
            if (data.type === 'system' || data.type === 'user-joined' || data.type === 'user-left') {
                messageDiv.className += ' system';
                messageDiv.innerHTML = `${data.message} <small>(${data.timestamp})</small>`;
            } else if (data.type === 'message') {
                if (data.user === userName) {
                    messageDiv.className += ' own';
                    messageDiv.innerHTML = `Você: ${data.message} <small>(${data.timestamp})</small>`;
                } else {
                    messageDiv.className += ' other';
                    messageDiv.innerHTML = `${data.user}: ${data.message} <small>(${data.timestamp})</small>`;
                }
            }
            
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        };

        // Conexão fechada
        ws.onclose = function() {
            console.log('❌ Conexão fechada');
            statusDiv.textContent = '🔴 Offline';
            statusDiv.className = 'status offline';
        };

        // Erro na conexão
        ws.onerror = function(error) {
            console.error('❌ Erro WebSocket:', error);
            statusDiv.textContent = '⚠️ Erro de conexão';
            statusDiv.className = 'status offline';
        };

        // Enviar mensagem
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    user: userName,
                    message: message
                }));
                messageInput.value = '';
            }
        }

        // Enter para enviar
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }
    </script>
</body>
</html>
```

## 🚀 Como Testar

### 1. Instalar Node.js
- Baixar: https://nodejs.org/
- Instalar versão LTS

### 2. Preparar Projeto
```bash
# Criar pasta
mkdir websocket-chat
cd websocket-chat

# Criar arquivos (copiar códigos acima)
# Instalar dependências
npm install
```

### 3. Iniciar Servidor
```bash
node server.js
```

### 4. Testar Chat
1. **Abrir**: http://localhost:3000 (Pessoa 1)
2. **Abrir nova aba**: http://localhost:3000/client2.html (Pessoa 2)
3. **Conversar**: Digite mensagens em ambas as abas

## 🎯 Conceitos Aprendidos

### Cliente (JavaScript)
```javascript
// Conectar
const ws = new WebSocket('ws://localhost:3000');

// Enviar mensagem
ws.send(JSON.stringify({ message: 'Olá!' }));

// Receber mensagem
ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log(data);
};
```

### Servidor (Node.js)
```javascript
// Criar servidor WebSocket
const wss = new WebSocket.Server({ port: 3000 });

// Cliente conectou
wss.on('connection', (ws) => {
    // Receber mensagem
    ws.on('message', (data) => {
        // Reenviar para todos
        wss.clients.forEach(client => {
            client.send(data);
        });
    });
});
```

## 🔥 Próximos Passos

1. **Salas de Chat**: Múltiplas salas
2. **Autenticação**: Login de usuários
3. **Histórico**: Salvar mensagens
4. **Emojis**: Suporte a emojis
5. **Arquivos**: Envio de imagens
6. **Vídeo**: Integrar WebRTC

**Agora você sabe WebSocket! 🎉**