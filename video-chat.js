// 📹 GUNIC Meet - WebRTC Video Chat
class VideoChat {
    constructor() {
        this.localStream = null;
        this.remoteStream = null;
        this.peerConnection = null;
        this.socket = null;
        this.userName = '';
        this.roomId = 'gunic-meet-room';
        this.isAudioEnabled = true;
        this.isVideoEnabled = true;
        this.connectedUsers = 0;
        
        this.init();
    }

    init() {
        this.setupWebSocket();
        console.log('📹 GUNIC Meet inicializado');
    }

    setupWebSocket() {
        // Conectar ao servidor WebSocket real
        const wsUrl = 'ws://localhost:8080';
        
        try {
            this.socket = new WebSocket(wsUrl);
            
            this.socket.onopen = () => {
                console.log('🔗 Conectado ao servidor WebSocket');
            };
            
            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                this.handleWebSocketMessage(message);
            };
            
            this.socket.onclose = () => {
                console.log('❌ Conexão WebSocket fechada');
                // Tentar reconectar após 3 segundos
                setTimeout(() => {
                    this.setupWebSocket();
                }, 3000);
            };
            
            this.socket.onerror = (error) => {
                console.error('❌ Erro WebSocket:', error);
            };
            
        } catch (error) {
            console.error('❌ Erro ao conectar WebSocket:', error);
            // Fallback para simulação local
            this.simulateWebSocket();
        }
    }

    simulateWebSocket() {
        console.log('⚠️ Usando simulação WebSocket (servidor offline)');
        // Simular conexão WebSocket usando localStorage e eventos
        window.addEventListener('storage', (e) => {
            if (e.key === 'gunic-meet-messages') {
                const message = JSON.parse(e.newValue);
                this.handleWebSocketMessage(message);
            }
        });
        
        // Simular usuários conectados
        setInterval(() => {
            this.updateUserCount();
        }, 5000);
    }

    sendWebSocketMessage(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            // Enviar via WebSocket real
            this.socket.send(JSON.stringify(message));
        } else {
            // Fallback para simulação local
            const timestamp = Date.now();
            const messageWithId = { ...message, timestamp, sender: this.userName };
            localStorage.setItem('gunic-meet-messages', JSON.stringify(messageWithId));
            
            // Simular recebimento para outros usuários
            setTimeout(() => {
                if (message.type === 'chat-message') {
                    this.addChatMessage(this.userName, message.data.message, true);
                }
            }, 100);
        }
    }

    handleWebSocketMessage(message) {
        switch (message.type) {
            case 'connected':
                this.clientId = message.clientId;
                console.log('🆔 ID do cliente:', this.clientId);
                break;
            case 'room-joined':
                this.handleRoomJoined(message.data);
                break;
            case 'user-joined':
                this.handleUserJoined(message.data);
                break;
            case 'user-left':
                this.handleUserLeft(message.data);
                break;
            case 'user-count-updated':
                this.updateUserCountFromServer(message.data.count);
                break;
            case 'chat-message':
                this.addChatMessage(message.data.userName, message.data.message);
                break;
            case 'webrtc-offer':
                this.handleWebRTCOffer(message.data);
                break;
            case 'webrtc-answer':
                this.handleWebRTCAnswer(message.data);
                break;
            case 'webrtc-ice-candidate':
                this.handleWebRTCIceCandidate(message.data);
                break;
            case 'media-state-changed':
                this.handleMediaStateChanged(message.data);
                break;
        }
    }

    async joinMeeting() {
        const nameInput = document.getElementById('userName');
        this.userName = nameInput.value.trim() || 'Usuário';
        
        try {
            // Solicitar permissões de mídia
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            
            // Mostrar vídeo local
            const localVideo = document.getElementById('localVideo');
            localVideo.srcObject = this.localStream;
            
            // Atualizar info do usuário
            document.getElementById('localUserInfo').textContent = this.userName;
            
            // Esconder overlay
            document.getElementById('joinOverlay').style.display = 'none';
            
            // Configurar WebRTC
            this.setupPeerConnection();
            
            // Entrar na sala
            this.sendWebSocketMessage({
                type: 'join-room',
                data: { 
                    roomId: this.roomId,
                    userName: this.userName 
                }
            });
            
            // Adicionar mensagem de entrada no chat
            this.addChatMessage('Sistema', `${this.userName} entrou na chamada`);
            
            console.log('📹 Usuário entrou na chamada:', this.userName);
            
        } catch (error) {
            console.error('Erro ao acessar mídia:', error);
            alert('Erro ao acessar câmera/microfone. Verifique as permissões.');
        }
    }

    setupPeerConnection() {
        // Configuração STUN servers (gratuitos)
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };
        
        this.peerConnection = new RTCPeerConnection(configuration);
        
        // Adicionar stream local
        this.localStream.getTracks().forEach(track => {
            this.peerConnection.addTrack(track, this.localStream);
        });
        
        // Lidar com stream remoto
        this.peerConnection.ontrack = (event) => {
            this.remoteStream = event.streams[0];
            this.displayRemoteVideo();
        };
        
        // Lidar com ICE candidates
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.sendWebSocketMessage({
                    type: 'ice-candidate',
                    data: event.candidate
                });
            }
        };
        
        // Simular conexão com outro usuário após 3 segundos
        setTimeout(() => {
            this.simulateRemoteUser();
        }, 3000);
    }

    async simulateRemoteUser() {
        // Simular outro usuário conectando
        const remoteUsers = ['Ana Silva', 'João Santos', 'Maria Costa', 'Pedro Lima'];
        const randomUser = remoteUsers[Math.floor(Math.random() * remoteUsers.length)];
        
        this.handleUserJoined({ name: randomUser });
        
        // Simular vídeo remoto (placeholder)
        this.createRemoteVideoPlaceholder(randomUser);
    }

    createRemoteVideoPlaceholder(userName) {
        const remoteContainer = document.getElementById('remoteContainer');
        remoteContainer.innerHTML = `
            <div class="video-placeholder" style="background: linear-gradient(45deg, #667eea, #764ba2);">
                <div style="font-size: 3rem; margin-bottom: 10px;">👤</div>
                <div>${userName}</div>
                <div style="font-size: 0.8rem; margin-top: 5px;">Câmera desligada</div>
            </div>
            <div class="user-info">${userName}</div>
        `;
    }

    displayRemoteVideo() {
        const remoteContainer = document.getElementById('remoteContainer');
        remoteContainer.innerHTML = `
            <video class="video-stream" autoplay></video>
            <div class="user-info">Usuário Remoto</div>
        `;
        
        const remoteVideo = remoteContainer.querySelector('video');
        remoteVideo.srcObject = this.remoteStream;
    }

    handleUserJoined(data) {
        this.connectedUsers++;
        this.updateUserCount();
        this.addChatMessage('Sistema', `${data.name} entrou na chamada`);
    }

    handleUserLeft(data) {
        this.connectedUsers = Math.max(0, this.connectedUsers - 1);
        this.updateUserCount();
        this.addChatMessage('Sistema', `${data.name} saiu da chamada`);
    }

    updateUserCount() {
        // Simular contagem de usuários (1 + usuários simulados)
        const baseCount = 1; // Usuário atual
        const simulatedUsers = Math.floor(Math.random() * 3); // 0-2 usuários simulados
        const totalUsers = baseCount + simulatedUsers;
        
        document.getElementById('usersCount').textContent = `👥 Usuários: ${totalUsers}`;
    }
    
    updateUserCountFromServer(count) {
        document.getElementById('usersCount').textContent = `👥 Usuários: ${count}`;
    }
    
    handleRoomJoined(data) {
        console.log('🏠 Entrou na sala:', data.roomId);
        console.log('👥 Usuários na sala:', data.users);
        this.updateUserCountFromServer(data.userCount);
    }
    
    handleWebRTCOffer(data) {
        console.log('📞 Recebeu offer de:', data.fromClientId);
        // Implementar lógica de WebRTC offer
    }
    
    handleWebRTCAnswer(data) {
        console.log('📞 Recebeu answer de:', data.fromClientId);
        // Implementar lógica de WebRTC answer
    }
    
    handleWebRTCIceCandidate(data) {
        console.log('🧊 Recebeu ICE candidate de:', data.fromClientId);
        // Implementar lógica de ICE candidate
    }
    
    handleMediaStateChanged(data) {
        console.log('🎥 Estado da mídia mudou:', data);
        // Atualizar interface para mostrar estado da mídia de outros usuários
    }

    toggleMic() {
        this.isAudioEnabled = !this.isAudioEnabled;
        const micBtn = document.getElementById('micBtn');
        
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = this.isAudioEnabled;
            });
        }
        
        if (this.isAudioEnabled) {
            micBtn.textContent = '🎤';
            micBtn.classList.remove('muted');
        } else {
            micBtn.textContent = '🔇';
            micBtn.classList.add('muted');
        }
        
        // Notificar mudança de estado da mídia
        this.sendWebSocketMessage({
            type: 'media-state',
            data: {
                audioEnabled: this.isAudioEnabled,
                videoEnabled: this.isVideoEnabled
            }
        });
    }

    toggleCamera() {
        this.isVideoEnabled = !this.isVideoEnabled;
        const cameraBtn = document.getElementById('cameraBtn');
        const localVideo = document.getElementById('localVideo');
        
        if (this.localStream) {
            this.localStream.getVideoTracks().forEach(track => {
                track.enabled = this.isVideoEnabled;
            });
        }
        
        if (this.isVideoEnabled) {
            cameraBtn.textContent = '📹';
            cameraBtn.classList.remove('off');
            localVideo.style.display = 'block';
        } else {
            cameraBtn.textContent = '📷';
            cameraBtn.classList.add('off');
            localVideo.style.display = 'none';
        }
        
        // Notificar mudança de estado da mídia
        this.sendWebSocketMessage({
            type: 'media-state',
            data: {
                audioEnabled: this.isAudioEnabled,
                videoEnabled: this.isVideoEnabled
            }
        });
    }

    leaveMeeting() {
        if (confirm('Tem certeza que deseja sair da chamada?')) {
            // Parar streams
            if (this.localStream) {
                this.localStream.getTracks().forEach(track => track.stop());
            }
            
            // Fechar conexão
            if (this.peerConnection) {
                this.peerConnection.close();
            }
            
            // Sair da sala
            this.sendWebSocketMessage({
                type: 'leave-room',
                data: {}
            });
            
            // Voltar para página inicial
            window.location.href = 'index.html';
        }
    }

    toggleChat() {
        const chatPanel = document.getElementById('chatPanel');
        chatPanel.classList.toggle('open');
    }

    addChatMessage(user, message, isOwn = false) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        
        if (isOwn) {
            messageDiv.style.background = 'rgba(255, 0, 128, 0.1)';
            messageDiv.style.borderLeftColor = 'var(--secondary-color)';
        }
        
        messageDiv.innerHTML = `
            <div class="message-user">${user}</div>
            <div>${message}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Auto-remover mensagens antigas (máximo 50)
        const messages = chatMessages.querySelectorAll('.chat-message');
        if (messages.length > 50) {
            messages[0].remove();
        }
    }

    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (message) {
            this.sendWebSocketMessage({
                type: 'chat-message',
                data: { message: message }
            });
            
            chatInput.value = '';
        }
    }

    // Handlers para WebRTC (implementação básica)
    async handleOffer(offer) {
        if (!this.peerConnection) return;
        
        await this.peerConnection.setRemoteDescription(offer);
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        
        this.sendWebSocketMessage({
            type: 'answer',
            data: answer
        });
    }

    async handleAnswer(answer) {
        if (!this.peerConnection) return;
        await this.peerConnection.setRemoteDescription(answer);
    }

    async handleIceCandidate(candidate) {
        if (!this.peerConnection) return;
        await this.peerConnection.addIceCandidate(candidate);
    }
}

// Instância global
const videoChat = new VideoChat();

// Funções globais
function joinMeeting() {
    videoChat.joinMeeting();
}

function toggleMic() {
    videoChat.toggleMic();
}

function toggleCamera() {
    videoChat.toggleCamera();
}

function leaveMeeting() {
    videoChat.leaveMeeting();
}

function toggleChat() {
    videoChat.toggleChat();
}

function sendMessage() {
    videoChat.sendMessage();
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('📹 GUNIC Meet Interface carregada');
    
    // Focar no input de nome
    document.getElementById('userName').focus();
    
    // Enter para entrar na chamada
    document.getElementById('userName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            joinMeeting();
        }
    });
});