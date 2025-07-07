// 🎮 Metaverse Engine - GUNIC World 3D
class MetaverseEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.world = null;
        this.player = null;
        this.playerBody = null;
        this.controls = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.isPointerLocked = false;
        this.isVoiceActive = false;
        this.isChatOpen = false;
        
        this.playerConfig = {
            name: 'Jogador',
            avatar: '🧑',
            primaryColor: '#00ffff',
            secondaryColor: '#ff0080',
            speed: 0.2,
            movementStyle: 'walk'
        };
        
        this.otherPlayers = new Map();
        this.chatMessages = [];
        this.voiceRecognition = null;
        
        this.worldObjects = [];
        this.interactables = [];
        
        this.init();
    }

    async init() {
        this.showLoading();
        await this.setupThreeJS();
        this.setupPhysics();
        this.setupControls();
        this.setupVoice();
        this.createWorld();
        this.setupEventListeners();
        this.hideLoading();
        this.animate();
        
        console.log('🎮 Metaverse Engine inicializado');
    }

    showLoading() {
        document.getElementById('loadingWorld').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingWorld').classList.remove('active');
    }

    setupThreeJS() {
        const canvas = document.getElementById('gameCanvas');
        
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 0, 1000);
        
        // Camera (First Person)
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Resize handler
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupPhysics() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -30, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;
    }

    setupControls() {
        // Keyboard controls
        this.controls = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            run: false
        };
        
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
        
        // Mouse controls
        document.addEventListener('mousemove', (event) => this.onMouseMove(event));
        document.addEventListener('click', () => this.requestPointerLock());
    }

    setupVoice() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.voiceRecognition = new SpeechRecognition();
            this.voiceRecognition.continuous = true;
            this.voiceRecognition.interimResults = true;
            this.voiceRecognition.lang = 'pt-BR';
            
            this.voiceRecognition.onresult = (event) => {
                const result = event.results[event.results.length - 1];
                if (result.isFinal) {
                    this.handleVoiceCommand(result[0].transcript);
                }
            };
            
            this.voiceRecognition.onerror = (event) => {
                console.error('Erro no reconhecimento de voz:', event.error);
            };
        }
    }

    createWorld() {
        this.createTerrain();
        this.createBuildings();
        this.createTrees();
        this.createInteractables();
        this.createSkybox();
        this.spawnOtherPlayers();
    }

    createTerrain() {
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x90EE90,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Physics ground
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.add(groundBody);
        
        // Hills
        for (let i = 0; i < 10; i++) {
            const hillGeometry = new THREE.SphereGeometry(Math.random() * 5 + 2, 8, 8);
            const hillMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
            const hill = new THREE.Mesh(hillGeometry, hillMaterial);
            hill.position.set(
                (Math.random() - 0.5) * 150,
                -2,
                (Math.random() - 0.5) * 150
            );
            hill.receiveShadow = true;
            this.scene.add(hill);
        }
    }

    createBuildings() {
        // GUNIC Headquarters
        const hqGeometry = new THREE.BoxGeometry(20, 15, 20);
        const hqMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4169E1,
            transparent: true,
            opacity: 0.9
        });
        const hq = new THREE.Mesh(hqGeometry, hqMaterial);
        hq.position.set(0, 7.5, -30);
        hq.castShadow = true;
        hq.receiveShadow = true;
        this.scene.add(hq);
        
        // HQ Physics
        const hqShape = new CANNON.Box(new CANNON.Vec3(10, 7.5, 10));
        const hqBody = new CANNON.Body({ mass: 0 });
        hqBody.addShape(hqShape);
        hqBody.position.set(0, 7.5, -30);
        this.world.add(hqBody);
        
        // GUNIC Logo on building
        const logoGeometry = new THREE.PlaneGeometry(8, 2);
        const logoMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 0.8
        });
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.position.set(0, 12, -19.9);
        this.scene.add(logo);
        
        // Other buildings
        for (let i = 0; i < 8; i++) {
            const buildingGeometry = new THREE.BoxGeometry(
                Math.random() * 8 + 4,
                Math.random() * 20 + 5,
                Math.random() * 8 + 4
            );
            const buildingMaterial = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.5, 0.6)
            });
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            building.position.set(
                (Math.random() - 0.5) * 100,
                buildingGeometry.parameters.height / 2,
                (Math.random() - 0.5) * 100
            );
            building.castShadow = true;
            building.receiveShadow = true;
            this.scene.add(building);
            
            // Building physics
            const buildingShape = new CANNON.Box(new CANNON.Vec3(
                buildingGeometry.parameters.width / 2,
                buildingGeometry.parameters.height / 2,
                buildingGeometry.parameters.depth / 2
            ));
            const buildingBody = new CANNON.Body({ mass: 0 });
            buildingBody.addShape(buildingShape);
            buildingBody.position.copy(building.position);
            this.world.add(buildingBody);
        }
    }

    createTrees() {
        for (let i = 0; i < 20; i++) {
            // Trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 4);
            const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            
            // Leaves
            const leavesGeometry = new THREE.SphereGeometry(3, 8, 8);
            const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
            const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
            leaves.position.y = 5;
            
            const tree = new THREE.Group();
            tree.add(trunk);
            tree.add(leaves);
            tree.position.set(
                (Math.random() - 0.5) * 120,
                2,
                (Math.random() - 0.5) * 120
            );
            tree.castShadow = true;
            this.scene.add(tree);
            
            // Tree physics (simplified)
            const treeShape = new CANNON.Cylinder(0.5, 0.8, 4, 8);
            const treeBody = new CANNON.Body({ mass: 0 });
            treeBody.addShape(treeShape);
            treeBody.position.set(tree.position.x, 2, tree.position.z);
            this.world.add(treeBody);
        }
    }

    createInteractables() {
        // Teleport pads
        for (let i = 0; i < 3; i++) {
            const padGeometry = new THREE.CylinderGeometry(3, 3, 0.5);
            const padMaterial = new THREE.MeshPhongMaterial({
                color: 0x00ffff,
                emissive: 0x004444,
                transparent: true,
                opacity: 0.7
            });
            const pad = new THREE.Mesh(padGeometry, padMaterial);
            pad.position.set(
                (i - 1) * 30,
                0.25,
                20
            );
            pad.userData = { type: 'teleport', destination: i };
            this.scene.add(pad);
            this.interactables.push(pad);
        }
        
        // Info boards
        const boardGeometry = new THREE.PlaneGeometry(4, 3);
        const boardMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x333333,
            transparent: true,
            opacity: 0.8
        });
        const board = new THREE.Mesh(boardGeometry, boardMaterial);
        board.position.set(10, 3, 0);
        board.userData = { type: 'info', message: 'Bem-vindo ao GUNIC Metaverse!' };
        this.scene.add(board);
        this.interactables.push(board);
    }

    createSkybox() {
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x87CEEB,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.8
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
        
        // Clouds
        for (let i = 0; i < 10; i++) {
            const cloudGeometry = new THREE.SphereGeometry(Math.random() * 10 + 5, 8, 8);
            const cloudMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                (Math.random() - 0.5) * 400,
                Math.random() * 50 + 30,
                (Math.random() - 0.5) * 400
            );
            this.scene.add(cloud);
        }
    }

    spawnOtherPlayers() {
        // Simulate other players
        const playerNames = ['Ana', 'João', 'Maria', 'Pedro', 'Sofia'];
        const avatars = ['👩', '👨', '👧', '👦', '🧑'];
        
        for (let i = 0; i < 3; i++) {
            const playerId = 'bot_' + i;
            const playerData = {
                name: playerNames[i],
                avatar: avatars[i],
                position: {
                    x: (Math.random() - 0.5) * 50,
                    y: 2,
                    z: (Math.random() - 0.5) * 50
                },
                color: `hsl(${Math.random() * 360}, 70%, 50%)`
            };
            
            this.createOtherPlayer(playerId, playerData);
            this.otherPlayers.set(playerId, playerData);
        }
        
        this.updatePlayersList();
    }

    createOtherPlayer(playerId, playerData) {
        // Player body
        const playerGeometry = new THREE.CapsuleGeometry(1, 2);
        const playerMaterial = new THREE.MeshPhongMaterial({ 
            color: playerData.color,
            transparent: true,
            opacity: 0.8
        });
        const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
        playerMesh.position.copy(playerData.position);
        playerMesh.castShadow = true;
        playerMesh.userData = { playerId: playerId };
        this.scene.add(playerMesh);
        
        // Player name tag
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, 256, 64);
        context.fillStyle = 'white';
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.fillText(playerData.name, 128, 40);
        
        const nameTexture = new THREE.CanvasTexture(canvas);
        const nameMaterial = new THREE.SpriteMaterial({ map: nameTexture });
        const nameSprite = new THREE.Sprite(nameMaterial);
        nameSprite.position.set(playerData.position.x, playerData.position.y + 3, playerData.position.z);
        nameSprite.scale.set(4, 1, 1);
        this.scene.add(nameSprite);
        
        // Store references
        playerData.mesh = playerMesh;
        playerData.nameTag = nameSprite;
        
        // Animate other players
        this.animateOtherPlayer(playerId);
    }

    animateOtherPlayer(playerId) {
        const playerData = this.otherPlayers.get(playerId);
        if (!playerData) return;
        
        setInterval(() => {
            // Random movement
            const newX = playerData.position.x + (Math.random() - 0.5) * 5;
            const newZ = playerData.position.z + (Math.random() - 0.5) * 5;
            
            // Keep within bounds
            playerData.position.x = Math.max(-80, Math.min(80, newX));
            playerData.position.z = Math.max(-80, Math.min(80, newZ));
            
            if (playerData.mesh) {
                playerData.mesh.position.copy(playerData.position);
                playerData.nameTag.position.set(
                    playerData.position.x,
                    playerData.position.y + 3,
                    playerData.position.z
                );
            }
        }, 2000 + Math.random() * 3000);
    }

    createPlayer() {
        // Player physics body
        const playerShape = new CANNON.Sphere(1);
        this.playerBody = new CANNON.Body({ mass: 1 });
        this.playerBody.addShape(playerShape);
        this.playerBody.position.set(0, 5, 0);
        this.playerBody.material = new CANNON.Material();
        this.playerBody.material.friction = 0.4;
        this.world.add(this.playerBody);
        
        // Player visual (invisible in first person)
        const playerGeometry = new THREE.CapsuleGeometry(1, 2);
        const playerMaterial = new THREE.MeshPhongMaterial({ 
            color: this.playerConfig.primaryColor,
            transparent: true,
            opacity: 0.5
        });
        this.player = new THREE.Mesh(playerGeometry, playerMaterial);
        this.player.visible = false; // Hidden in first person
        this.scene.add(this.player);
    }

    setupEventListeners() {
        // Pointer lock
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement === document.getElementById('gameCanvas');
        });
    }

    requestPointerLock() {
        const canvas = document.getElementById('gameCanvas');
        canvas.requestPointerLock();
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW': this.controls.forward = true; break;
            case 'KeyS': this.controls.backward = true; break;
            case 'KeyA': this.controls.left = true; break;
            case 'KeyD': this.controls.right = true; break;
            case 'Space': this.controls.jump = true; event.preventDefault(); break;
            case 'ShiftLeft': this.controls.run = true; break;
            case 'KeyT': this.toggleChat(); break;
            case 'KeyV': this.toggleVoice(); break;
            case 'KeyH': this.toggleHelp(); break;
            case 'Tab': this.togglePlayersList(); event.preventDefault(); break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW': this.controls.forward = false; break;
            case 'KeyS': this.controls.backward = false; break;
            case 'KeyA': this.controls.left = false; break;
            case 'KeyD': this.controls.right = false; break;
            case 'Space': this.controls.jump = false; break;
            case 'ShiftLeft': this.controls.run = false; break;
        }
    }

    onMouseMove(event) {
        if (!this.isPointerLocked) return;
        
        this.mouseX += event.movementX * 0.002;
        this.mouseY += event.movementY * 0.002;
        this.mouseY = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.mouseY));
    }

    updatePlayer() {
        if (!this.playerBody) return;
        
        // Camera rotation
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = -this.mouseX;
        this.camera.rotation.x = -this.mouseY;
        
        // Movement
        const direction = new THREE.Vector3();
        const speed = this.controls.run ? this.playerConfig.speed * 2 : this.playerConfig.speed;
        
        if (this.controls.forward) direction.z -= speed;
        if (this.controls.backward) direction.z += speed;
        if (this.controls.left) direction.x -= speed;
        if (this.controls.right) direction.x += speed;
        
        // Apply camera rotation to movement
        direction.applyQuaternion(this.camera.quaternion);
        direction.y = 0; // No vertical movement from WASD
        
        this.playerBody.velocity.x = direction.x * 50;
        this.playerBody.velocity.z = direction.z * 50;
        
        // Jump
        if (this.controls.jump && Math.abs(this.playerBody.velocity.y) < 0.1) {
            this.playerBody.velocity.y = 15;
        }
        
        // Update camera position
        this.camera.position.copy(this.playerBody.position);
        this.camera.position.y += 1.5; // Eye level
        
        // Update player mesh position
        if (this.player) {
            this.player.position.copy(this.playerBody.position);
        }
        
        // Update UI
        this.updatePlayerUI();
    }

    updatePlayerUI() {
        const pos = this.playerBody.position;
        document.getElementById('playerPosition').textContent = 
            `${Math.round(pos.x)}, ${Math.round(pos.y)}, ${Math.round(pos.z)}`;
        
        document.getElementById('onlineCount').textContent = this.otherPlayers.size + 1;
    }

    updatePlayersList() {
        const container = document.getElementById('playersContainer');
        container.innerHTML = '';
        
        // Add current player
        const currentPlayer = document.createElement('div');
        currentPlayer.className = 'player-item';
        currentPlayer.innerHTML = `
            <div class="player-avatar-mini">${this.playerConfig.avatar}</div>
            <span>${this.playerConfig.name} (Você)</span>
        `;
        container.appendChild(currentPlayer);
        
        // Add other players
        this.otherPlayers.forEach((player, id) => {
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item';
            playerItem.innerHTML = `
                <div class="player-avatar-mini">${player.avatar}</div>
                <span>${player.name}</span>
            `;
            container.appendChild(playerItem);
        });
    }

    handleVoiceCommand(command) {
        console.log('🎤 Comando de voz:', command);
        
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand.includes('teleport') || lowerCommand.includes('teletransporte')) {
            this.teleportToRandomLocation();
        } else if (lowerCommand.includes('pular') || lowerCommand.includes('jump')) {
            this.controls.jump = true;
            setTimeout(() => this.controls.jump = false, 100);
        } else if (lowerCommand.includes('correr') || lowerCommand.includes('run')) {
            this.controls.run = !this.controls.run;
        } else {
            // Send as chat message
            this.addChatMessage(this.playerConfig.name, command, true);
        }
    }

    teleportToRandomLocation() {
        if (this.playerBody) {
            this.playerBody.position.set(
                (Math.random() - 0.5) * 80,
                10,
                (Math.random() - 0.5) * 80
            );
            this.addChatMessage('Sistema', `${this.playerConfig.name} se teletransportou!`);
        }
    }

    addChatMessage(sender, message, isVoice = false) {
        const chatBox = document.getElementById('chatBox');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        messageDiv.innerHTML = `
            <strong>${sender}:</strong> ${message}
            ${isVoice ? ' 🎤' : ''}
        `;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 10000);
    }

    toggleVoice() {
        if (!this.voiceRecognition) {
            alert('Reconhecimento de voz não suportado neste navegador');
            return;
        }
        
        this.isVoiceActive = !this.isVoiceActive;
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        
        if (this.isVoiceActive) {
            this.voiceRecognition.start();
            voiceBtn.classList.add('active');
            voiceStatus.textContent = 'Escutando...';
        } else {
            this.voiceRecognition.stop();
            voiceBtn.classList.remove('active');
            voiceStatus.textContent = 'Clique para falar';
        }
    }

    toggleChat() {
        this.isChatOpen = !this.isChatOpen;
        const chatBox = document.getElementById('chatBox');
        const chatInput = document.getElementById('chatInput');
        
        if (this.isChatOpen) {
            chatBox.classList.add('active');
            chatInput.classList.add('active');
            chatInput.focus();
        } else {
            chatBox.classList.remove('active');
            chatInput.classList.remove('active');
        }
    }

    toggleHelp() {
        const controlsHelp = document.getElementById('controlsHelp');
        controlsHelp.classList.toggle('active');
    }

    togglePlayersList() {
        const playersList = document.getElementById('playersList');
        playersList.classList.toggle('active');
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update physics
        this.world.step(1/60);
        
        // Update player
        this.updatePlayer();
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Instância global
let metaverseEngine = null;

// Funções globais
function enterWorld() {
    // Get player configuration
    const playerName = document.getElementById('playerName').value || 'Jogador';
    const avatarEmoji = document.getElementById('avatarEmoji').value;
    const primaryColor = document.getElementById('primaryColor').value;
    const secondaryColor = document.getElementById('secondaryColor').value;
    const playerSpeed = parseFloat(document.getElementById('playerSpeed').value);
    const movementStyle = document.getElementById('movementStyle').value;
    
    // Update engine config
    if (!metaverseEngine) {
        metaverseEngine = new MetaverseEngine();
    }
    
    metaverseEngine.playerConfig = {
        name: playerName,
        avatar: avatarEmoji,
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        speed: playerSpeed,
        movementStyle: movementStyle
    };
    
    // Create player
    metaverseEngine.createPlayer();
    
    // Hide avatar creator
    document.getElementById('avatarCreator').classList.add('hidden');
    
    // Show game HUD
    document.getElementById('gameHUD').classList.add('active');
    document.getElementById('controlsHelp').classList.add('active');
    
    // Update player name display
    document.getElementById('playerNameDisplay').textContent = playerName;
    
    // Request pointer lock
    setTimeout(() => {
        metaverseEngine.requestPointerLock();
    }, 1000);
    
    console.log('🎮 Jogador entrou no mundo:', metaverseEngine.playerConfig);
}

function toggleVoice() {
    if (metaverseEngine) {
        metaverseEngine.toggleVoice();
    }
}

function toggleChat() {
    if (metaverseEngine) {
        metaverseEngine.toggleChat();
    }
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        const input = event.target;
        const message = input.value.trim();
        
        if (message && metaverseEngine) {
            metaverseEngine.addChatMessage(metaverseEngine.playerConfig.name, message);
            input.value = '';
            
            // Simulate other players responding
            setTimeout(() => {
                const responses = [
                    'Legal!',
                    'Concordo!',
                    'Que interessante!',
                    'Vamos explorar juntos!',
                    'Boa ideia!'
                ];
                const randomPlayer = Array.from(metaverseEngine.otherPlayers.values())[
                    Math.floor(Math.random() * metaverseEngine.otherPlayers.size)
                ];
                if (randomPlayer) {
                    const response = responses[Math.floor(Math.random() * responses.length)];
                    metaverseEngine.addChatMessage(randomPlayer.name, response);
                }
            }, 1000 + Math.random() * 2000);
        }
    } else if (event.key === 'Escape') {
        metaverseEngine.toggleChat();
    }
}

// Update avatar preview
document.addEventListener('DOMContentLoaded', () => {
    const avatarSelect = document.getElementById('avatarEmoji');
    const avatarPreview = document.getElementById('avatarPreview');
    
    avatarSelect.addEventListener('change', () => {
        avatarPreview.textContent = avatarSelect.value;
    });
    
    // Color preview updates
    const primaryColor = document.getElementById('primaryColor');
    const secondaryColor = document.getElementById('secondaryColor');
    
    function updatePreviewColors() {
        avatarPreview.style.background = `linear-gradient(45deg, ${primaryColor.value}, ${secondaryColor.value})`;
    }
    
    primaryColor.addEventListener('change', updatePreviewColors);
    secondaryColor.addEventListener('change', updatePreviewColors);
    
    console.log('🎮 Metaverse Interface carregada');
});