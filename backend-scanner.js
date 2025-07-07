#!/usr/bin/env node
/**
 * GUNIC Advanced Security Scanner Backend - JavaScript Version
 * Scanner profissional sem limitações de CORS
 */

const express = require('express');
const cors = require('cors');
const net = require('net');
const dns = require('dns').promises;
const https = require('https');
const http = require('http');
const { URL } = require('url');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

class AdvancedSecurityScanner {
    constructor() {
        this.vulnerabilities = [];
        this.session = axios.create({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
    }

    async scanTarget(url) {
        console.log(`[+] Starting scan for: ${url}`);

        const results = {
            url: url,
            timestamp: Date.now(),
            vulnerabilities: [],
            open_ports: [],
            subdomains: [],
            technologies: {},
            ssl_info: {},
            dns_records: {},
            whois_data: {}
        };

        const domain = new URL(url).hostname;

        try {
            // 1. Port Scanning REAL
            results.open_ports = await this.portScan(domain);

            // 2. Subdomain Enumeration REAL
            results.subdomains = await this.subdomainEnum(domain);

            // 3. SSL/TLS Analysis REAL
            results.ssl_info = await this.sslAnalysis(domain);

            // 4. DNS Enumeration REAL
            results.dns_records = await this.dnsEnum(domain);

            // 5. WHOIS Lookup REAL
            results.whois_data = await this.whoisLookup(domain);

            // 6. Web Vulnerability Scanning REAL
            results.vulnerabilities = await this.webVulnScan(url);

            // 7. Technology Detection REAL
            results.technologies = await this.techDetection(url);

        } catch (error) {
            console.error(`[!] Error during scan: ${error.message}`);
        }

        return results;
    }

    async portScan(domain) {
        console.log(`[+] Scanning ports on ${domain}`);
        const openPorts = [];
        const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3306, 3389, 5432, 6379, 27017];

        const scanPromises = commonPorts.map(port => this.scanPort(domain, port));
        const results = await Promise.allSettled(scanPromises);

        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                openPorts.push(result.value);
                console.log(`[+] Port ${commonPorts[index]} open (${result.value.service})`);
            }
        });

        return openPorts;
    }

    async scanPort(domain, port) {
        return new Promise((resolve) => {
            const socket = new net.Socket();
            socket.setTimeout(2000);

            socket.on('connect', () => {
                const service = this.getServiceName(port);
                socket.destroy();
                resolve({ port, service });
            });

            socket.on('timeout', () => {
                socket.destroy();
                resolve(null);
            });

            socket.on('error', () => {
                socket.destroy();
                resolve(null);
            });

            socket.connect(port, domain);
        });
    }

    getServiceName(port) {
        const services = {
            21: 'ftp', 22: 'ssh', 23: 'telnet', 25: 'smtp', 53: 'dns',
            80: 'http', 110: 'pop3', 143: 'imap', 443: 'https', 993: 'imaps',
            995: 'pop3s', 3306: 'mysql', 3389: 'rdp', 5432: 'postgresql',
            6379: 'redis', 27017: 'mongodb'
        };
        return services[port] || 'unknown';
    }

    async subdomainEnum(domain) {
        console.log(`[+] Enumerating subdomains for ${domain}`);
        const subdomains = [];
        const wordlist = ['www', 'mail', 'ftp', 'admin', 'test', 'dev', 'staging', 'api', 'blog', 'shop', 'portal', 'secure', 'vpn', 'remote', 'backup', 'db', 'mysql', 'phpmyadmin', 'cpanel', 'webmail', 'support'];

        const checkPromises = wordlist.map(sub => this.checkSubdomain(sub, domain));
        const results = await Promise.allSettled(checkPromises);

        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                subdomains.push(result.value);
                console.log(`[+] Found subdomain: ${result.value}`);
            }
        });

        return subdomains;
    }

    async checkSubdomain(sub, domain) {
        try {
            const subdomain = `${sub}.${domain}`;
            await dns.lookup(subdomain);
            return subdomain;
        } catch {
            return null;
        }
    }

    async sslAnalysis(domain) {
        console.log(`[+] Analyzing SSL/TLS for ${domain}`);
        try {
            return new Promise((resolve) => {
                const options = {
                    hostname: domain,
                    port: 443,
                    method: 'GET',
                    timeout: 10000
                };

                const req = https.request(options, (res) => {
                    const cert = res.socket.getPeerCertificate();
                    resolve({
                        version: res.socket.getProtocol(),
                        cipher: res.socket.getCipher(),
                        cert_subject: cert.subject,
                        cert_issuer: cert.issuer,
                        cert_expires: cert.valid_to
                    });
                });

                req.on('error', (error) => {
                    resolve({ error: error.message });
                });

                req.on('timeout', () => {
                    req.destroy();
                    resolve({ error: 'Timeout' });
                });

                req.end();
            });
        } catch (error) {
            return { error: error.message };
        }
    }

    async dnsEnum(domain) {
        console.log(`[+] DNS enumeration for ${domain}`);
        const records = {};
        const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS', 'SOA'];

        for (const recordType of recordTypes) {
            try {
                const answers = await dns.resolve(domain, recordType);
                records[recordType] = answers;
            } catch {
                records[recordType] = [];
            }
        }

        return records;
    }

    async whoisLookup(domain) {
        console.log(`[+] WHOIS lookup for ${domain}`);
        try {
            // Usando API pública para WHOIS (alternativa ao módulo python-whois)
            const response = await axios.get(`https://whois.whoisxmlapi.com/api/v1?apiKey=demo&domainName=${domain}`, {
                timeout: 10000
            });

            const data = response.data;
            return {
                registrar: data.registrar?.name || 'Unknown',
                creation_date: data.creationDate || 'Unknown',
                expiration_date: data.expirationDate || 'Unknown',
                name_servers: data.nameServers || [],
                emails: data.emails || []
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    async webVulnScan(url) {
        console.log(`[+] Web vulnerability scanning for ${url}`);
        const vulnerabilities = [];

        // SQL Injection Test REAL
        const sqlPayloads = ["'", "' OR '1'='1", "' UNION SELECT 1,2,3--", "'; DROP TABLE users--"];
        const params = ['id', 'user', 'search', 'q', 'page'];

        for (const param of params) {
            for (const payload of sqlPayloads) {
                try {
                    const testUrl = `${url}?${param}=${encodeURIComponent(payload)}`;
                    const response = await this.session.get(testUrl, { timeout: 5000 });

                    // Detectar erros SQL
                    const sqlErrors = ['mysql_fetch', 'ORA-', 'Microsoft OLE DB', 'PostgreSQL', 'sqlite3.OperationalError'];
                    for (const error of sqlErrors) {
                        if (response.data.toLowerCase().includes(error.toLowerCase())) {
                            vulnerabilities.push({
                                type: 'SQL Injection',
                                severity: 'critical',
                                url: testUrl,
                                description: `SQL error detected with payload: ${payload}`
                            });
                            console.log(`[!] SQL Injection found: ${param}`);
                            break;
                        }
                    }
                } catch {
                    // Ignora erros de conexão
                }
            }
        }

        // XSS Test REAL
        const xssPayloads = ["<script>alert('XSS')</script>", "<img src=x onerror=alert('XSS')>"];
        for (const param of params) {
            for (const payload of xssPayloads) {
                try {
                    const testUrl = `${url}?${param}=${encodeURIComponent(payload)}`;
                    const response = await this.session.get(testUrl, { timeout: 5000 });

                    if (response.data.includes(payload)) {
                        vulnerabilities.push({
                            type: 'Cross-Site Scripting (XSS)',
                            severity: 'high',
                            url: testUrl,
                            description: `XSS payload reflected: ${payload}`
                        });
                        console.log(`[!] XSS found: ${param}`);
                    }
                } catch {
                    // Ignora erros de conexão
                }
            }
        }

        // Directory Traversal REAL
        const lfiPayloads = ["../../../etc/passwd", "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts"];
        for (const payload of lfiPayloads) {
            try {
                const testUrl = `${url}?file=${encodeURIComponent(payload)}`;
                const response = await this.session.get(testUrl, { timeout: 5000 });

                if (response.data.includes('root:') || response.data.includes('localhost')) {
                    vulnerabilities.push({
                        type: 'Local File Inclusion (LFI)',
                        severity: 'critical',
                        url: testUrl,
                        description: `File inclusion successful: ${payload}`
                    });
                    console.log(`[!] LFI found`);
                }
            } catch {
                // Ignora erros de conexão
            }
        }

        return vulnerabilities;
    }

    async techDetection(url) {
        console.log(`[+] Technology detection for ${url}`);
        try {
            const response = await this.session.get(url, { timeout: 10000 });
            const headers = response.headers;

            const technologies = {
                server: headers.server || 'Unknown',
                powered_by: headers['x-powered-by'] || 'Unknown',
                framework: 'Unknown',
                cms: 'Unknown'
            };

            // Detectar CMS
            const content = response.data.toLowerCase();
            if (content.includes('wp-content')) {
                technologies.cms = 'WordPress';
            } else if (content.includes('joomla')) {
                technologies.cms = 'Joomla';
            } else if (content.includes('drupal')) {
                technologies.cms = 'Drupal';
            }

            return technologies;
        } catch (error) {
            return { error: error.message };
        }
    }
}

const scanner = new AdvancedSecurityScanner();

// Rotas da API
app.post('/scan', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL required' });
    }

    try {
        const results = await scanner.scanTarget(url);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'Scanner backend online' });
});

// Inicialização do servidor
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log("🚀 GUNIC Advanced Security Scanner Backend - JavaScript Version");
    console.log("⚠️  Use apenas com autorização!");
    console.log(`🌐 Starting server on http://localhost:${PORT}`);
});

module.exports = { AdvancedSecurityScanner, app };
