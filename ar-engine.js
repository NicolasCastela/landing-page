// 🚀 AR Engine com IA Generativa - GUNIC Company
class AREngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.arActive = false;
        this.currentProject = 0;
        this.projects = [
            { name: 'Sistema Médico IA', color: '#00ffff', shape: 'sphere' },
            { name: 'App Mobile Futurista', color: '#ff0080', shape: 'cylinder' },
            { name: 'Cloud AI Platform', color: '#7c3aed', shape: 'octahedron' },
            { name: 'Robô Assistente', color: '#00ff00', shape: 'dodecahedron' }
        ];
        this.aiModels = new Map();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.preloadAIModels();
    }

    setupEventListeners() {
        // Detectar suporte WebXR
        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-ar').then(supported => {
                if (supported) {
                    console.log('🚀 WebXR AR suportado!');
                } else {
                    console.log('📱 Usando AR.js como fallback');
                }
            });
        }
    }

    async preloadAIModels() {
        // Simular carregamento de modelos IA pré-treinados
        const models = [
            'medical-system-3d.json',
            'mobile-app-3d.json', 
            'cloud-platform-3d.json',
            'robot-assistant-3d.json'
        ];

        for (let model of models) {
            await this.simulateModelLoad(model);
        }
    }

    simulateModelLoad(modelName) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`✅ Modelo ${modelName} carregado`);
                resolve();
            }, 500);
        });
    }
}

// Instância global
const arEngine = new AREngine();

// Funções principais
async function initAR() {
    const overlay = document.getElementById('arOverlay');
    const scene = document.getElementById('arScene');
    const controls = document.getElementById('arControls');
    const status = document.getElementById('arStatus');

    try {
        // Solicitar permissão da câmera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());

        // Mostrar AR
        overlay.style.display = 'none';
        scene.style.display = 'block';
        controls.style.display = 'flex';
        status.style.display = 'block';

        updateStatus('AR Ativo - Aponte para um marcador');
        arEngine.arActive = true;

        // Inicializar tracking
        initMarkerTracking();
        
    } catch (error) {
        console.error('Erro ao iniciar AR:', error);
        updateStatus('Erro: Câmera não disponível');
    }
}

function initMarkerTracking() {
    const marker = document.getElementById('marker');
    
    marker.addEventListener('markerFound', () => {
        updateStatus('🎯 Marcador detectado!');
        animateARObject();
    });

    marker.addEventListener('markerLost', () => {
        updateStatus('🔍 Procurando marcador...');
    });
}

function animateARObject() {
    const box = document.getElementById('aiBox');
    const text = document.getElementById('aiText');
    
    // Animação de entrada
    box.setAttribute('animation', 'property: scale; from: 0 0 0; to: 1 1 1; dur: 1000');
    
    setTimeout(() => {
        box.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 5000');
    }, 1000);
}

function generateAI3D() {
    document.getElementById('aiPrompt').style.display = 'block';
}

async function generateFromAI() {
    const input = document.getElementById('aiInput').value;
    if (!input.trim()) return;

    closeAIPrompt();
    showLoading3D();

    try {
        // Simular geração de IA (em produção, usar API real)
        const aiModel = await simulateAIGeneration(input);
        await renderAIModel(aiModel);
        
        hideLoading3D();
        updateStatus('🤖 Modelo IA gerado com sucesso!');
        
    } catch (error) {
        hideLoading3D();
        updateStatus('❌ Erro na geração IA');
        console.error(error);
    }
}

async function simulateAIGeneration(prompt) {
    // Simular chamada para API de IA generativa
    return new Promise((resolve) => {
        setTimeout(() => {
            const colors = ['#00ffff', '#ff0080', '#7c3aed', '#00ff00', '#ffff00'];
            const shapes = ['box', 'sphere', 'cylinder', 'octahedron', 'dodecahedron'];
            
            resolve({
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                color: colors[Math.floor(Math.random() * colors.length)],
                prompt: prompt,
                complexity: Math.random() * 2 + 1
            });
        }, 3000);
    });
}

async function renderAIModel(model) {
    const marker = document.getElementById('marker');
    const box = document.getElementById('aiBox');
    const text = document.getElementById('aiText');

    // Remover objeto anterior
    if (box) box.remove();
    if (text) text.remove();

    // Criar novo objeto baseado na IA
    const newObject = document.createElement('a-entity');
    newObject.setAttribute('id', 'aiBox');
    
    if (model.shape === 'box') {
        newObject.setAttribute('geometry', 'primitive: box');
    } else if (model.shape === 'sphere') {
        newObject.setAttribute('geometry', 'primitive: sphere');
    } else if (model.shape === 'cylinder') {
        newObject.setAttribute('geometry', 'primitive: cylinder');
    } else {
        newObject.setAttribute('geometry', `primitive: ${model.shape}`);
    }

    newObject.setAttribute('position', '0 0.5 0');
    newObject.setAttribute('material', `color: ${model.color}; opacity: 0.8; metalness: 0.5`);
    newObject.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 8000');

    // Texto descritivo
    const newText = document.createElement('a-text');
    newText.setAttribute('id', 'aiText');
    newText.setAttribute('value', `IA: ${model.prompt.substring(0, 20)}...`);
    newText.setAttribute('position', '0 1.5 0');
    newText.setAttribute('align', 'center');
    newText.setAttribute('color', '#ffffff');

    marker.appendChild(newObject);
    marker.appendChild(newText);

    // Efeito de spawn
    newObject.setAttribute('animation', 'property: scale; from: 0 0 0; to: 1 1 1; dur: 1500; easing: easeOutBounce');
}

function changeProject() {
    arEngine.currentProject = (arEngine.currentProject + 1) % arEngine.projects.length;
    const project = arEngine.projects[arEngine.currentProject];
    
    const box = document.getElementById('aiBox');
    const text = document.getElementById('aiText');
    
    if (box && text) {
        box.setAttribute('material', `color: ${project.color}; opacity: 0.8`);
        text.setAttribute('value', project.name);
        
        // Animação de troca
        box.setAttribute('animation', 'property: scale; from: 1 1 1; to: 1.2 1.2 1.2; dur: 500; direction: alternate; loop: 1');
    }
    
    updateStatus(`📱 Projeto: ${project.name}`);
}

function exitAR() {
    const overlay = document.getElementById('arOverlay');
    const scene = document.getElementById('arScene');
    const controls = document.getElementById('arControls');
    const status = document.getElementById('arStatus');

    overlay.style.display = 'flex';
    scene.style.display = 'none';
    controls.style.display = 'none';
    status.style.display = 'none';

    arEngine.arActive = false;
}

function goBack() {
    window.location.href = 'index.html';
}

function closeAIPrompt() {
    document.getElementById('aiPrompt').style.display = 'none';
    document.getElementById('aiInput').value = '';
}

function showLoading3D() {
    document.getElementById('loading3D').style.display = 'block';
}

function hideLoading3D() {
    document.getElementById('loading3D').style.display = 'none';
}

function updateStatus(message) {
    document.getElementById('statusText').textContent = message;
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 AR Engine inicializado');
    
    // Verificar suporte a AR
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        updateStatus('❌ Dispositivo não suporta AR');
        return;
    }
    
    updateStatus('✅ AR Engine pronto');
});

// Detectar quando o marcador é encontrado/perdido
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const scene = document.querySelector('a-scene');
        if (scene) {
            scene.addEventListener('loaded', () => {
                console.log('🎯 A-Frame carregado');
            });
        }
    }, 1000);
});

// Função para integração com IA real (quando disponível)
async function callRealAI(prompt) {
    if (typeof generateAIResponse === 'function') {
        try {
            const response = await generateAIResponse(
                `Gere uma descrição técnica para um modelo 3D baseado em: ${prompt}. 
                Inclua: forma geométrica, cor, material, e animação sugerida.`
            );
            
            return parseAIResponse(response);
        } catch (error) {
            console.error('Erro na IA real:', error);
            return null;
        }
    }
    return null;
}

function parseAIResponse(response) {
    // Parser simples para extrair informações da resposta da IA
    const shapes = ['box', 'sphere', 'cylinder', 'octahedron'];
    const colors = ['#00ffff', '#ff0080', '#7c3aed', '#00ff00'];
    
    let shape = 'box';
    let color = '#00ffff';
    
    // Detectar forma na resposta
    for (let s of shapes) {
        if (response.toLowerCase().includes(s)) {
            shape = s;
            break;
        }
    }
    
    // Detectar cor na resposta
    if (response.toLowerCase().includes('azul') || response.toLowerCase().includes('blue')) {
        color = '#00ffff';
    } else if (response.toLowerCase().includes('rosa') || response.toLowerCase().includes('pink')) {
        color = '#ff0080';
    } else if (response.toLowerCase().includes('roxo') || response.toLowerCase().includes('purple')) {
        color = '#7c3aed';
    } else if (response.toLowerCase().includes('verde') || response.toLowerCase().includes('green')) {
        color = '#00ff00';
    }
    
    return { shape, color, prompt: response.substring(0, 50) };
}