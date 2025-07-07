// GUNIC WorkFlow AI - Employee Performance Optimizer
class AIEmployeeOptimizer {
    constructor() {
        this.apiEndpoint = '/api/workforce'; // Your API endpoint
        this.employees = [];
        this.optimizations = [];
        this.insights = {
            efficiencyGain: 0,
            timeWasted: 0,
            optimalTeamSize: 0,
            satisfactionIncrease: 0,
            potentialSavings: 0,
            productivityIncrease: 0
        };
        this.activities = [];
        this.currentEmployee = null;
        
        this.init();
    }

    init() {
        this.loadEmployeeData();
        this.startAIAnalysis();
        this.setupRealTimeMonitoring();
        
        console.log('AI Employee Optimizer initialized');
    }

    // API Integration - Connect to your workforce management system
    async fetchEmployeeData() {
        try {
            const response = await fetch(`${this.apiEndpoint}/employees`, {
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

    async optimizeEmployee(employeeId, optimizations) {
        try {
            const response = await fetch(`${this.apiEndpoint}/optimize`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    employeeId,
                    optimizations,
                    timestamp: Date.now()
                })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Optimization failed:', error);
        }
    }

    async getAIInsights(employeeId) {
        try {
            const response = await fetch(`${this.apiEndpoint}/insights/${employeeId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return await response.json();
        } catch (error) {
            console.error('Failed to get AI insights:', error);
            return this.generateAIInsights(employeeId);
        }
    }

    getAuthToken() {
        return localStorage.getItem('workforce_token') || 'demo-token';
    }

    // AI Analysis Engine
    async startAIAnalysis() {
        this.addActivity('insight', 'Iniciando Análise de IA', 'Sistema começou a analisar padrões de produtividade');
        
        try {
            const employeeData = await this.fetchEmployeeData();
            this.processEmployeeData(employeeData);
            this.generateInsights();
        } catch (error) {
            console.error('AI Analysis failed:', error);
            this.startSimulationMode();
        }
    }

    processEmployeeData(data) {
        this.employees = data.employees || [];
        this.renderEmployees();
        this.updateMetrics();
    }

    generateInsights() {
        // AI-powered insights calculation
        const totalEmployees = this.employees.length;
        const underperformers = this.employees.filter(emp => emp.performance < 70).length;
        const highPerformers = this.employees.filter(emp => emp.performance > 85).length;
        
        this.insights = {
            efficiencyGain: Math.round(15 + Math.random() * 25), // 15-40%
            timeWasted: Math.round(2 + Math.random() * 4), // 2-6 hours
            optimalTeamSize: Math.round(totalEmployees * 0.85), // 15% reduction optimal
            satisfactionIncrease: Math.round(10 + Math.random() * 20), // 10-30%
            potentialSavings: Math.round((totalEmployees * 80000) * 0.2), // 20% of salary costs
            productivityIncrease: Math.round(20 + Math.random() * 30) // 20-50%
        };
        
        this.renderInsights();
        this.updateBannerStats();
    }

    renderEmployees() {
        const highPotentialContainer = document.getElementById('highPotentialEmployees');
        const riskContainer = document.getElementById('riskEmployees');
        
        highPotentialContainer.innerHTML = '';
        riskContainer.innerHTML = '';
        
        this.employees.forEach(employee => {
            const item = this.createEmployeeItem(employee);
            
            if (employee.optimizationPotential === 'high') {
                highPotentialContainer.appendChild(item);
            } else if (employee.riskLevel === 'high') {
                riskContainer.appendChild(item);
            }
        });
    }

    createEmployeeItem(employee) {
        const item = document.createElement('li');
        const levelClass = employee.optimizationPotential === 'high' ? 'emp-high' : 
                          employee.optimizationPotential === 'medium' ? 'emp-medium' : 'emp-low';
        
        item.className = `employee-item ${levelClass}`;
        
        item.innerHTML = `
            <div class="emp-info">
                <div class="emp-name">${employee.name}</div>
                <div class="emp-role">${employee.role}</div>
                <div class="emp-metrics">
                    <span>Performance: ${employee.performance}%</span>
                    <span>Eficiência: ${employee.efficiency}%</span>
                    <span>Satisfação: ${employee.satisfaction}%</span>
                </div>
            </div>
            <div class="emp-actions">
                <button class="action-btn btn-optimize" onclick="optimizer.optimizeEmployeeFlow('${employee.id}')">
                    Otimizar
                </button>
                <button class="action-btn btn-analyze" onclick="optimizer.analyzeEmployee('${employee.id}')">
                    Analisar
                </button>
            </div>
        `;
        
        return item;
    }

    async optimizeEmployeeFlow(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (!employee) return;
        
        this.currentEmployee = employee;
        
        // Get AI-generated optimization suggestions
        const insights = await this.getAIInsights(employeeId);
        this.showOptimizationPanel(insights);
    }

    showOptimizationPanel(insights) {
        const panel = document.getElementById('optimizationPanel');
        const suggestionsContainer = document.getElementById('optimizationSuggestions');
        
        suggestionsContainer.innerHTML = '';
        
        insights.suggestions.forEach(suggestion => {
            const item = document.createElement('li');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <div class="suggestion-icon">✓</div>
                <div>
                    <strong>${suggestion.title}</strong><br>
                    <span style="color: #94a3b8; font-size: 0.875rem;">${suggestion.description}</span><br>
                    <span style="color: #10b981; font-size: 0.75rem;">Impacto: ${suggestion.impact}</span>
                </div>
            `;
            suggestionsContainer.appendChild(item);
        });
        
        panel.classList.add('show');
    }

    async applyOptimization() {
        if (!this.currentEmployee) return;
        
        const result = await this.optimizeEmployee(this.currentEmployee.id, {
            type: 'ai_optimization',
            suggestions: ['schedule_optimization', 'task_reallocation', 'skill_development']
        });
        
        if (result && result.success) {
            this.addActivity('optimized', 'Otimização Aplicada', 
                `${this.currentEmployee.name} teve workflow otimizado pela IA`);
            
            // Update employee performance
            this.currentEmployee.performance += Math.round(Math.random() * 15 + 5);
            this.currentEmployee.efficiency += Math.round(Math.random() * 20 + 10);
            
            this.renderEmployees();
            this.closeOptimizationPanel();
        }
    }

    closeOptimizationPanel() {
        document.getElementById('optimizationPanel').classList.remove('show');
        this.currentEmployee = null;
    }

    analyzeEmployee(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (!employee) return;
        
        this.addActivity('insight', 'Análise Detalhada Iniciada', 
            `IA está analisando padrões de trabalho de ${employee.name}`);
        
        // Simulate deep analysis
        setTimeout(() => {
            this.addActivity('insight', 'Análise Concluída', 
                `Identificados 3 pontos de melhoria para ${employee.name}`);
        }, 3000);
    }

    renderInsights() {
        document.getElementById('efficiencyGain').textContent = `+${this.insights.efficiencyGain}%`;
        document.getElementById('timeWasted').textContent = `${this.insights.timeWasted}h`;
        document.getElementById('optimalTeamSize').textContent = this.insights.optimalTeamSize;
        document.getElementById('satisfactionIncrease').textContent = `+${this.insights.satisfactionIncrease}%`;
    }

    updateBannerStats() {
        document.getElementById('potentialSavings').textContent = this.formatCurrency(this.insights.potentialSavings);
        document.getElementById('productivityIncrease').textContent = this.insights.productivityIncrease;
        document.getElementById('employeesAnalyzed').textContent = this.employees.length;
    }

    setupRealTimeMonitoring() {
        // Simulate real-time workforce monitoring
        setInterval(() => {
            this.addRandomActivity();
        }, 8000);
        
        // Update insights periodically
        setInterval(() => {
            this.generateInsights();
        }, 30000);
    }

    addActivity(type, title, description) {
        const activity = {
            id: Date.now(),
            type: type,
            title: title,
            description: description,
            timestamp: new Date()
        };
        
        this.activities.unshift(activity);
        
        if (this.activities.length > 50) {
            this.activities = this.activities.slice(0, 50);
        }
        
        this.renderActivities();
    }

    addRandomActivity() {
        const activities = [
            {
                type: 'optimized',
                title: 'Produtividade Aumentada',
                description: 'IA otimizou horários de 3 funcionários automaticamente'
            },
            {
                type: 'alert',
                title: 'Padrão de Baixa Performance',
                description: 'Detectada queda de 15% na produtividade do setor de vendas'
            },
            {
                type: 'insight',
                title: 'Oportunidade Identificada',
                description: 'IA sugere redistribuição de tarefas para aumentar eficiência em 25%'
            },
            {
                type: 'optimized',
                title: 'Satisfação Melhorada',
                description: 'Ajustes de workflow resultaram em +20% satisfação da equipe'
            }
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        this.addActivity(randomActivity.type, randomActivity.title, randomActivity.description);
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
            'optimized': '🚀',
            'alert': '⚠️',
            'insight': '💡'
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

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    // Simulation mode for demo
    loadEmployeeData() {
        this.startSimulationMode();
    }

    startSimulationMode() {
        console.log('Starting workforce simulation mode');
        
        // Generate realistic employee data
        this.employees = [
            {
                id: 'emp_001',
                name: 'Ana Silva',
                role: 'Desenvolvedora Senior',
                performance: 65,
                efficiency: 70,
                satisfaction: 60,
                optimizationPotential: 'high',
                riskLevel: 'medium'
            },
            {
                id: 'emp_002',
                name: 'Carlos Santos',
                role: 'Gerente de Vendas',
                performance: 45,
                efficiency: 50,
                satisfaction: 40,
                optimizationPotential: 'high',
                riskLevel: 'high'
            },
            {
                id: 'emp_003',
                name: 'Maria Costa',
                role: 'Designer UX',
                performance: 85,
                efficiency: 90,
                satisfaction: 85,
                optimizationPotential: 'low',
                riskLevel: 'low'
            },
            {
                id: 'emp_004',
                name: 'João Oliveira',
                role: 'Analista de Dados',
                performance: 55,
                efficiency: 60,
                satisfaction: 50,
                optimizationPotential: 'high',
                riskLevel: 'high'
            }
        ];
        
        this.processEmployeeData({ employees: this.employees });
        this.generateInsights();
        
        // Start activity simulation
        setTimeout(() => {
            this.addActivity('insight', 'Sistema Inicializado', 'IA começou a monitorar produtividade da equipe');
        }, 2000);
    }

    generateSimulatedData() {
        return {
            employees: this.employees
        };
    }

    generateAIInsights(employeeId) {
        const suggestions = [
            {
                title: 'Otimizar Horário de Trabalho',
                description: 'Ajustar horários baseado em picos de produtividade pessoal',
                impact: '+15% produtividade'
            },
            {
                title: 'Redistribuir Tarefas',
                description: 'Realocar tarefas baseado em skills e preferências',
                impact: '+20% satisfação'
            },
            {
                title: 'Treinamento Personalizado',
                description: 'Programa de desenvolvimento focado em gaps identificados',
                impact: '+25% performance'
            },
            {
                title: 'Ambiente de Trabalho',
                description: 'Ajustes no ambiente físico/digital para maior foco',
                impact: '+10% eficiência'
            }
        ];
        
        return {
            suggestions: suggestions.slice(0, 3) // Return 3 random suggestions
        };
    }
}

// Global functions
function applyOptimization() {
    if (window.optimizer) {
        window.optimizer.applyOptimization();
    }
}

function closeOptimizationPanel() {
    if (window.optimizer) {
        window.optimizer.closeOptimizationPanel();
    }
}

// Initialize the optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.optimizer = new AIEmployeeOptimizer();
});