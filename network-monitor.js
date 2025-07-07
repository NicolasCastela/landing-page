#!/usr/bin/env node
/**
 * GUNIC Network Monitor - Detecção de IPs e Conexões
 * Monitora rede local e conexões ativas
 */

const express = require('express');
const cors = require('cors');
const os = require('os');
const { exec } = require('child_process');
const axios = require('axios');
const net = require('net');
const dns = require('dns').promises;

const app = express();
app.use(cors());
app.use(express.json());

class NetworkMonitor {
    constructor() {
        this.activeConnections = [];
        this.networkInterfaces = {};
        this.localNetwork = [];
    }

    async getNetworkInfo() {
        console.log('[+] Coletando informações de rede...');

        const networkInfo = {
            timestamp: Date.now(),
            localIPs: [],
            publicIP: null,
            networkInterfaces: {},
            activeConnections: [],
            localNetwork: [],
            dnsServers: [],
            gateway: null
        };

        try {
            // 1. IPs Locais
            networkInfo.localIPs = this.getLocalIPs();

            // 2. IP Público
            networkInfo.publicIP = await this.getPublicIP();

            // 3. Interfaces de Rede
            networkInfo.networkInterfaces = this.getNetworkInterfaces();

            // 4. Conexões Ativas
            networkInfo.activeConnections = await this.getActiveConnections();

            // 5. Rede Local
            networkInfo.localNetwork = await this.scanLocalNetwork();

            // 6. DNS Servers
            networkInfo.dnsServers = await this.getDNSServers();

            // 7. Gateway
            networkInfo.gateway = await this.getGateway();

        } catch (error) {
            console.error('[!] Erro ao coletar informações:', error.message);
        }

        return networkInfo;
    }

    getLocalIPs() {
        const interfaces = os.networkInterfaces();
        const ips = [];

        Object.keys(interfaces).forEach(ifaceName => {
            interfaces[ifaceName].forEach(iface => {
                if (iface.family === 'IPv4' && !iface.internal) {
                    ips.push({
                        interface: ifaceName,
                        address: iface.address,
                        netmask: iface.netmask,
                        mac: iface.mac
                    });
                }
            });
        });

        return ips;
    }

    async getPublicIP() {
        try {
            const response = await axios.get('https://api.ipify.org?format=json', {
                timeout: 5000
            });
            return response.data.ip;
        } catch (error) {
            console.error('[!] Erro ao obter IP público:', error.message);
            return null;
        }
    }

    getNetworkInterfaces() {
        const interfaces = os.networkInterfaces();
        const result = {};

        Object.keys(interfaces).forEach(ifaceName => {
            result[ifaceName] = interfaces[ifaceName].map(iface => ({
                family: iface.family,
                address: iface.address,
                netmask: iface.netmask,
                mac: iface.mac,
                internal: iface.internal
            }));
        });

        return result;
    }

    async getActiveConnections() {
        return new Promise((resolve) => {
            const connections = [];

            // Windows
            if (process.platform === 'win32') {
                exec('netstat -an', (error, stdout) => {
                    if (!error) {
                        const lines = stdout.split('\n');
                        lines.forEach(line => {
                            const match = line.match(/(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/);
                            if (match) {
                                const [, protocol, localAddress, foreignAddress, state] = match;
                                if (state === 'ESTABLISHED' || state === 'LISTENING') {
                                    connections.push({
                                        protocol,
                                        localAddress,
                                        foreignAddress,
                                        state
                                    });
                                }
                            }
                        });
                    }
                    resolve(connections);
                });
            }
            // Linux/Mac
            else {
                exec('netstat -an', (error, stdout) => {
                    if (!error) {
                        const lines = stdout.split('\n');
                        lines.forEach(line => {
                            const match = line.match(/(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/);
                            if (match) {
                                const [, protocol, localAddress, foreignAddress, state] = match;
                                if (state === 'ESTABLISHED' || state === 'LISTEN') {
                                    connections.push({
                                        protocol,
                                        localAddress,
                                        foreignAddress,
                                        state
                                    });
                                }
                            }
                        });
                    }
                    resolve(connections);
                });
            }
        });
    }

    async scanLocalNetwork() {
        const localIPs = this.getLocalIPs();
        const network = [];

        for (const localIP of localIPs) {
            const baseIP = this.getBaseIP(localIP.address, localIP.netmask);
            console.log(`[+] Escaneando rede: ${baseIP}/24`);

            // Escaneia os primeiros 50 IPs da rede
            for (let i = 1; i <= 50; i++) {
                const testIP = this.incrementIP(baseIP, i);
                const isActive = await this.pingHost(testIP);

                if (isActive) {
                    const hostInfo = await this.getHostInfo(testIP);
                    network.push({
                        ip: testIP,
                        active: true,
                        hostname: hostInfo.hostname,
                        openPorts: hostInfo.openPorts,
                        lastSeen: Date.now()
                    });
                    console.log(`[+] Host ativo: ${testIP} (${hostInfo.hostname})`);
                }
            }
        }

        return network;
    }

    getBaseIP(address, netmask) {
        const addrParts = address.split('.').map(Number);
        const maskParts = netmask.split('.').map(Number);

        return addrParts.map((part, i) => part & maskParts[i]).join('.');
    }

    incrementIP(baseIP, increment) {
        const parts = baseIP.split('.').map(Number);
        parts[3] += increment;

        if (parts[3] > 255) {
            parts[2]++;
            parts[3] = parts[3] - 256;
        }

        return parts.join('.');
    }

    async pingHost(ip) {
        return new Promise((resolve) => {
            const socket = new net.Socket();
            socket.setTimeout(1000);

            socket.on('connect', () => {
                socket.destroy();
                resolve(true);
            });

            socket.on('timeout', () => {
                socket.destroy();
                resolve(false);
            });

            socket.on('error', () => {
                socket.destroy();
                resolve(false);
            });

            socket.connect(80, ip);
        });
    }

    async getHostInfo(ip) {
        const hostInfo = {
            hostname: 'Unknown',
            openPorts: []
        };

        try {
            // Tenta resolver hostname
            const hostnames = await dns.reverse(ip);
            if (hostnames.length > 0) {
                hostInfo.hostname = hostnames[0];
            }
        } catch {
            // Hostname não encontrado
        }

        // Verifica portas comuns
        const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3306, 3389, 5432, 6379, 27017];

        for (const port of commonPorts) {
            const isOpen = await this.checkPort(ip, port);
            if (isOpen) {
                hostInfo.openPorts.push({
                    port,
                    service: this.getServiceName(port)
                });
            }
        }

        return hostInfo;
    }

    async checkPort(ip, port) {
        return new Promise((resolve) => {
            const socket = new net.Socket();
            socket.setTimeout(1000);

            socket.on('connect', () => {
                socket.destroy();
                resolve(true);
            });

            socket.on('timeout', () => {
                socket.destroy();
                resolve(false);
            });

            socket.on('error', () => {
                socket.destroy();
                resolve(false);
            });

            socket.connect(port, ip);
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

    async getDNSServers() {
        try {
            const dnsServers = [];

            // Windows
            if (process.platform === 'win32') {
                return new Promise((resolve) => {
                    exec('ipconfig /all', (error, stdout) => {
                        if (!error) {
                            const lines = stdout.split('\n');
                            lines.forEach(line => {
                                if (line.includes('DNS Servers')) {
                                    const match = line.match(/(\d+\.\d+\.\d+\.\d+)/);
                                    if (match) {
                                        dnsServers.push(match[1]);
                                    }
                                }
                            });
                        }
                        resolve(dnsServers);
                    });
                });
            }
            // Linux/Mac
            else {
                return new Promise((resolve) => {
                    exec('cat /etc/resolv.conf', (error, stdout) => {
                        if (!error) {
                            const lines = stdout.split('\n');
                            lines.forEach(line => {
                                if (line.startsWith('nameserver')) {
                                    const match = line.match(/nameserver\s+(\S+)/);
                                    if (match) {
                                        dnsServers.push(match[1]);
                                    }
                                }
                            });
                        }
                        resolve(dnsServers);
                    });
                });
            }
        } catch (error) {
            return [];
        }
    }

    async getGateway() {
        try {
            // Windows
            if (process.platform === 'win32') {
                return new Promise((resolve) => {
                    exec('route print', (error, stdout) => {
                        if (!error) {
                            const lines = stdout.split('\n');
                            lines.forEach(line => {
                                if (line.includes('0.0.0.0') && line.includes('0.0.0.0')) {
                                    const match = line.match(/(\d+\.\d+\.\d+\.\d+)/);
                                    if (match) {
                                        resolve(match[1]);
                                    }
                                }
                            });
                        }
                        resolve(null);
                    });
                });
            }
            // Linux/Mac
            else {
                return new Promise((resolve) => {
                    exec('netstat -nr | grep default', (error, stdout) => {
                        if (!error) {
                            const match = stdout.match(/default\s+(\S+)/);
                            if (match) {
                                resolve(match[1]);
                            }
                        }
                        resolve(null);
                    });
                });
            }
        } catch (error) {
            return null;
        }
    }

    // Monitoramento contínuo
    startMonitoring(interval = 30000) {
        console.log(`[+] Iniciando monitoramento de rede (intervalo: ${interval}ms)`);

        setInterval(async () => {
            const networkInfo = await this.getNetworkInfo();
            this.activeConnections = networkInfo.activeConnections;
            this.localNetwork = networkInfo.localNetwork;

            console.log(`[+] Monitoramento: ${networkInfo.activeConnections.length} conexões ativas, ${networkInfo.localNetwork.length} hosts na rede local`);

            // Verifica por novos hosts suspeitos
            this.detectSuspiciousActivity(networkInfo);

        }, interval);
    }

    detectSuspiciousActivity(networkInfo) {
        // Detecta conexões suspeitas
        const suspiciousConnections = networkInfo.activeConnections.filter(conn => {
            // Conexões para portas suspeitas
            const suspiciousPorts = [22, 23, 3389, 5900, 5901]; // SSH, Telnet, RDP, VNC
            const foreignPort = parseInt(conn.foreignAddress.split(':')[1]);

            return suspiciousPorts.includes(foreignPort) && conn.state === 'ESTABLISHED';
        });

        if (suspiciousConnections.length > 0) {
            console.log('🚨 ATIVIDADE SUSPEITA DETECTADA:');
            suspiciousConnections.forEach(conn => {
                console.log(`   ⚠️  Conexão suspeita: ${conn.localAddress} -> ${conn.foreignAddress} (${conn.protocol})`);
            });
        }

        // Detecta novos hosts na rede
        const newHosts = networkInfo.localNetwork.filter(host => {
            const existingHost = this.localNetwork.find(h => h.ip === host.ip);
            return !existingHost;
        });

        if (newHosts.length > 0) {
            console.log('🆕 NOVOS HOSTS DETECTADOS:');
            newHosts.forEach(host => {
                console.log(`   📱 Novo host: ${host.ip} (${host.hostname})`);
            });
        }
    }
}

const monitor = new NetworkMonitor();

// Rotas da API
app.get('/network-info', async (req, res) => {
    try {
        const networkInfo = await monitor.getNetworkInfo();
        res.json(networkInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/start-monitoring', (req, res) => {
    const { interval = 30000 } = req.body;
    monitor.startMonitoring(interval);
    res.json({ message: 'Monitoramento iniciado', interval });
});

app.get('/active-connections', (req, res) => {
    res.json({
        connections: monitor.activeConnections,
        localNetwork: monitor.localNetwork
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'Network Monitor online' });
});

// Inicialização
const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log("🔍 GUNIC Network Monitor");
    console.log("⚠️  Use apenas em redes autorizadas!");
    console.log(`🌐 Servidor rodando em http://localhost:${PORT}`);
});

module.exports = { NetworkMonitor, monitor };
