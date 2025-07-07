const { exec } = require('child_process');
const os = require('os');

class AppDetector {
    constructor() {
        this.targetApps = {
            'Discord': {
                processes: ['Discord.exe', 'DiscordCanary.exe', 'DiscordPTB.exe'],
                ports: [6463, 6464, 6465],
                paths: [
                    '%APPDATA%\\Discord',
                    '%LOCALAPPDATA%\\Discord'
                ]
            },
            'Radmin': {
                processes: ['RServer3.exe', 'Radmin.exe', 'RAdmin.exe'],
                ports: [4899, 4900],
                paths: [
                    'C:\\Program Files\\Radmin Server 3',
                    'C:\\Program Files (x86)\\Radmin Server 3'
                ]
            },
            'TeamViewer': {
                processes: ['TeamViewer.exe', 'TeamViewer_Service.exe'],
                ports: [5938],
                paths: [
                    'C:\\Program Files\\TeamViewer',
                    'C:\\Program Files (x86)\\TeamViewer'
                ]
            },
            'AnyDesk': {
                processes: ['AnyDesk.exe'],
                ports: [7070],
                paths: [
                    '%APPDATA%\\AnyDesk',
                    'C:\\Program Files\\AnyDesk'
                ]
            },
            'Chrome Remote Desktop': {
                processes: ['remoting_host.exe'],
                ports: [22],
                paths: [
                    '%PROGRAMFILES%\\Google\\Chrome Remote Desktop'
                ]
            },
            'Steam': {
                processes: ['Steam.exe'],
                ports: [27015, 27036],
                paths: [
                    'C:\\Program Files\\Steam',
                    'C:\\Program Files (x86)\\Steam'
                ]
            }
        };
    }

    async detectAll() {
        const results = {
            timestamp: Date.now(),
            detected_apps: [],
            running_processes: [],
            open_ports: [],
            installed_paths: []
        };

        for (const [appName, appData] of Object.entries(this.targetApps)) {
            const detection = await this.detectApp(appName, appData);
            if (detection.detected) {
                results.detected_apps.push(detection);
            }
        }

        return results;
    }

    async detectApp(appName, appData) {
        const result = {
            name: appName,
            detected: false,
            running: false,
            installed: false,
            open_ports: [],
            processes: [],
            paths: []
        };

        // Detectar processos
        const runningProcesses = await this.checkProcesses(appData.processes);
        if (runningProcesses.length > 0) {
            result.running = true;
            result.detected = true;
            result.processes = runningProcesses;
        }

        // Detectar portas abertas
        const openPorts = await this.checkPorts(appData.ports);
        if (openPorts.length > 0) {
            result.detected = true;
            result.open_ports = openPorts;
        }

        // Detectar instalação
        const installedPaths = await this.checkPaths(appData.paths);
        if (installedPaths.length > 0) {
            result.installed = true;
            result.detected = true;
            result.paths = installedPaths;
        }

        return result;
    }

    checkProcesses(processes) {
        return new Promise((resolve) => {
            const command = os.platform() === 'win32' ? 'tasklist' : 'ps aux';
            
            exec(command, (error, stdout) => {
                if (error) {
                    resolve([]);
                    return;
                }

                const runningProcesses = [];
                processes.forEach(proc => {
                    if (stdout.toLowerCase().includes(proc.toLowerCase())) {
                        runningProcesses.push(proc);
                    }
                });

                resolve(runningProcesses);
            });
        });
    }

    checkPorts(ports) {
        return new Promise((resolve) => {
            const command = os.platform() === 'win32' ? 
                'netstat -an | findstr LISTENING' : 
                'netstat -tuln';

            exec(command, (error, stdout) => {
                if (error) {
                    resolve([]);
                    return;
                }

                const openPorts = [];
                ports.forEach(port => {
                    if (stdout.includes(`:${port}`)) {
                        openPorts.push(port);
                    }
                });

                resolve(openPorts);
            });
        });
    }

    checkPaths(paths) {
        return new Promise((resolve) => {
            const foundPaths = [];
            let checked = 0;

            if (paths.length === 0) {
                resolve([]);
                return;
            }

            paths.forEach(path => {
                // Expandir variáveis de ambiente
                const expandedPath = path.replace(/%([^%]+)%/g, (match, envVar) => {
                    return process.env[envVar] || match;
                });

                const command = os.platform() === 'win32' ? 
                    `if exist "${expandedPath}" echo EXISTS` :
                    `test -d "${expandedPath}" && echo EXISTS`;

                exec(command, (error, stdout) => {
                    if (!error && stdout.trim() === 'EXISTS') {
                        foundPaths.push(expandedPath);
                    }
                    
                    checked++;
                    if (checked === paths.length) {
                        resolve(foundPaths);
                    }
                });
            });
        });
    }

    async getSystemInfo() {
        return {
            platform: os.platform(),
            arch: os.arch(),
            hostname: os.hostname(),
            uptime: os.uptime(),
            memory: {
                total: os.totalmem(),
                free: os.freemem()
            },
            cpus: os.cpus().length,
            network: os.networkInterfaces()
        };
    }

    async scanNetwork() {
        return new Promise((resolve) => {
            const command = os.platform() === 'win32' ? 
                'arp -a' : 
                'arp -a';

            exec(command, (error, stdout) => {
                if (error) {
                    resolve([]);
                    return;
                }

                const devices = [];
                const lines = stdout.split('\n');
                
                lines.forEach(line => {
                    const match = line.match(/(\d+\.\d+\.\d+\.\d+)/);
                    if (match) {
                        devices.push(match[1]);
                    }
                });

                resolve([...new Set(devices)]);
            });
        });
    }
}

module.exports = AppDetector;