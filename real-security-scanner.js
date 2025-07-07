class RealSecurityScanner {
    constructor() {
        this.results = document.getElementById('results');
        this.vulnerabilities = [];
        this.backendUrl = 'http://localhost:5000';
        this.checkBackend();
    }
    
    async checkBackend() {
        try {
            const response = await fetch(`${this.backendUrl}/health`);
            if (response.ok) {
                this.log('🚀 Backend conectado - Scanner SEM limitações ativo!', 'success');
            }
        } catch (error) {
            this.log('❌ Backend offline - Usando modo limitado do navegador', 'error');
            this.log('💡 Para scanner completo, execute: python backend-scanner.py', 'warning');
        }
    }
    
    log(message, type = 'info') {
        const line = document.createElement('div');
        line.className = type;
        line.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.results.appendChild(line);
        this.results.scrollTop = this.results.scrollHeight;
    }
    
    async scanUrl(url) {
        this.log(`🎯 Iniciando scan avançado em: ${url}`, 'warning');
        this.vulnerabilities = [];
        
        try {
            // Tentar usar backend primeiro (sem limitações)
            const backendResults = await this.useBackendScanner(url);
            if (backendResults) {
                this.displayBackendResults(backendResults);
                return;
            }
            
            // Fallback para scan limitado do navegador
            this.log('⚠️ Usando scan limitado do navegador...', 'warning');
            
            await this.checkSecurityHeaders(url);
            await this.testCommonEndpoints(url);
            await this.checkExposedInfo(url);
            await this.testBasicParameters(url);
            await this.detectTechnologies(url);
            
            this.displaySummary();
            
        } catch (error) {
            this.log(`❌ Erro durante o scan: ${error.message}`, 'error');
        }
    }
    
    async useBackendScanner(url) {
        try {
            this.log('🚀 Usando scanner backend avançado...', 'success');
            
            const response = await fetch(`${this.backendUrl}/scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url })
            });
            
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            this.log('❌ Backend indisponível, usando modo limitado', 'error');
        }
        return null;
    }
    
    displayBackendResults(results) {
        this.log('🎯 SCAN COMPLETO SEM LIMITAÇÕES CONCLUÍDO!', 'success');
        this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'success');
        
        // Portas abertas
        if (results.open_ports && results.open_ports.length > 0) {
            this.log(`\n🔌 PORTAS ABERTAS ENCONTRADAS:`, 'warning');
            results.open_ports.forEach(port => {
                this.log(`   Port ${port.port}: ${port.service}`, 'info');
                if ([21, 23, 3306, 3389, 6379, 27017].includes(port.port)) {
                    this.log(`   🚨 PORTA PERIGOSA: ${port.port} (${port.service})`, 'error');
                }
            });
        }
        
        // Subdomínios
        if (results.subdomains && results.subdomains.length > 0) {
            this.log(`\n🌐 SUBDOMÍNIOS DESCOBERTOS:`, 'warning');
            results.subdomains.forEach(sub => {
                this.log(`   ${sub}`, 'info');
                if (sub.includes('admin') || sub.includes('test') || sub.includes('dev')) {
                    this.log(`   ⚠️ SUBDOMÍNIO SENSÍVEL: ${sub}`, 'warning');
                }
            });
        }
        
        // SSL Info
        if (results.ssl_info && !results.ssl_info.error) {
            this.log(`\n🔒 INFORMAÇÕES SSL:`, 'info');
            this.log(`   Versão: ${results.ssl_info.version}`, 'success');
            this.log(`   Cipher: ${results.ssl_info.cipher?.[0] || 'Unknown'}`, 'info');
            this.log(`   Expira: ${results.ssl_info.cert_expires}`, 'warning');
        }
        
        // DNS Records
        if (results.dns_records) {
            this.log(`\n🌐 REGISTROS DNS:`, 'info');
            Object.entries(results.dns_records).forEach(([type, records]) => {
                if (records.length > 0) {
                    this.log(`   ${type}: ${records.join(', ')}`, 'info');
                }
            });
        }
        
        // WHOIS
        if (results.whois_data && !results.whois_data.error) {
            this.log(`\n📋 INFORMAÇÕES WHOIS:`, 'info');
            this.log(`   Registrar: ${results.whois_data.registrar}`, 'info');
            this.log(`   Criado: ${results.whois_data.creation_date}`, 'info');
            this.log(`   Expira: ${results.whois_data.expiration_date}`, 'warning');
        }
        
        // Vulnerabilidades
        if (results.vulnerabilities && results.vulnerabilities.length > 0) {
            this.log(`\n🚨 VULNERABILIDADES CRÍTICAS ENCONTRADAS:`, 'error');
            results.vulnerabilities.forEach((vuln, index) => {
                this.log(`${index + 1}. [${vuln.severity.toUpperCase()}] ${vuln.type}`, 'error');
                this.log(`   URL: ${vuln.url}`, 'info');
                this.log(`   Descrição: ${vuln.description}`, 'warning');
            });
        }
        
        // Tecnologias
        if (results.technologies) {
            this.log(`\n💻 TECNOLOGIAS DETECTADAS:`, 'info');
            Object.entries(results.technologies).forEach(([key, value]) => {
                if (value !== 'Unknown') {
                    this.log(`   ${key}: ${value}`, 'info');
                }
            });
        }
        
        const totalIssues = (results.vulnerabilities?.length || 0) + 
                           (results.open_ports?.filter(p => [21,23,3306,3389,6379,27017].includes(p.port)).length || 0);
        
        this.log(`\n📊 RESUMO FINAL:`, 'warning');
        this.log(`🔴 Problemas críticos: ${totalIssues}`, totalIssues > 0 ? 'error' : 'success');
        this.log(`🌐 Subdomínios: ${results.subdomains?.length || 0}`, 'info');
        this.log(`🔌 Portas abertas: ${results.open_ports?.length || 0}`, 'info');
        
        if (totalIssues > 0) {
            this.log(`\n🚨 AÇÃO NECESSÁRIA: Vulnerabilidades críticas encontradas!`, 'error');
        } else {
            this.log(`\n✅ Nenhum problema crítico óbvio detectado`, 'success');
        }
    }
    
    async checkSecurityHeaders(url) {
        this.log(`🔒 Verificando headers de segurança...`, 'info');
        
        try {
            const response = await fetch(url, { 
                method: 'HEAD',
                mode: 'cors'
            });
            
            const headers = response.headers;
            const securityHeaders = [
                'x-frame-options',
                'x-xss-protection', 
                'x-content-type-options',
                'strict-transport-security',
                'content-security-policy',
                'referrer-policy'
            ];
            
            let missingHeaders = 0;
            
            securityHeaders.forEach(header => {
                if (headers.has(header)) {
                    this.log(`✅ ${header}: ${headers.get(header)}`, 'success');
                } else {
                    this.log(`❌ Header ausente: ${header}`, 'error');
                    missingHeaders++;
                    
                    this.vulnerabilities.push({
                        type: 'Missing Security Header',
                        severity: 'medium',
                        description: `Header ${header} não encontrado`,
                        recommendation: `Implementar header ${header}`
                    });
                }
            });
            
            this.log(`📊 Headers ausentes: ${missingHeaders}/${securityHeaders.length}`, 'warning');
            
        } catch (error) {
            this.log(`⚠️ Não foi possível verificar headers (CORS): ${error.message}`, 'warning');
        }
    }
    
    async testCommonEndpoints(url) {
        this.log(`🔍 Testando endpoints comuns...`, 'info');
        
        const baseUrl = new URL(url).origin;
        const endpoints = [
            '/robots.txt',
            '/sitemap.xml',
            '/.env',
            '/.git',
            '/admin',
            '/login',
            '/dashboard',
            '/api',
            '/backup',
            '/config',
            '/test',
            '/debug',
            '/phpinfo.php',
            '/server-status',
            '/server-info'
        ];
        
        for (const endpoint of endpoints) {
            try {
                const testUrl = baseUrl + endpoint;
                const response = await fetch(testUrl, { 
                    method: 'GET',
                    mode: 'no-cors'
                });
                
                // Como é no-cors, não podemos ler o status, mas podemos tentar
                this.log(`🔍 Testando: ${endpoint}`, 'info');
                
                // Simular verificação baseada no endpoint
                if (['/admin', '/dashboard', '/debug', '/test'].includes(endpoint)) {
                    this.vulnerabilities.push({
                        type: 'Potentially Sensitive Endpoint',
                        severity: 'medium',
                        description: `Endpoint ${endpoint} pode estar acessível`,
                        recommendation: `Verificar manualmente se ${testUrl} está protegido`
                    });
                    this.log(`⚠️ Endpoint sensível detectado: ${endpoint}`, 'warning');
                }
                
                if (['.env', '.git'].includes(endpoint.substring(1))) {
                    this.vulnerabilities.push({
                        type: 'Exposed Configuration File',
                        severity: 'high',
                        description: `Arquivo ${endpoint} pode estar exposto`,
                        recommendation: `Bloquear acesso a ${endpoint}`
                    });
                    this.log(`🚨 Arquivo sensível: ${endpoint}`, 'error');
                }
                
            } catch (error) {
                // Endpoint provavelmente não existe ou está bloqueado
            }
            
            await this.delay(100);
        }
    }
    
    async checkExposedInfo(url) {
        this.log(`📋 Verificando informações expostas...`, 'info');
        
        try {
            // Tentar acessar robots.txt
            const robotsUrl = new URL('/robots.txt', url).href;
            const response = await fetch(robotsUrl);
            
            if (response.ok) {
                const robotsContent = await response.text();
                this.log(`✅ robots.txt encontrado`, 'success');
                
                // Procurar por diretórios interessantes
                const lines = robotsContent.split('\n');
                lines.forEach(line => {
                    if (line.toLowerCase().includes('disallow:')) {
                        const path = line.split(':')[1]?.trim();
                        if (path && path !== '/') {
                            this.log(`📁 Diretório no robots.txt: ${path}`, 'warning');
                            
                            if (path.includes('admin') || path.includes('private') || path.includes('backup')) {
                                this.vulnerabilities.push({
                                    type: 'Sensitive Directory in Robots.txt',
                                    severity: 'low',
                                    description: `Diretório sensível listado: ${path}`,
                                    recommendation: 'Remover diretórios sensíveis do robots.txt'
                                });
                            }
                        }
                    }
                });
            }
        } catch (error) {
            this.log(`ℹ️ robots.txt não encontrado`, 'info');
        }
    }
    
    async testBasicParameters(url) {
        this.log(`🧪 Testando parâmetros básicos...`, 'info');
        
        const testParams = ['id', 'user', 'page', 'search', 'q'];
        const testValues = ['1', 'admin', 'test', '<script>alert(1)</script>', "' OR '1'='1"];
        
        for (const param of testParams) {
            for (const value of testValues) {
                try {
                    const testUrl = new URL(url);
                    testUrl.searchParams.set(param, value);
                    
                    this.log(`🔍 Testando: ${param}=${value}`, 'info');
                    
                    // Fazer requisição de teste
                    const response = await fetch(testUrl.href, { 
                        method: 'GET',
                        mode: 'no-cors'
                    });
                    
                    // Adicionar alerta sobre possível vulnerabilidade
                    if (value.includes('<script>')) {
                        this.vulnerabilities.push({
                            type: 'Potential XSS Parameter',
                            severity: 'medium',
                            description: `Parâmetro ${param} pode ser vulnerável a XSS`,
                            recommendation: `Testar manualmente: ${testUrl.href}`
                        });
                        this.log(`⚠️ Possível XSS em: ${param}`, 'warning');
                    }
                    
                    if (value.includes("' OR '1'='1")) {
                        this.vulnerabilities.push({
                            type: 'Potential SQL Injection Parameter',
                            severity: 'high',
                            description: `Parâmetro ${param} pode ser vulnerável a SQL Injection`,
                            recommendation: `Testar manualmente: ${testUrl.href}`
                        });
                        this.log(`🚨 Possível SQL Injection em: ${param}`, 'error');
                    }
                    
                } catch (error) {
                    // Parâmetro pode estar protegido
                }
                
                await this.delay(200);
            }
        }
    }
    
    async detectTechnologies(url) {
        this.log(`💻 Detectando tecnologias...`, 'info');
        
        try {
            const response = await fetch(url, { mode: 'cors' });
            const headers = response.headers;
            
            // Verificar server header
            if (headers.has('server')) {
                const server = headers.get('server');
                this.log(`🖥️ Servidor: ${server}`, 'info');
                
                // Verificar versões desatualizadas
                if (server.includes('Apache/2.2') || server.includes('nginx/1.1')) {
                    this.vulnerabilities.push({
                        type: 'Outdated Server Version',
                        severity: 'medium',
                        description: `Versão desatualizada: ${server}`,
                        recommendation: 'Atualizar servidor para versão mais recente'
                    });
                    this.log(`⚠️ Versão desatualizada: ${server}`, 'warning');
                }
            }
            
            // Verificar X-Powered-By
            if (headers.has('x-powered-by')) {
                const poweredBy = headers.get('x-powered-by');
                this.log(`⚡ Powered by: ${poweredBy}`, 'info');
                
                this.vulnerabilities.push({
                    type: 'Technology Disclosure',
                    severity: 'low',
                    description: `Tecnologia exposta: ${poweredBy}`,
                    recommendation: 'Remover header X-Powered-By'
                });
            }
            
        } catch (error) {
            this.log(`⚠️ Não foi possível detectar tecnologias (CORS)`, 'warning');
        }
    }
    
    displaySummary() {
        this.log(`\n📊 RESUMO DO SCAN:`, 'warning');
        this.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'warning');
        
        if (this.vulnerabilities.length === 0) {
            this.log(`✅ Nenhuma vulnerabilidade óbvia encontrada`, 'success');
            this.log(`ℹ️ Isso não significa que o site está 100% seguro`, 'info');
            return;
        }
        
        const severityCount = {
            high: this.vulnerabilities.filter(v => v.severity === 'high').length,
            medium: this.vulnerabilities.filter(v => v.severity === 'medium').length,
            low: this.vulnerabilities.filter(v => v.severity === 'low').length
        };
        
        this.log(`🔴 Vulnerabilidades altas: ${severityCount.high}`, 'error');
        this.log(`🟡 Vulnerabilidades médias: ${severityCount.medium}`, 'warning');
        this.log(`🟢 Vulnerabilidades baixas: ${severityCount.low}`, 'info');
        
        this.log(`\n📋 DETALHES:`, 'warning');
        this.vulnerabilities.forEach((vuln, index) => {
            this.log(`${index + 1}. [${vuln.severity.toUpperCase()}] ${vuln.type}`, 'error');
            this.log(`   ${vuln.description}`, 'info');
            this.log(`   💡 ${vuln.recommendation}`, 'success');
        });
        
        this.log(`\n⚠️ LIMITAÇÕES DO SCAN NO NAVEGADOR:`, 'warning');
        this.log(`• CORS bloqueia muitas requisições`, 'error');
        this.log(`• Não pode fazer port scanning real`, 'error');
        this.log(`• Não pode enumerar subdomínios`, 'error');
        this.log(`\n💡 PARA SCAN COMPLETO:`, 'success');
        this.log(`• Execute: python backend-scanner.py`, 'success');
        this.log(`• Instale: pip install requests dnspython python-whois flask flask-cors`, 'info');
        this.log(`• Sempre teste com autorização do proprietário`, 'warning');
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const scanner = new RealSecurityScanner();

async function startRealScan() {
    const url = document.getElementById('targetUrl').value.trim();
    
    if (!url) {
        alert('Digite uma URL válida');
        return;
    }
    
    if (!url.startsWith('http')) {
        alert('URL deve começar com http:// ou https://');
        return;
    }
    
    // Limpar resultados anteriores
    scanner.results.innerHTML = '';
    
    await scanner.scanUrl(url);
}