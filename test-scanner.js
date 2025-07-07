#!/usr/bin/env node
/**
 * Teste do GUNIC Advanced Security Scanner
 * Demonstra o funcionamento do scanner JavaScript
 */

const axios = require('axios');

const SCANNER_URL = 'http://localhost:5000';

async function testScanner() {
    console.log('🧪 Testando GUNIC Advanced Security Scanner - JavaScript Version\n');

    // Teste 1: Health Check
    console.log('1️⃣ Testando Health Check...');
    try {
        const healthResponse = await axios.get(`${SCANNER_URL}/health`);
        console.log('✅ Health Check:', healthResponse.data);
    } catch (error) {
        console.log('❌ Health Check falhou:', error.message);
        console.log('💡 Certifique-se de que o servidor está rodando: npm start');
        return;
    }

    // Teste 2: Scan de exemplo (usando um site de teste)
    console.log('\n2️⃣ Testando Scan de Segurança...');
    console.log('🎯 Alvo: https://httpbin.org (site de teste)');

    try {
        const scanResponse = await axios.post(`${SCANNER_URL}/scan`, {
            url: 'https://httpbin.org'
        }, {
            timeout: 60000 // 60 segundos para scan completo
        });

        const results = scanResponse.data;

        console.log('\n📊 RESULTADOS DO SCAN:');
        console.log('='.repeat(50));

        // Portas abertas
        console.log('\n🔌 PORTAS ABERTAS:');
        if (results.open_ports && results.open_ports.length > 0) {
            results.open_ports.forEach(port => {
                console.log(`   ✅ Porta ${port.port} (${port.service})`);
            });
        } else {
            console.log('   ❌ Nenhuma porta aberta detectada');
        }

        // Subdomínios
        console.log('\n🌐 SUBDOMÍNIOS:');
        if (results.subdomains && results.subdomains.length > 0) {
            results.subdomains.forEach(subdomain => {
                console.log(`   ✅ ${subdomain}`);
            });
        } else {
            console.log('   ❌ Nenhum subdomínio encontrado');
        }

        // Tecnologias
        console.log('\n🛠️ TECNOLOGIAS DETECTADAS:');
        if (results.technologies) {
            console.log(`   🖥️  Servidor: ${results.technologies.server}`);
            console.log(`   ⚡ Powered By: ${results.technologies.powered_by}`);
            console.log(`   🏗️  Framework: ${results.technologies.framework}`);
            console.log(`   📝 CMS: ${results.technologies.cms}`);
        }

        // SSL/TLS
        console.log('\n🔒 SSL/TLS:');
        if (results.ssl_info && !results.ssl_info.error) {
            console.log(`   🔐 Versão: ${results.ssl_info.version}`);
            console.log(`   🔑 Cipher: ${results.ssl_info.cipher?.name || 'N/A'}`);
            console.log(`   📅 Expira: ${results.ssl_info.cert_expires || 'N/A'}`);
        } else {
            console.log('   ❌ Informações SSL não disponíveis');
        }

        // DNS Records
        console.log('\n📡 REGISTROS DNS:');
        if (results.dns_records) {
            Object.entries(results.dns_records).forEach(([type, records]) => {
                if (records && records.length > 0) {
                    console.log(`   ${type}: ${records.join(', ')}`);
                }
            });
        }

        // Vulnerabilidades
        console.log('\n🚨 VULNERABILIDADES:');
        if (results.vulnerabilities && results.vulnerabilities.length > 0) {
            results.vulnerabilities.forEach(vuln => {
                console.log(`   ⚠️  ${vuln.type} (${vuln.severity})`);
                console.log(`      📍 ${vuln.url}`);
                console.log(`      📝 ${vuln.description}`);
            });
        } else {
            console.log('   ✅ Nenhuma vulnerabilidade detectada');
        }

        // WHOIS
        console.log('\n📋 WHOIS:');
        if (results.whois_data && !results.whois_data.error) {
            console.log(`   🏢 Registrar: ${results.whois_data.registrar}`);
            console.log(`   📅 Criação: ${results.whois_data.creation_date}`);
            console.log(`   ⏰ Expiração: ${results.whois_data.expiration_date}`);
        } else {
            console.log('   ❌ Informações WHOIS não disponíveis');
        }

        console.log('\n' + '='.repeat(50));
        console.log('✅ Teste concluído com sucesso!');
        console.log(`⏱️  Tempo total: ${Date.now() - results.timestamp}ms`);

    } catch (error) {
        console.log('❌ Erro durante o scan:', error.message);
        if (error.response) {
            console.log('📄 Resposta do servidor:', error.response.data);
        }
    }
}

async function testMultipleTargets() {
    console.log('\n🧪 Testando Múltiplos Alvos...\n');

    const testTargets = [
        'https://httpbin.org',
        'https://jsonplaceholder.typicode.com',
        'https://httpstat.us'
    ];

    for (const target of testTargets) {
        console.log(`🎯 Testando: ${target}`);
        try {
            const response = await axios.post(`${SCANNER_URL}/scan`, {
                url: target
            }, {
                timeout: 30000
            });

            const results = response.data;
            console.log(`   ✅ Scan concluído`);
            console.log(`   🔌 Portas: ${results.open_ports?.length || 0}`);
            console.log(`   🌐 Subdomínios: ${results.subdomains?.length || 0}`);
            console.log(`   🚨 Vulnerabilidades: ${results.vulnerabilities?.length || 0}`);
            console.log(`   🛠️  Servidor: ${results.technologies?.server || 'N/A'}`);

        } catch (error) {
            console.log(`   ❌ Erro: ${error.message}`);
        }
        console.log('');
    }
}

// Função principal
async function main() {
    console.log('🚀 GUNIC Advanced Security Scanner - Test Suite');
    console.log('⚠️  Use apenas com autorização!\n');

    await testScanner();

    // Descomente a linha abaixo para testar múltiplos alvos
    // await testMultipleTargets();

    console.log('\n🎉 Todos os testes concluídos!');
}

// Executar se chamado diretamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testScanner, testMultipleTargets };
