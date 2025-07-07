const express = require('express');
const cors = require('cors');
const AppDetector = require('./app-detector');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const detector = new AppDetector();

// Endpoint principal para detecção de aplicações
app.post('/detect-apps', async (req, res) => {
    try {
        console.log('[+] Starting application detection scan...');
        
        const results = await detector.detectAll();
        
        console.log(`[+] Scan completed. Found ${results.detected_apps.length} applications`);
        
        res.json({
            success: true,
            ...results
        });
    } catch (error) {
        console.error('[-] Error during app detection:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint para informações do sistema
app.get('/system-info', async (req, res) => {
    try {
        const systemInfo = await detector.getSystemInfo();
        res.json({
            success: true,
            system: systemInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint para scan de rede
app.get('/network-scan', async (req, res) => {
    try {
        const devices = await detector.scanNetwork();
        res.json({
            success: true,
            devices: devices
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint para detectar aplicação específica
app.post('/detect-app/:appName', async (req, res) => {
    try {
        const { appName } = req.params;
        const targetApp = detector.targetApps[appName];
        
        if (!targetApp) {
            return res.status(404).json({
                success: false,
                error: 'Application not found in database'
            });
        }

        const result = await detector.detectApp(appName, targetApp);
        
        res.json({
            success: true,
            detection: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'App Scanner backend online',
        timestamp: new Date().toISOString()
    });
});

// Lista de aplicações suportadas
app.get('/supported-apps', (req, res) => {
    const apps = Object.keys(detector.targetApps).map(name => ({
        name,
        processes: detector.targetApps[name].processes,
        ports: detector.targetApps[name].ports
    }));
    
    res.json({
        success: true,
        supported_apps: apps,
        total: apps.length
    });
});

app.listen(port, () => {
    console.log(`🔍 App Scanner Backend running on port ${port}`);
    console.log(`📊 Supported applications: ${Object.keys(detector.targetApps).length}`);
    console.log('🚀 Ready to detect applications!');
});

module.exports = app;