const AppDetector = require('./app-detector');

async function testAppDetector() {
    console.log('🔍 Testando GUNIC App Detector...\n');
    
    const detector = new AppDetector();
    
    // Teste 1: Informações do sistema
    console.log('📊 1. Informações do Sistema:');
    try {
        const systemInfo = await detector.getSystemInfo();
        console.log(`   ✅ Plataforma: ${systemInfo.platform}`);
        console.log(`   ✅ Arquitetura: ${systemInfo.arch}`);
        console.log(`   ✅ Hostname: ${systemInfo.hostname}`);
        console.log(`   ✅ CPUs: ${systemInfo.cpus}`);
        console.log(`   ✅ Memória Total: ${(systemInfo.memory.total / 1024 / 1024 / 1024).toFixed(2)}GB`);
        console.log(`   ✅ Memória Livre: ${(systemInfo.memory.free / 1024 / 1024 / 1024).toFixed(2)}GB`);
    } catch (error) {
        console.log(`   ❌ Erro: ${error.message}`);
    }
    
    console.log('\n🔍 2. Testando Detecção de Aplicações:');
    
    // Teste 2: Detecção individual de cada app
    for (const [appName, appData] of Object.entries(detector.targetApps)) {
        console.log(`\n   🎯 Testando ${appName}:`);
        
        try {
            const result = await detector.detectApp(appName, appData);
            
            console.log(`      Detectado: ${result.detected ? '✅' : '❌'}`);
            console.log(`      Executando: ${result.running ? '✅' : '❌'}`);
            console.log(`      Instalado: ${result.installed ? '✅' : '❌'}`);
            
            if (result.processes.length > 0) {
                console.log(`      Processos: ${result.processes.join(', ')}`);
            }
            
            if (result.open_ports.length > 0) {
                console.log(`      Portas: ${result.open_ports.join(', ')}`);
            }
            
            if (result.paths.length > 0) {
                console.log(`      Caminhos: ${result.paths.join(', ')}`);
            }
            
        } catch (error) {
            console.log(`      ❌ Erro: ${error.message}`);
        }
    }
    
    // Teste 3: Scan completo
    console.log('\n🚀 3. Scan Completo:');
    try {
        const fullScan = await detector.detectAll();
        console.log(`   ✅ Timestamp: ${new Date(fullScan.timestamp).toLocaleString()}`);
        console.log(`   ✅ Aplicações detectadas: ${fullScan.detected_apps.length}`);
        
        fullScan.detected_apps.forEach(app => {
            console.log(`      📱 ${app.name}: ${app.detected ? 'DETECTADO' : 'NÃO ENCONTRADO'}`);
        });
        
    } catch (error) {
        console.log(`   ❌ Erro no scan completo: ${error.message}`);
    }
    
    // Teste 4: Scan de rede
    console.log('\n🌐 4. Scan de Rede:');
    try {
        const devices = await detector.scanNetwork();
        console.log(`   ✅ Dispositivos encontrados: ${devices.length}`);
        devices.forEach(device => {
            console.log(`      🖥️  ${device}`);
        });
    } catch (error) {
        console.log(`   ❌ Erro no scan de rede: ${error.message}`);
    }
    
    console.log('\n✅ Teste concluído!');
    console.log('\n📋 Para usar a interface web:');
    console.log('   1. node app-scanner-backend.js');
    console.log('   2. Abrir app-scanner.html no navegador');
}

// Executar teste
testAppDetector().catch(console.error);