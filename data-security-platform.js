// GUNIC DataShield - Enterprise Security Platform
class DataSecurityPlatform {
    constructor() {
        this.apiEndpoint = '/api/security'; // Your API endpoint here
        this.wsConnection = null;
        this.threats = [];
        this.complianceScores = {
            lgpd: 0,
            gdpr: 0,
            sox: 0,
            iso: 0
        };
        this.activities = [];
        
        this.init();
    }

    init() {
        this.connectWebSocket();
        this.startSecurityScan();
        this.loadInitialData();
        this.setupEventListeners();
        
        console.log('DataShield Security Platform initialized');
    }

    // WebSocket connection for real-time monitoring
    connectWebSocket() {
        try {
            // Replace with your WebSocket endpoint
            this.wsConnection = new WebSocket('wss://your-api.com/security-feed');
            
            this.wsConnection.onopen = () => {
                console.log('Security monitoring WebSocket connected');
                this.addActivity('secured', 'Sistema de Monitoramento Conectado', 'WebSocket estabelecido com sucesso');
            };
            
            this.wsConnection.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleRealTimeUpdate(data);
            };
            
            this.wsConnection.onclose = () => {
                console.log('WebSocket connection closed, attempting reconnect...');
                setTimeout(() => this.connectWebSocket(), 5000);
            };
            
        } catch (error) {
            console.log('WebSocket not available, using simulation mode');
            this.startSimulationMode();
        }
    }

    // API Integration Methods
    async fetchSecurityData() {
        try {
            const response = await fetch(`${this.apiEndpoint}/scan`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('API request failed');
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            return this.generateSimulatedData();
        }
    }

    async reportVulnerability(vulnerability) {
        try {
            const response = await fetch(`${this.apiEndpoint}/vulnerabilities`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vulnerability)
            });
            
            return await response.json();
        } catch (error) {
            console.error('Failed to report vulnerability:', error);
        }
    }

    async initiateSecurityAction(action, targetId) {
        try {
            const response = await fetch(`${this.apiEndpoint}/actions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action, targetId, timestamp: Date.now() })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Security action failed:', error);
        }
    }

    getAuthToken() {
        // Implement your authentication logic here
        return localStorage.getItem('security_token') || 'demo-token';
    }

    // Real-time data processing
    handleRealTimeUpdate(data) {
        switch (data.type) {
            case 'vulnerability_detected':
                this.addVulnerability(data.payload);
                break;
            case 'compliance_update':
                this.updateComplianceScore(data.payload);
                break;
            case 'security_event':
                this.addActivity(data.payload.severity, data.payload.title, data.payload.description);
                break;
            case 'emergency_alert':
                this.triggerEmergencyAlert(data.payload);
                break;
        }
    }

    // Security scanning and monitoring
    async startSecurityScan() {
        this.addActivity('detected', 'Iniciando Varredura de Segurança', 'Análise completa do sistema iniciada');
        
        try {
            const securityData = await this.fetchSecurityData();
            this.processSecurityData(securityData);
        } catch (error) {
            console.error('Security scan failed:', error);
            this.startSimulationMode();
        }
    }

    processSecurityData(data) {
        if (data.vulnerabilities) {
            data.vulnerabilities.forEach(vuln => this.addVulnerability(vuln));
        }
        
        if (data.compliance) {
            this.updateAllComplianceScores(data.compliance);
        }
        
        if (data.activities) {
            data.activities.forEach(activity => 
                this.addActivity(activity.type, activity.title, activity.description)
            );
        }
    }

    // Vulnerability management
    addVulnerability(vulnerability) {
        this.threats.push(vulnerability);
        this.renderVulnerabilities();
        this.updateThreatCount();
        
        if (vulnerability.severity === 'critical') {
            this.triggerEmergencyAlert(vulnerability);
        }
    }

    renderVulnerabilities() {
        const dataLeaksContainer = document.getElementById('dataLeaks');
        const complianceContainer = document.getElementById('complianceViolations');
        
        // Clear existing content
        dataLeaksContainer.innerHTML = '';
        complianceContainer.innerHTML = '';
        
        this.threats.forEach(threat => {
            const item = this.createVulnerabilityItem(threat);
            
            if (threat.category === 'data_leak') {
                dataLeaksContainer.appendChild(item);
            } else if (threat.category === 'compliance') {
                complianceContainer.appendChild(item);
            }
        });
    }

    createVulnerabilityItem(threat) {
        const item = document.createElement('li');
        item.className = `vulnerability-item vuln-${threat.severity}`;
        
        item.innerHTML = `
            <div class="vuln-info">
                <div class="vuln-title">${threat.title}</div>
                <div class="vuln-description">${threat.description}</div>
            </div>
            <div class="vuln-actions">
                <button class="action-btn btn-fix" onclick="platform.fixVulnerability('${threat.id}')">
                    Corrigir
                </button>
                <button class="action-btn btn-details" onclick="platform.showVulnerabilityDetails('${threat.id}')">
                    Detalhes
                </button>
            </div>
        `;
        
        return item;
    }

    async fixVulnerability(vulnerabilityId) {
        const result = await this.initiateSecurityAction('fix_vulnerability', vulnerabilityId);
        
        if (result && result.success) {
            this.addActivity('secured', 'Vulnerabilidade Corrigida', `Vulnerabilidade ${vulnerabilityId} foi automaticamente corrigida`);
            this.removeVulnerability(vulnerabilityId);
        }
    }

    removeVulnerability(vulnerabilityId) {
        this.threats = this.threats.filter(threat => threat.id !== vulnerabilityId);
        this.renderVulnerabilities();
        this.updateThreatCount();
    }

    // Compliance monitoring
    updateComplianceScore(scoreData) {
        if (scoreData.regulation && scoreData.score !== undefined) {
            this.complianceScores[scoreData.regulation] = scoreData.score;
            this.renderComplianceScores();
        }
    }

    updateAllComplianceScores(scores) {
        Object.assign(this.complianceScores, scores);
        this.renderComplianceScores();
    }

    renderComplianceScores() {
        Object.keys(this.complianceScores).forEach(regulation => {
            const element = document.getElementById(`${regulation}Score`);
            if (element) {
                const score = this.complianceScores[regulation];
                element.textContent = `${score}%`;
                
                // Update color based on score
                element.className = 'compliance-score ' + 
                    (score >= 80 ? 'score-excellent' : 
                     score >= 60 ? 'score-good' : 'score-poor');
            }
        });
    }

    // Activity monitoring
    addActivity(type, title, description) {
        const activity = {
            id: Date.now(),
            type: type,
            title: title,
            description: description,
            timestamp: new Date()
        };
        
        this.activities.unshift(activity);
        
        // Keep only last 50 activities
        if (this.activities.length > 50) {
            this.activities = this.activities.slice(0, 50);
        }
        
        this.renderActivities();
    }

    renderActivities() {
        const container = document.getElementById('activityFeed');
        container.innerHTML = '';
        
        this.activities.slice(0, 10).forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            
            const iconClass = `activity-${activity.type}`;
            const icon = this.getActivityIcon(activity.type);
            
            item.innerHTML = `
                <div class="activity-icon ${iconClass}">${icon}</div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">${this.formatTime(activity.timestamp)}</div>
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    getActivityIcon(type) {
        const icons = {
            'blocked': '🚫',
            'detected': '⚠️',
            'secured': '✅'
        };
        return icons[type] || '📊';
    }

    formatTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        
        if (diff < 60000) return 'Agora mesmo';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} min atrás`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`;
        
        return timestamp.toLocaleDateString('pt-BR');
    }

    // Emergency response
    triggerEmergencyAlert(threat) {
        const panel = document.getElementById('emergencyPanel');
        panel.classList.add('show');
        
        // Auto-hide after 30 seconds if no action taken
        setTimeout(() => {
            if (panel.classList.contains('show')) {
                panel.classList.remove('show');
            }
        }, 30000);
    }

    async initiateEmergencyLockdown() {
        const result = await this.initiateSecurityAction('emergency_lockdown', 'system');
        
        if (result && result.success) {
            this.addActivity('secured', 'LOCKDOWN ATIVADO', 'Sistema em modo de segurança máxima');
            document.getElementById('emergencyPanel').classList.remove('show');
        }
    }

    // Utility methods
    updateThreatCount() {
        const criticalThreats = this.threats.filter(t => t.severity === 'critical').length;
        document.getElementById('threatCount').textContent = criticalThreats;
    }

    setupEventListeners() {
        // Setup any additional event listeners here
        window.addEventListener('beforeunload', () => {
            if (this.wsConnection) {
                this.wsConnection.close();
            }
        });
    }

    loadInitialData() {
        // Load initial security state
        this.startSecurityScan();
        
        // Start periodic updates
        setInterval(() => {
            this.fetchSecurityData().then(data => {
                if (data) this.processSecurityData(data);
            });
        }, 30000); // Update every 30 seconds
    }

    // Simulation mode for demo purposes
    startSimulationMode() {
        console.log('Starting simulation mode for demo');
        
        // Simulate initial vulnerabilities
        setTimeout(() => {
            this.addVulnerability({
                id: 'leak_001',
                category: 'data_leak',
                severity: 'critical',
                title: 'Exposição de CPFs em Logs',
                description: 'Sistema detectou 1,247 CPFs expostos em arquivos de log não criptografados'
            });
        }, 2000);
        
        setTimeout(() => {
            this.addVulnerability({
                id: 'compliance_001',
                category: 'compliance',
                severity: 'high',
                title: 'Violação LGPD - Consentimento',
                description: 'Dados pessoais processados sem consentimento explícito do titular'
            });
        }, 4000);
        
        // Simulate compliance scores
        setTimeout(() => {
            this.updateAllComplianceScores({
                lgpd: 45,
                gdpr: 38,
                sox: 72,
                iso: 56
            });
        }, 3000);
        
        // Simulate ongoing activities
        this.startActivitySimulation();
    }

    startActivitySimulation() {
        const simulatedActivities = [
            { type: 'detected', title: 'Tentativa de Acesso Suspeito', description: 'IP 192.168.1.100 tentou acessar dados sensíveis' },
            { type: 'blocked', title: 'Transferência de Dados Bloqueada', description: 'Tentativa de exportar 50GB de dados foi bloqueada' },
            { type: 'secured', title: 'Backup Criptografado', description: 'Backup diário criptografado com sucesso' },
            { type: 'detected', title: 'Anomalia de Tráfego', description: 'Pico de tráfego detectado no servidor de dados' }
        ];
        
        setInterval(() => {
            const activity = simulatedActivities[Math.floor(Math.random() * simulatedActivities.length)];
            this.addActivity(activity.type, activity.title, activity.description);
        }, 8000);
    }

    generateSimulatedData() {
        return {
            vulnerabilities: [
                {
                    id: 'sim_001',
                    category: 'data_leak',
                    severity: 'critical',
                    title: 'Banco de Dados Exposto',
                    description: 'Credenciais de acesso encontradas em repositório público'
                }
            ],
            compliance: {
                lgpd: Math.floor(Math.random() * 40) + 30,
                gdpr: Math.floor(Math.random() * 40) + 25,
                sox: Math.floor(Math.random() * 30) + 60,
                iso: Math.floor(Math.random() * 40) + 40
            },
            activities: []
        };
    }
}

// Global functions for UI interactions
function closeEmergencyPanel() {
    document.getElementById('emergencyPanel').classList.remove('show');
}

function initiateEmergencyLockdown() {
    if (window.platform) {
        window.platform.initiateEmergencyLockdown();
    }
}

// Initialize the platform
document.addEventListener('DOMContentLoaded', () => {
    window.platform = new DataSecurityPlatform();
});