// 🌌 Quantum Teleport Engine - GUNIC Multiverse
class QuantumTeleportEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.world = null;
        this.currentDimension = 'base';
        this.quantumEnergy = 100;
        this.isTransporting = false;
        this.connectedUsers = 1;
        this.quantumState = 'stable';
        
        this.dimensions = {
            base: {
                name: 'Escritório GUNIC',
                description: 'Realidade padrão da GUNIC Company',
                color: '#0066ff',
                physics: 'normal',
                environment: 'office'
            },
            cyber: {
                name: 'Cidade Cyberpunk',
                description: 'Metrópole futurística com neon e hologramas',
                color: '#ff0080',
                physics: 'enhanced',
                environment: 'cyberpunk'
            },
            space: {
                name: 'Estação Espacial',
                description: 'Laboratório orbital em gravidade zero',
                color: '#ffffff',
                physics: 'zero_gravity',
                environment: 'space'
            },
            quantum: {
                name: 'Laboratório Quântico',
                description: 'Dimensão onde as leis físicas são fluidas',
                color: '#8000ff',
                physics: 'quantum',
                environment: 'laboratory'
            },
            nature: {
                name: 'Floresta Digital',
                description: 'Ecossistema virtual com IA orgânica',
                color: '#00ff88',
                physics: 'organic',
                environment: 'forest'
            },
            ocean: {
                name: 'Oceano Virtual',
                description: 'Mundo subaquático com física fluida',
                color: '#00ccff',
                physics: 'fluid',
                environment: 'underwater'
            }
        };
        
        this.collaborators = [
            { name: 'Ana', dimension: 'cyber', avatar: '#ff0080' },
            { name: 'João', dimension: 'space', avatar: '#ffaa00' },
            { name: 'Maria', dimension: 'quantum', avatar: '#8000ff' }
        ];
        
        this.init();
    }

    async init() {
        this.setupThreeJS();
        this.setupPhysics();
        this.createBaseDimension();
        this.setupQuantumParticles();
        this.startQuantumSimulation();
        this.animate();
        
        console.log('🌌 Quantum Teleport Engine inicializado');
    }

    setupThreeJS() {
        const canvas = document.getElementById('quantumCanvas');
        
        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000033, 10, 100);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true,
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000033, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Controls
        this.setupCameraControls();
        
        // Resize handler
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupPhysics() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
    }

    setupCameraControls() {
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
            mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
        });
        
        // Smooth camera movement
        setInterval(() => {
            this.camera.position.x += (mouseX * 2 - this.camera.position.x) * 0.05;
            this.camera.position.y += (-mouseY * 2 - this.camera.position.y + 5) * 0.05;
            this.camera.lookAt(0, 0, 0);
        }, 16);
    }

    createBaseDimension() {
        this.clearScene();
        
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(50, 50);
        const floorMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x333333,
            transparent: true,
            opacity: 0.8
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
        
        // GUNIC Logo Hologram
        this.createLogoHologram();
        
        // Quantum Portals
        this.createQuantumPortals();
        
        // Floating Data Cubes
        this.createDataCubes();
    }

    createLogoHologram() {
        const logoGeometry = new THREE.TextGeometry('GUNIC', {
            font: null, // Would need to load font
            size: 2,
            height: 0.1
        });
        
        // Fallback to box geometry
        const geometry = new THREE.BoxGeometry(4, 1, 0.2);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ffff) }
            },
            vertexShader: `
                uniform float time;
                varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    vec3 pos = position;
                    pos.y += sin(time + position.x * 2.0) * 0.1;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec3 vPosition;
                void main() {
                    float alpha = sin(time * 2.0) * 0.3 + 0.7;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true
        });
        
        this.logoMesh = new THREE.Mesh(geometry, material);
        this.logoMesh.position.y = 3;
        this.scene.add(this.logoMesh);
    }

    createQuantumPortals() {
        const portalPositions = [
            { x: -8, z: -8, dimension: 'cyber' },
            { x: 8, z: -8, dimension: 'space' },
            { x: -8, z: 8, dimension: 'quantum' },
            { x: 8, z: 8, dimension: 'nature' }
        ];
        
        this.portals = [];
        
        portalPositions.forEach(pos => {
            const portalGeometry = new THREE.RingGeometry(1, 2, 32);
            const portalMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(this.dimensions[pos.dimension].color) }
                },
                vertexShader: `
                    uniform float time;
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    varying vec2 vUv;
                    void main() {
                        float dist = distance(vUv, vec2(0.5));
                        float alpha = sin(time * 3.0 + dist * 10.0) * 0.5 + 0.5;
                        gl_FragColor = vec4(color, alpha * 0.8);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            const portal = new THREE.Mesh(portalGeometry, portalMaterial);
            portal.position.set(pos.x, 1, pos.z);
            portal.userData = { dimension: pos.dimension };
            this.portals.push(portal);
            this.scene.add(portal);
        });
    }

    createDataCubes() {
        this.dataCubes = [];
        
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
                transparent: true,
                opacity: 0.7
            });
            
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(
                (Math.random() - 0.5) * 20,
                Math.random() * 5 + 2,
                (Math.random() - 0.5) * 20
            );
            cube.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            this.dataCubes.push(cube);
            this.scene.add(cube);
        }
    }

    setupQuantumParticles() {
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            
            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
            
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.3 + 0.5, 1, 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.quantumParticles = new THREE.Points(geometry, material);
        this.scene.add(this.quantumParticles);
    }

    startQuantumSimulation() {
        setInterval(() => {
            this.updateQuantumState();
            this.simulateCollaborators();
        }, 1000);
    }

    updateQuantumState() {
        // Simulate quantum energy fluctuation
        this.quantumEnergy = Math.max(0, Math.min(100, 
            this.quantumEnergy + (Math.random() - 0.5) * 5
        ));
        
        // Update quantum state
        if (this.quantumEnergy > 80) {
            this.quantumState = 'stable';
        } else if (this.quantumEnergy > 50) {
            this.quantumState = 'fluctuating';
        } else {
            this.quantumState = 'unstable';
        }
        
        // Update UI
        document.getElementById('quantumEnergy').textContent = Math.round(this.quantumEnergy) + '%';
        document.getElementById('quantumState').textContent = this.quantumState;
    }

    simulateCollaborators() {
        // Simulate other users joining/leaving
        const change = Math.random();
        if (change > 0.8 && this.connectedUsers < 5) {
            this.connectedUsers++;
        } else if (change < 0.2 && this.connectedUsers > 1) {
            this.connectedUsers--;
        }
        
        document.getElementById('connectedUsers').textContent = this.connectedUsers;
    }

    clearScene() {
        // Remove all meshes except camera and lights
        const objectsToRemove = [];
        this.scene.traverse((child) => {
            if (child.isMesh && child !== this.quantumParticles) {
                objectsToRemove.push(child);
            }
        });
        
        objectsToRemove.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
    }

    createDimensionEnvironment(dimension) {
        const dim = this.dimensions[dimension];
        
        switch (dimension) {
            case 'cyber':
                this.createCyberpunkCity();
                break;
            case 'space':
                this.createSpaceStation();
                break;
            case 'quantum':
                this.createQuantumLab();
                break;
            case 'nature':
                this.createDigitalForest();
                break;
            case 'ocean':
                this.createVirtualOcean();
                break;
            default:
                this.createBaseDimension();
        }
        
        // Update physics based on dimension
        this.updatePhysics(dim.physics);
    }

    createCyberpunkCity() {
        // Neon buildings
        for (let i = 0; i < 10; i++) {
            const geometry = new THREE.BoxGeometry(2, Math.random() * 10 + 5, 2);
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.8, 1, 0.5),
                emissive: new THREE.Color().setHSL(Math.random() * 0.1 + 0.8, 1, 0.2)
            });
            
            const building = new THREE.Mesh(geometry, material);
            building.position.set(
                (Math.random() - 0.5) * 30,
                geometry.parameters.height / 2,
                (Math.random() - 0.5) * 30
            );
            this.scene.add(building);
        }
        
        // Neon grid floor
        const gridGeometry = new THREE.PlaneGeometry(50, 50, 20, 20);
        const gridMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0080,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const grid = new THREE.Mesh(gridGeometry, gridMaterial);
        grid.rotation.x = -Math.PI / 2;
        this.scene.add(grid);
    }

    createSpaceStation() {
        // Central hub
        const hubGeometry = new THREE.SphereGeometry(3, 32, 32);
        const hubMaterial = new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            metalness: 0.8,
            roughness: 0.2
        });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        this.scene.add(hub);
        
        // Rotating rings
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.TorusGeometry(5 + i * 2, 0.5, 8, 32);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: 0x0088ff,
                transparent: true,
                opacity: 0.7
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.userData = { rotationSpeed: 0.01 + i * 0.005 };
            this.scene.add(ring);
        }
        
        // Stars background
        this.createStarField();
    }

    createQuantumLab() {
        // Quantum field visualization
        const fieldGeometry = new THREE.SphereGeometry(8, 64, 64);
        const fieldMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                uniform float time;
                varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    vec3 pos = position;
                    pos += normal * sin(time * 2.0 + position.x * 3.0) * 0.2;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vPosition;
                void main() {
                    vec3 color = vec3(0.5 + sin(time + vPosition.x) * 0.5, 
                                     0.5 + sin(time + vPosition.y) * 0.5, 
                                     0.5 + sin(time + vPosition.z) * 0.5);
                    gl_FragColor = vec4(color, 0.3);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        this.quantumField = new THREE.Mesh(fieldGeometry, fieldMaterial);
        this.scene.add(this.quantumField);
    }

    createDigitalForest() {
        // Digital trees
        for (let i = 0; i < 15; i++) {
            const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 4);
            const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            
            const leavesGeometry = new THREE.SphereGeometry(1.5, 8, 8);
            const leavesMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x00ff88,
                transparent: true,
                opacity: 0.8
            });
            const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
            leaves.position.y = 3;
            
            const tree = new THREE.Group();
            tree.add(trunk);
            tree.add(leaves);
            tree.position.set(
                (Math.random() - 0.5) * 25,
                2,
                (Math.random() - 0.5) * 25
            );
            
            this.scene.add(tree);
        }
    }

    createVirtualOcean() {
        // Ocean surface
        const oceanGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
        const oceanMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                uniform float time;
                varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    vec3 pos = position;
                    pos.z += sin(time + position.x * 0.1) * 2.0;
                    pos.z += cos(time * 0.7 + position.y * 0.1) * 1.5;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vPosition;
                void main() {
                    vec3 color = vec3(0.0, 0.5 + sin(time) * 0.2, 1.0);
                    gl_FragColor = vec4(color, 0.8);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        this.oceanSurface = new THREE.Mesh(oceanGeometry, oceanMaterial);
        this.oceanSurface.rotation.x = -Math.PI / 2;
        this.scene.add(this.oceanSurface);
    }

    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }

    updatePhysics(physicsType) {
        switch (physicsType) {
            case 'zero_gravity':
                this.world.gravity.set(0, 0, 0);
                break;
            case 'quantum':
                this.world.gravity.set(0, Math.sin(Date.now() * 0.001) * 5, 0);
                break;
            case 'fluid':
                this.world.gravity.set(0, -2, 0);
                break;
            default:
                this.world.gravity.set(0, -9.82, 0);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Update logo hologram
        if (this.logoMesh) {
            this.logoMesh.material.uniforms.time.value = time;
            this.logoMesh.rotation.y += 0.01;
        }
        
        // Update portals
        if (this.portals) {
            this.portals.forEach(portal => {
                portal.material.uniforms.time.value = time;
                portal.rotation.z += 0.02;
            });
        }
        
        // Update data cubes
        if (this.dataCubes) {
            this.dataCubes.forEach(cube => {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                cube.position.y += Math.sin(time + cube.position.x) * 0.01;
            });
        }
        
        // Update quantum particles
        if (this.quantumParticles) {
            const positions = this.quantumParticles.geometry.attributes.position.array;
            const velocities = this.quantumParticles.geometry.attributes.velocity.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
                
                // Boundary check
                if (Math.abs(positions[i]) > 50) velocities[i] *= -1;
                if (Math.abs(positions[i + 1]) > 50) velocities[i + 1] *= -1;
                if (Math.abs(positions[i + 2]) > 50) velocities[i + 2] *= -1;
            }
            
            this.quantumParticles.geometry.attributes.position.needsUpdate = true;
        }
        
        // Update dimension-specific animations
        this.updateDimensionAnimations(time);
        
        this.renderer.render(this.scene, this.camera);
    }

    updateDimensionAnimations(time) {
        // Update quantum field
        if (this.quantumField) {
            this.quantumField.material.uniforms.time.value = time;
            this.quantumField.rotation.y += 0.005;
        }
        
        // Update ocean surface
        if (this.oceanSurface) {
            this.oceanSurface.material.uniforms.time.value = time;
        }
        
        // Update rotating rings in space station
        this.scene.traverse((child) => {
            if (child.userData.rotationSpeed) {
                child.rotation.z += child.userData.rotationSpeed;
            }
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Instância global
const quantumEngine = new QuantumTeleportEngine();

// Funções globais
function selectDimension(dimension) {
    // Update UI
    document.querySelectorAll('.dimension-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update dimension info
    const dim = quantumEngine.dimensions[dimension];
    document.getElementById('dimensionTitle').textContent = dim.name;
    document.getElementById('dimensionDesc').textContent = dim.description;
    document.getElementById('currentDimension').textContent = dim.name;
    
    quantumEngine.currentDimension = dimension;
}

function initiateTeleport() {
    if (quantumEngine.isTransporting) return;
    
    quantumEngine.isTransporting = true;
    const teleportBtn = document.getElementById('teleportBtn');
    const teleportEffect = document.getElementById('teleportEffect');
    const dimensionInfo = document.getElementById('dimensionInfo');
    
    // Start teleport animation
    teleportBtn.classList.add('charging');
    teleportBtn.textContent = '🌀 TRANSPORTANDO...';
    teleportEffect.classList.add('active');
    
    // Show dimension info
    dimensionInfo.classList.add('show');
    
    setTimeout(() => {
        // Create new dimension
        quantumEngine.createDimensionEnvironment(quantumEngine.currentDimension);
        
        // Reset UI
        teleportBtn.classList.remove('charging');
        teleportBtn.textContent = '🌀 TELETRANSPORTAR';
        teleportEffect.classList.remove('active');
        dimensionInfo.classList.remove('show');
        
        quantumEngine.isTransporting = false;
        
        // Consume quantum energy
        quantumEngine.quantumEnergy = Math.max(0, quantumEngine.quantumEnergy - 20);
        
    }, 2000);
}

function generateRandomDimension() {
    const dimensions = Object.keys(quantumEngine.dimensions);
    const randomDim = dimensions[Math.floor(Math.random() * dimensions.length)];
    
    // Simulate button click
    const btn = document.querySelector(`[onclick="selectDimension('${randomDim}')"]`);
    if (btn) {
        btn.click();
        setTimeout(() => initiateTeleport(), 500);
    }
}

function inviteCollaborators() {
    // Simulate inviting users
    const messages = [
        "Convite enviado para Ana (Dimensão Cyber)",
        "João se conectou da Estação Espacial",
        "Maria entrou no Laboratório Quântico",
        "Novo usuário detectado no Multiverso"
    ];
    
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    // Show notification (would be a proper notification system)
    console.log('📡 ' + message);
    
    // Add user avatar
    const userAvatars = document.getElementById('userAvatars');
    const newAvatar = document.createElement('div');
    newAvatar.className = 'user-avatar';
    newAvatar.setAttribute('data-name', 'Novo Usuário');
    newAvatar.style.background = `linear-gradient(45deg, ${Math.random() > 0.5 ? '#ff0080' : '#00ccff'}, ${Math.random() > 0.5 ? '#8000ff' : '#00ff88'})`;
    
    userAvatars.appendChild(newAvatar);
    
    // Remove after some time
    setTimeout(() => {
        if (userAvatars.contains(newAvatar)) {
            userAvatars.removeChild(newAvatar);
        }
    }, 10000);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌌 Quantum Teleport Interface carregada');
    
    // Show welcome message
    setTimeout(() => {
        const dimensionInfo = document.getElementById('dimensionInfo');
        dimensionInfo.classList.add('show');
        
        setTimeout(() => {
            dimensionInfo.classList.remove('show');
        }, 3000);
    }, 1000);
});