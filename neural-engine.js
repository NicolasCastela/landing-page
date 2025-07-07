// 🧠 Neural Hologram Engine - GUNIC AI
class NeuralHologramEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.hologramMesh = null;
        this.emotionModel = null;
        this.gestureModel = null;
        this.isListening = false;
        this.currentEmotion = 'neutral';
        this.currentGesture = 'none';
        this.assistantPersonality = 'friendly';
        
        this.emotions = {
            happy: 0,
            surprise: 0,
            focus: 0,
            neutral: 1
        };
        
        this.responses = {
            happy: [
                "Que bom ver você sorrindo! Como posso ajudar hoje?",
                "Sua energia positiva é contagiante! ✨",
                "Adoro quando você está feliz! Vamos criar algo incrível?"
            ],
            surprise: [
                "Vejo que algo te surpreendeu! Quer que eu explique?",
                "Sua expressão de surpresa é adorável! 😮",
                "Algo interessante chamou sua atenção?"
            ],
            focus: [
                "Percebo que você está concentrado. Posso ajudar com algo específico?",
                "Vejo que está focado no trabalho. Precisa de assistência?",
                "Sua concentração é impressionante! 🎯"
            ],
            wave: [
                "Oi! 👋 Que prazer te ver!",
                "Olá! Como você está hoje?",
                "Oi! Pronto para uma experiência incrível?"
            ],
            point: [
                "O que você está apontando? Posso analisar isso!",
                "Interessante! Quer que eu foque nessa área?",
                "Vejo que algo chamou sua atenção! 👉"
            ],
            peace: [
                "Paz e amor! ✌️ Que vibe positiva!",
                "Adoro sua energia pacífica!",
                "Sinal de paz recebido! Vamos manter essa harmonia!"
            ],
            thumbs: [
                "Obrigada pelo like! 👍 Você é incrível!",
                "Que bom que está gostando! Vamos continuar!",
                "Seu feedback positivo me motiva! ✨"
            ]
        };
        
        this.init();
    }

    async init() {
        await this.setupCamera();
        this.setupThreeJS();
        this.createHologram();
        this.setupNeuralNetworks();
        this.startEmotionDetection();
        this.startGestureDetection();
        this.animate();
        
        console.log('🧠 Neural Hologram Engine inicializado');
    }

    async setupCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            
            const video = document.getElementById('cameraVideo');
            video.srcObject = stream;
            
            return new Promise((resolve) => {
                video.onloadedmetadata = () => resolve(video);
            });
        } catch (error) {
            console.error('Erro ao acessar câmera:', error);
            this.updateStatus('faceStatus', 'Erro');
        }
    }

    setupThreeJS() {
        const canvas = document.getElementById('hologramCanvas');
        
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true,
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x00ffff, 0.6);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xff0080, 1, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
        
        // Resize handler
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createHologram() {
        // Geometria do holograma (assistente virtual)
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        
        // Material holográfico
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                emotion: { value: 0 },
                color1: { value: new THREE.Color(0x00ffff) },
                color2: { value: new THREE.Color(0xff0080) }
            },
            vertexShader: `
                uniform float time;
                uniform float emotion;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vPosition = position;
                    vNormal = normal;
                    
                    vec3 pos = position;
                    pos += normal * sin(time * 2.0 + position.y * 5.0) * 0.1 * (1.0 + emotion);
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float emotion;
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    vec3 color = mix(color1, color2, sin(time + vPosition.y * 3.0) * 0.5 + 0.5);
                    
                    gl_FragColor = vec4(color * intensity * (1.0 + emotion * 0.5), intensity * 0.8);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        this.hologramMesh = new THREE.Mesh(geometry, material);
        this.hologramMesh.position.y = 1;
        this.scene.add(this.hologramMesh);
        
        // Partículas neurais
        this.createNeuralParticles();
    }

    createNeuralParticles() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.2 + 0.5, 1, 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        this.neuralParticles = particles;
    }

    async setupNeuralNetworks() {
        // Simular carregamento de modelos de IA
        try {
            console.log('🧠 Carregando modelos neurais...');
            
            // Simular modelo de emoções
            await this.simulateModelLoad('emotion-detection');
            this.updateStatus('emotionStatus', 'Ativo');
            
            // Simular modelo de gestos
            await this.simulateModelLoad('gesture-recognition');
            this.updateStatus('gestureStatus', 'Ativo');
            
            console.log('✅ Modelos neurais carregados');
        } catch (error) {
            console.error('Erro ao carregar modelos:', error);
        }
    }

    simulateModelLoad(modelName) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`✅ Modelo ${modelName} carregado`);
                resolve();
            }, 1000);
        });
    }

    startEmotionDetection() {
        setInterval(() => {
            this.detectEmotions();
        }, 2000);
    }

    startGestureDetection() {
        setInterval(() => {
            this.detectGestures();
        }, 1500);
    }

    detectEmotions() {
        // Simular detecção de emoções
        const emotions = ['happy', 'surprise', 'focus', 'neutral'];
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        
        // Reset emotions
        Object.keys(this.emotions).forEach(key => {
            this.emotions[key] = 0;
        });
        
        // Set detected emotion
        this.emotions[randomEmotion] = Math.random() * 0.8 + 0.2;
        this.currentEmotion = randomEmotion;
        
        // Update UI
        this.updateEmotionBars();
        
        // Respond to emotion
        if (randomEmotion !== 'neutral' && Math.random() > 0.7) {
            this.respondToEmotion(randomEmotion);
        }
        
        // Update hologram
        this.updateHologramEmotion();
    }

    detectGestures() {
        // Simular detecção de gestos
        const gestures = ['wave', 'point', 'peace', 'thumbs', 'none'];
        const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
        
        if (randomGesture !== 'none' && randomGesture !== this.currentGesture) {
            this.currentGesture = randomGesture;
            this.respondToGesture(randomGesture);
            this.highlightGestureButton(randomGesture);
        }
    }

    updateEmotionBars() {
        document.getElementById('happyLevel').style.width = (this.emotions.happy * 100) + '%';
        document.getElementById('surpriseLevel').style.width = (this.emotions.surprise * 100) + '%';
        document.getElementById('focusLevel').style.width = (this.emotions.focus * 100) + '%';
    }

    respondToEmotion(emotion) {
        const responses = this.responses[emotion];
        if (responses) {
            const response = responses[Math.floor(Math.random() * responses.length)];
            this.speakAssistant(response);
        }
    }

    respondToGesture(gesture) {
        const responses = this.responses[gesture];
        if (responses) {
            const response = responses[Math.floor(Math.random() * responses.length)];
            this.speakAssistant(response);
        }
    }

    speakAssistant(text) {
        const speechElement = document.getElementById('assistantSpeech');
        speechElement.textContent = text;
        
        // Animação de fala
        speechElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            speechElement.style.transform = 'scale(1)';
        }, 300);
        
        // Text-to-speech (se disponível)
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.9;
            utterance.pitch = 1.2;
            speechSynthesis.speak(utterance);
        }
    }

    updateHologramEmotion() {
        if (this.hologramMesh) {
            const emotionIntensity = Math.max(...Object.values(this.emotions));
            this.hologramMesh.material.uniforms.emotion.value = emotionIntensity;
            
            // Mudar cor baseado na emoção
            if (this.currentEmotion === 'happy') {
                this.hologramMesh.material.uniforms.color1.value.setHex(0x00ff88);
            } else if (this.currentEmotion === 'surprise') {
                this.hologramMesh.material.uniforms.color1.value.setHex(0xffaa00);
            } else if (this.currentEmotion === 'focus') {
                this.hologramMesh.material.uniforms.color1.value.setHex(0x8800ff);
            } else {
                this.hologramMesh.material.uniforms.color1.value.setHex(0x00ffff);
            }
        }
    }

    highlightGestureButton(gesture) {
        // Remove highlight de todos os botões
        document.querySelectorAll('.gesture-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Adiciona highlight ao botão correspondente
        const gestureMap = {
            wave: 0,
            point: 1,
            peace: 2,
            thumbs: 3
        };
        
        const buttons = document.querySelectorAll('.gesture-btn');
        if (buttons[gestureMap[gesture]]) {
            buttons[gestureMap[gesture]].classList.add('active');
            setTimeout(() => {
                buttons[gestureMap[gesture]].classList.remove('active');
            }, 2000);
        }
    }

    updateStatus(statusId, status) {
        const element = document.getElementById(statusId);
        if (element) {
            element.textContent = status;
            element.className = status === 'Ativo' || status === 'Renderizando' ? 'status-active' : '';
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Animar holograma
        if (this.hologramMesh) {
            this.hologramMesh.rotation.y += 0.01;
            this.hologramMesh.material.uniforms.time.value = time;
            
            // Flutuação baseada na emoção
            const emotionFloat = Math.sin(time * 2) * 0.2 * (1 + this.emotions[this.currentEmotion]);
            this.hologramMesh.position.y = 1 + emotionFloat;
        }
        
        // Animar partículas neurais
        if (this.neuralParticles) {
            this.neuralParticles.rotation.y += 0.002;
            this.neuralParticles.rotation.x += 0.001;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Instância global
const neuralEngine = new NeuralHologramEngine();

// Funções globais
function activateGesture(gesture) {
    neuralEngine.currentGesture = gesture;
    neuralEngine.respondToGesture(gesture);
    neuralEngine.highlightGestureButton(gesture);
}

function toggleVoiceInput() {
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceStatus = document.getElementById('voiceStatus');
    
    if (!neuralEngine.isListening) {
        // Iniciar escuta
        neuralEngine.isListening = true;
        voiceBtn.classList.add('listening');
        voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        voiceStatus.textContent = 'Escutando...';
        
        // Simular reconhecimento de voz
        setTimeout(() => {
            const voiceCommands = [
                "Olá ARIA, como você está?",
                "Mostre-me os projetos da GUNIC",
                "Explique sobre inteligência artificial",
                "Como funciona a realidade aumentada?"
            ];
            
            const command = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
            processVoiceCommand(command);
        }, 3000);
        
    } else {
        // Parar escuta
        stopVoiceInput();
    }
}

function stopVoiceInput() {
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceStatus = document.getElementById('voiceStatus');
    
    neuralEngine.isListening = false;
    voiceBtn.classList.remove('listening');
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceStatus.textContent = 'Clique para falar';
}

function processVoiceCommand(command) {
    console.log('🎤 Comando de voz:', command);
    
    const responses = {
        "olá": "Olá! É um prazer falar com você! Como posso ajudar?",
        "projetos": "A GUNIC tem projetos incríveis em IA, AR, sistemas médicos e muito mais!",
        "inteligência artificial": "IA é o futuro! Uso redes neurais para entender emoções e gestos.",
        "realidade aumentada": "AR combina mundo real com virtual. É mágico, não é?"
    };
    
    let response = "Interessante! Posso ajudar com mais alguma coisa?";
    
    for (let key in responses) {
        if (command.toLowerCase().includes(key)) {
            response = responses[key];
            break;
        }
    }
    
    neuralEngine.speakAssistant(response);
    stopVoiceInput();
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧠 Neural Hologram Interface carregada');
    
    // Verificar suporte a WebGL
    if (!window.WebGLRenderingContext) {
        console.error('WebGL não suportado');
        neuralEngine.updateStatus('hologramStatus', 'Erro');
    }
    
    // Mensagem de boas-vindas
    setTimeout(() => {
        neuralEngine.speakAssistant("Sistema neural inicializado! Posso ver suas emoções e gestos. Experimente acenar para mim!");
    }, 2000);
});