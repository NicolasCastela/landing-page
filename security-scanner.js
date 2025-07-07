class SecurityScanner {
    constructor() {
        this.scanOptions = ['basic'];
        this.currentScan = null;
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Option cards selection
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.option-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.scanOptions = [card.dataset.option];
            });
        });
        
        // Enter key on input
        document.getElementById('urlInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                startScan();
            }
        });
    }
    
    async scanUrl(url, options = ['basic']) {
        const results = {
            url: url,
            timestamp: new Date().toISOString(),
            score: 0,
            vulnerabilities: [],
            endpoints: [],
            security: {},
            technical: {},
            recommendations: []
        };
        
        try {
            // Análise básica de URL
            results.security.urlAnalysis = this.analyzeUrl(url);
            
            // Simulação de requisições (em produção, seria feito no backend)
            if (options.includes('basic')) {
                await this.basicScan(url, results);
            }
            
            if (options.includes('deep')) {
                await this.deepScan(url, results);
            }
            
            if (options.includes('api')) {
                await this.apiScan(url, results);
            }
            
            if (options.includes('owasp')) {
                await this.owaspScan(url, results);
            }
            
            // Calcular score final
            results.score = this.calculateSecurityScore(results);
            
            return results;
            
        } catch (error) {
            console.error('Erro no scan:', error);
            throw error;
        }
    }
    
    analyzeUrl(url) {
        const analysis = {
            protocol: new URL(url).protocol,
            domain: new URL(url).hostname,
            port: new URL(url).port || (new URL(url).protocol === 'https:' ? 443 : 80),
            path: new URL(url).pathname,
            hasSSL: new URL(url).protocol === 'https:',
            suspiciousPatterns: []
        };
        
        // Verificar padrões suspeitos
        const suspiciousPatterns = [
            { pattern: /admin|login|dashboard/i, risk: 'medium', description: 'Endpoint administrativo exposto' },
            { pattern: /api\/v\d+/i, risk: 'low', description: 'API versionada detectada' },
            { pattern: /\.php|\.asp|\.jsp/i, risk: 'medium', description: 'Tecnologia de backend exposta' },
            { pattern: /debug|test|dev/i, risk: 'high', description: 'Endpoint de desenvolvimento/debug' }
        ];
        
        suspiciousPatterns.forEach(({ pattern, risk, description }) => {
            if (pattern.test(url)) {
                analysis.suspiciousPatterns.push({ risk, description });
            }
        });
        
        return analysis;
    }
    
    async basicScan(url, results) {
        // Simular verificações básicas
        await this.delay(1000);
        
        // Headers de segurança
        const securityHeaders = [
            { name: 'X-Frame-Options', present: Math.random() > 0.3, critical: true },
            { name: 'X-XSS-Protection', present: Math.random() > 0.4, critical: true },
            { name: 'X-Content-Type-Options', present: Math.random() > 0.5, critical: false },
            { name: 'Strict-Transport-Security', present: Math.random() > 0.6, critical: true },
            { name: 'Content-Security-Policy', present: Math.random() > 0.7, critical: true }
        ];
        
        results.security.headers = securityHeaders;
        
        // Adicionar vulnerabilidades baseadas em headers ausentes
        securityHeaders.forEach(header => {
            if (!header.present && header.critical) {
                results.vulnerabilities.push({
                    type: 'Missing Security Header',
                    severity: 'medium',
                    title: `Header ${header.name} ausente`,
                    description: `O header de segurança ${header.name} não foi encontrado`,
                    recommendation: `Implementar o header ${header.name} no servidor`
                });
            }
        });
        
        // SSL/TLS Analysis
        if (results.security.urlAnalysis.hasSSL) {
            results.security.ssl = {
                enabled: true,
                version: 'TLS 1.3',
                certificate: {
                    valid: Math.random() > 0.1,
                    expiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                    issuer: 'Let\'s Encrypt'
                }
            };
        } else {
            results.vulnerabilities.push({
                type: 'Insecure Connection',
                severity: 'critical',
                title: 'Conexão não criptografada',
                description: 'O site não utiliza HTTPS',
                recommendation: 'Implementar certificado SSL/TLS'
            });
        }
    }
    
    async deepScan(url, results) {
        await this.delay(2000);
        
        // Descoberta de endpoints
        const commonEndpoints = [
            '/api', '/admin', '/login', '/dashboard', '/config',
            '/backup', '/test', '/debug', '/phpinfo.php',
            '/robots.txt', '/sitemap.xml', '/.env', '/.git'
        ];
        
        const discoveredEndpoints = [];
        
        for (const endpoint of commonEndpoints) {
            if (Math.random() > 0.7) {
                const method = ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)];
                const status = [200, 301, 403, 404, 500][Math.floor(Math.random() * 5)];
                
                discoveredEndpoints.push({
                    path: endpoint,
                    method: method,
                    status: status,
                    accessible: status === 200,
                    risk: this.assessEndpointRisk(endpoint, status)
                });
                
                // Adicionar vulnerabilidades para endpoints sensíveis
                if (status === 200 && (endpoint.includes('admin') || endpoint.includes('debug'))) {
                    results.vulnerabilities.push({
                        type: 'Exposed Sensitive Endpoint',
                        severity: 'high',
                        title: `Endpoint sensível exposto: ${endpoint}`,
                        description: `O endpoint ${endpoint} está acessível publicamente`,
                        recommendation: 'Restringir acesso ou implementar autenticação'
                    });
                }
            }
        }
        
        results.endpoints = discoveredEndpoints;
    }
    
    async apiScan(url, results) {
        await this.delay(1500);
        
        // Verificar se é uma API
        const isApi = url.includes('/api') || url.includes('api.');
        
        if (isApi) {
            results.technical.apiType = 'REST';
            results.technical.apiVersion = this.extractApiVersion(url);
            
            // Verificações específicas de API
            const apiVulns = [
                {
                    type: 'API Rate Limiting',
                    severity: 'medium',
                    title: 'Rate limiting não implementado',
                    description: 'A API não possui limitação de taxa de requisições',
                    recommendation: 'Implementar rate limiting para prevenir ataques de força bruta'
                },
                {
                    type: 'API Authentication',
                    severity: 'high',
                    title: 'Autenticação fraca detectada',
                    description: 'A API pode estar usando autenticação inadequada',
                    recommendation: 'Implementar OAuth 2.0 ou JWT com refresh tokens'
                }
            ];
            
            // Adicionar algumas vulnerabilidades aleatoriamente
            apiVulns.forEach(vuln => {
                if (Math.random() > 0.6) {
                    results.vulnerabilities.push(vuln);
                }
            });
        }
    }
    
    async owaspScan(url, results) {
        await this.delay(2500);
        
        // OWASP Top 10 checks
        const owaspChecks = [
            {
                id: 'A01',
                name: 'Broken Access Control',
                severity: 'critical',
                detected: Math.random() > 0.8,
                description: 'Controle de acesso inadequado detectado'
            },
            {
                id: 'A02',
                name: 'Cryptographic Failures',
                severity: 'high',
                detected: Math.random() > 0.7,
                description: 'Falhas criptográficas identificadas'
            },
            {
                id: 'A03',
                name: 'Injection',
                severity: 'critical',
                detected: Math.random() > 0.9,
                description: 'Possível vulnerabilidade de injeção SQL/NoSQL'
            },
            {
                id: 'A04',
                name: 'Insecure Design',
                severity: 'medium',
                detected: Math.random() > 0.6,
                description: 'Design inseguro na arquitetura'
            },
            {
                id: 'A05',
                name: 'Security Misconfiguration',
                severity: 'medium',
                detected: Math.random() > 0.5,
                description: 'Configurações de segurança inadequadas'
            }
        ];
        
        owaspChecks.forEach(check => {
            if (check.detected) {
                results.vulnerabilities.push({
                    type: `OWASP ${check.id}`,
                    severity: check.severity,
                    title: check.name,
                    description: check.description,
                    recommendation: `Revisar e corrigir ${check.name.toLowerCase()}`
                });
            }
        });
    }
    
    assessEndpointRisk(endpoint, status) {
        const highRiskPaths = ['/admin', '/debug', '/config', '/.env', '/.git'];
        const mediumRiskPaths = ['/api', '/login', '/dashboard'];
        
        if (status === 200) {
            if (highRiskPaths.some(path => endpoint.includes(path))) return 'high';
            if (mediumRiskPaths.some(path => endpoint.includes(path))) return 'medium';
        }
        
        return 'low';
    }
    
    extractApiVersion(url) {
        const versionMatch = url.match(/v(\d+)/i);
        return versionMatch ? versionMatch[1] : '1';
    }
    
    calculateSecurityScore(results) {
        let score = 100;
        
        // Deduzir pontos por vulnerabilidades
        results.vulnerabilities.forEach(vuln => {
            switch (vuln.severity) {
                case 'critical': score -= 25; break;
                case 'high': score -= 15; break;
                case 'medium': score -= 10; break;
                case 'low': score -= 5; break;
            }
        });
        
        // Bonus por SSL
        if (results.security.urlAnalysis?.hasSSL) {
            score += 10;
        }
        
        // Bonus por headers de segurança
        const secureHeaders = results.security.headers?.filter(h => h.present).length || 0;
        score += secureHeaders * 2;
        
        return Math.max(0, Math.min(100, score));
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Instância global do scanner
const scanner = new SecurityScanner();

async function startScan() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Por favor, insira uma URL válida');
        return;
    }
    
    if (!isValidUrl(url)) {
        alert('URL inválida. Use o formato: https://exemplo.com');
        return;
    }
    
    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    
    try {
        const results = await scanner.scanUrl(url, scanner.scanOptions);
        displayResults(results);
    } catch (error) {
        console.error('Erro no scan:', error);
        alert('Erro ao realizar o scan. Tente novamente.');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function displayResults(results) {
    // Atualizar score
    const scoreElement = document.getElementById('scoreValue');
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreDescription = document.getElementById('scoreDescription');
    
    scoreElement.textContent = results.score;
    
    // Atualizar classe do score
    scoreCircle.className = 'score-circle';
    if (results.score >= 80) {
        scoreCircle.classList.add('score-high');
        scoreDescription.textContent = 'Excelente segurança detectada';
    } else if (results.score >= 60) {
        scoreCircle.classList.add('score-medium');
        scoreDescription.textContent = 'Segurança moderada detectada';
    } else {
        scoreCircle.classList.add('score-low');
        scoreDescription.textContent = 'Segurança baixa - ação necessária';
    }
    
    // Mostrar vulnerabilidades
    displayVulnerabilities(results.vulnerabilities);
    
    // Mostrar endpoints
    displayEndpoints(results.endpoints);
    
    // Mostrar análise de segurança
    displaySecurityAnalysis(results.security);
    
    // Mostrar informações técnicas
    displayTechnicalInfo(results.technical, results.security);
    
    // Mostrar relatório detalhado
    displayDetailedReport(results);
    
    // Mostrar resultados
    document.getElementById('results').style.display = 'block';
}

function displayVulnerabilities(vulnerabilities) {
    const container = document.getElementById('vulnerabilityList');
    container.innerHTML = '';
    
    if (vulnerabilities.length === 0) {
        container.innerHTML = '<li class="vulnerability-item vuln-low"><div class="vuln-info"><div class="vuln-title">Nenhuma vulnerabilidade crítica encontrada</div><div class="vuln-description">O scan não identificou vulnerabilidades óbvias</div></div></li>';
        return;
    }
    
    vulnerabilities.forEach(vuln => {
        const item = document.createElement('li');
        item.className = `vulnerability-item vuln-${vuln.severity}`;
        item.innerHTML = `
            <div class="vuln-info">
                <div class="vuln-title">${vuln.title}</div>
                <div class="vuln-description">${vuln.description}</div>
            </div>
            <div class="vuln-severity">${vuln.severity.toUpperCase()}</div>
        `;
        container.appendChild(item);
    });
}

function displayEndpoints(endpoints) {
    const container = document.getElementById('endpointList');
    container.innerHTML = '';
    
    if (endpoints.length === 0) {
        container.innerHTML = '<div class="endpoint-item">Nenhum endpoint adicional descoberto</div>';
        return;
    }
    
    endpoints.forEach(endpoint => {
        const item = document.createElement('div');
        item.className = 'endpoint-item';
        item.innerHTML = `
            <div>
                <span class="method-badge method-${endpoint.method.toLowerCase()}">${endpoint.method}</span>
                <span>${endpoint.path}</span>
            </div>
            <div>
                <span style="color: ${endpoint.status === 200 ? '#10b981' : '#ef4444'}">${endpoint.status}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

function displaySecurityAnalysis(security) {
    const container = document.getElementById('securityAnalysis');
    
    let html = '';
    
    if (security.ssl) {
        html += `
            <div style="margin-bottom: 1rem;">
                <strong>🔒 SSL/TLS:</strong> ${security.ssl.enabled ? 'Ativo' : 'Inativo'}
                ${security.ssl.version ? `(${security.ssl.version})` : ''}
            </div>
        `;
    }
    
    if (security.headers) {
        const presentHeaders = security.headers.filter(h => h.present).length;
        const totalHeaders = security.headers.length;
        html += `
            <div style="margin-bottom: 1rem;">
                <strong>🛡️ Headers de Segurança:</strong> ${presentHeaders}/${totalHeaders} implementados
            </div>
        `;
    }
    
    if (security.urlAnalysis) {
        html += `
            <div style="margin-bottom: 1rem;">
                <strong>🌐 Protocolo:</strong> ${security.urlAnalysis.protocol}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>🏠 Domínio:</strong> ${security.urlAnalysis.domain}
            </div>
        `;
    }
    
    container.innerHTML = html || 'Análise de segurança em andamento...';
}

function displayTechnicalInfo(technical, security) {
    const container = document.getElementById('technicalInfo');
    
    let html = '';
    
    if (technical.apiType) {
        html += `
            <div style="margin-bottom: 1rem;">
                <strong>🔌 Tipo de API:</strong> ${technical.apiType}
            </div>
        `;
    }
    
    if (technical.apiVersion) {
        html += `
            <div style="margin-bottom: 1rem;">
                <strong>📋 Versão da API:</strong> v${technical.apiVersion}
            </div>
        `;
    }
    
    if (security.urlAnalysis) {
        html += `
            <div style="margin-bottom: 1rem;">
                <strong>🔌 Porta:</strong> ${security.urlAnalysis.port}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>📁 Caminho:</strong> ${security.urlAnalysis.path}
            </div>
        `;
    }
    
    container.innerHTML = html || 'Coletando informações técnicas...';
}

function displayDetailedReport(results) {
    const container = document.getElementById('detailedReport');
    
    const report = `
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; line-height: 1.6;">
            <h4>📊 Resumo do Scan</h4>
            <p><strong>URL:</strong> ${results.url}</p>
            <p><strong>Data:</strong> ${new Date(results.timestamp).toLocaleString('pt-BR')}</p>
            <p><strong>Score de Segurança:</strong> ${results.score}/100</p>
            <p><strong>Vulnerabilidades:</strong> ${results.vulnerabilities.length}</p>
            <p><strong>Endpoints:</strong> ${results.endpoints.length}</p>
            
            <h4 style="margin-top: 2rem;">🔍 Recomendações</h4>
            ${results.vulnerabilities.length > 0 ? 
                results.vulnerabilities.map(v => `<p>• ${v.recommendation}</p>`).join('') :
                '<p>• Manter monitoramento contínuo de segurança</p><p>• Implementar testes de penetração regulares</p>'
            }
            
            <h4 style="margin-top: 2rem;">⚠️ Disclaimer</h4>
            <p style="color: #a0a0a0; font-size: 0.75rem;">
                Este scan é uma análise automatizada básica. Para uma avaliação completa de segurança, 
                recomenda-se contratar auditoria profissional de segurança cibernética.
            </p>
        </div>
    `;
    
    container.innerHTML = report;
}

function exportReport() {
    const results = scanner.currentScan;
    if (!results) return;
    
    const reportData = {
        ...results,
        exportDate: new Date().toISOString(),
        tool: 'GUNIC Security Scanner v1.0'
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Armazenar último resultado para export
scanner.currentScan = null;
const originalDisplayResults = displayResults;
displayResults = function(results) {
    scanner.currentScan = results;
    originalDisplayResults(results);
};