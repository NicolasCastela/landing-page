# 🚀 GUNIC Meet - WebSocket Server

Sistema de videochamada em tempo real com WebSocket e WebRTC.

## 📋 Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **NPM** (incluído com Node.js)

## 🚀 Instalação Rápida

### Windows
1. **Execute** `start-server.bat`
2. **Aguarde** instalação das dependências
3. **Acesse** http://localhost:8080

### Manual
```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start

# Ou para desenvolvimento (auto-restart)
npm run dev
```

## 🌐 Como Usar

### 1. Iniciar Servidor
```bash
node websocket-server.js
```

### 2. Acessar Videochamada
- **URL**: http://localhost:8080
- **WebSocket**: ws://localhost:8080

### 3. Entrar na Chamada
1. Digite seu nome
2. Clique "🚀 Entrar na Chamada"
3. Permita acesso à câmera/microfone
4. Outros usuários aparecerão automaticamente

## 🔧 Funcionalidades WebSocket

### 📡 Mensagens Suportadas

#### Cliente → Servidor
- `join-room`: Entrar em uma sala
- `leave-room`: Sair da sala
- `chat-message`: Enviar mensagem no chat
- `webrtc-offer`: Enviar offer WebRTC
- `webrtc-answer`: Enviar answer WebRTC
- `webrtc-ice-candidate`: Enviar ICE candidate
- `media-state`: Atualizar estado áudio/vídeo

#### Servidor → Cliente
- `connected`: Confirmação de conexão
- `room-joined`: Confirmação de entrada na sala
- `user-joined`: Novo usuário entrou
- `user-left`: Usuário saiu
- `user-count-updated`: Atualização do contador
- `chat-message`: Nova mensagem no chat
- `webrtc-offer`: Receber offer WebRTC
- `webrtc-answer`: Receber answer WebRTC
- `webrtc-ice-candidate`: Receber ICE candidate
- `media-state-changed`: Estado da mídia mudou

## 🏗️ Arquitetura

```
Cliente 1 ←→ WebSocket Server ←→ Cliente 2
    ↓              ↓              ↓
WebRTC P2P ←→ Signaling ←→ WebRTC P2P
```

### Fluxo de Conexão
1. **Cliente** conecta ao WebSocket
2. **Servidor** atribui ID único
3. **Cliente** entra na sala
4. **Servidor** notifica outros usuários
5. **WebRTC** estabelece conexão P2P
6. **Mídia** flui diretamente entre clientes

## 📊 Monitoramento

### Logs do Servidor
```
🚀 GUNIC Meet Server rodando em http://localhost:8080
📹 WebSocket disponível em ws://localhost:8080
👤 Cliente conectado: abc123def
👤 João entrou na sala gunic-meet-room
👤 Maria entrou na sala gunic-meet-room
```

### Estatísticas
- Clientes conectados
- Salas ativas
- Usuários por sala
- Tempo de atividade

## 🔒 Segurança

### Implementado
- ✅ Validação de mensagens JSON
- ✅ Limpeza automática de salas vazias
- ✅ Tratamento de desconexões
- ✅ Limite de caracteres em mensagens

### Recomendado para Produção
- [ ] Autenticação de usuários
- [ ] Rate limiting
- [ ] HTTPS/WSS
- [ ] Validação de entrada
- [ ] Logs de auditoria

## 🚀 Deploy em Produção

### Heroku
```bash
# Criar app
heroku create gunic-meet

# Deploy
git push heroku main

# Configurar variáveis
heroku config:set NODE_ENV=production
```

### VPS/Cloud
```bash
# PM2 para produção
npm install -g pm2
pm2 start websocket-server.js --name gunic-meet
pm2 startup
pm2 save
```

## 🐛 Troubleshooting

### Servidor não inicia
```bash
# Verificar Node.js
node --version

# Reinstalar dependências
rm -rf node_modules
npm install
```

### WebSocket não conecta
- Verificar firewall na porta 8080
- Testar com `ws://localhost:8080`
- Verificar logs do servidor

### Vídeo não funciona
- Verificar permissões do navegador
- Testar em HTTPS para produção
- Verificar STUN servers

## 📝 Desenvolvimento

### Estrutura do Código
```
websocket-server.js     # Servidor principal
├── GunicMeetServer     # Classe principal
├── handleMessage()     # Processamento de mensagens
├── broadcastToRoom()   # Broadcast para sala
└── getStats()          # Estatísticas

video-chat.js          # Cliente WebSocket
├── VideoChat          # Classe principal
├── setupWebSocket()   # Conexão WebSocket
├── handleMessage()    # Processamento de mensagens
└── sendMessage()      # Envio de mensagens
```

### Adicionar Nova Funcionalidade
1. **Definir** tipo de mensagem
2. **Implementar** handler no servidor
3. **Implementar** handler no cliente
4. **Testar** comunicação bidirecional

## 📞 Suporte

- **GitHub**: Issues no repositório
- **Email**: contato@gunic.com
- **Chat**: Sistema de chat integrado

---

**🚀 Desenvolvido pela GUNIC Company**

*Conectando pessoas através da tecnologia*