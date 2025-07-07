# 🚀 GUNIC Advanced Security Scanner - Setup

## ⚡ Scanner SEM Limitações - Instalação

### 📋 Pré-requisitos
- Python 3.8+
- pip (gerenciador de pacotes Python)

### 🔧 Instalação Rápida

```bash
# 1. Instalar dependências
pip install -r requirements.txt

# 2. Executar backend
python backend-scanner.py

# 3. Abrir real-security-scanner.html no navegador
```

### 🎯 O que o Scanner FAZ DE VERDADE:

#### 🔍 **Port Scanning REAL**
- Escaneia portas TCP reais usando sockets
- Detecta serviços rodando (SSH, MySQL, RDP, etc.)
- Identifica portas perigosas abertas

#### 🌐 **Subdomain Enumeration REAL**
- Resolve DNS de subdomínios reais
- Encontra admin.site.com, dev.site.com, etc.
- Detecta subdomínios sensíveis

#### 🔒 **SSL/TLS Analysis REAL**
- Conecta via SSL e analisa certificados
- Verifica versões TLS, ciphers
- Detecta certificados expirados

#### 📋 **DNS Enumeration REAL**
- Consulta registros A, MX, TXT, NS reais
- Encontra servidores de email
- Detecta configurações SPF/DKIM

#### 🔍 **WHOIS Lookup REAL**
- Consulta dados reais de registro
- Encontra emails de contato
- Verifica datas de expiração

#### 🎯 **Web Vulnerability Scanning REAL**
- Testa SQL Injection com payloads reais
- Detecta XSS refletido
- Testa Local File Inclusion (LFI)
- Analisa respostas HTTP reais

#### 💻 **Technology Detection REAL**
- Lê headers HTTP reais
- Detecta CMS (WordPress, Joomla, Drupal)
- Identifica frameworks e versões

### 🚨 **Diferenças do Scanner Real vs Simulado:**

| Funcionalidade | Navegador (Limitado) | Backend Python (Real) |
|---|---|---|
| Port Scanning | ❌ Impossível | ✅ Socket real |
| Subdomain Enum | ❌ CORS bloqueia | ✅ DNS real |
| SSL Analysis | ❌ Limitado | ✅ Certificado real |
| SQL Injection | ❌ CORS bloqueia | ✅ Payload real |
| WHOIS Lookup | ❌ Impossível | ✅ Consulta real |

### 📊 **Exemplo de Resultado Real:**

```
🎯 SCAN COMPLETO SEM LIMITAÇÕES CONCLUÍDO!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔌 PORTAS ABERTAS ENCONTRADAS:
   Port 22: ssh
   Port 80: http
   Port 443: https
   🚨 PORTA PERIGOSA: 3306 (mysql)

🌐 SUBDOMÍNIOS DESCOBERTOS:
   www.exemplo.com
   mail.exemplo.com
   ⚠️ SUBDOMÍNIO SENSÍVEL: admin.exemplo.com

🔒 INFORMAÇÕES SSL:
   Versão: TLSv1.3
   Cipher: TLS_AES_256_GCM_SHA384
   Expira: Dec 15 23:59:59 2024 GMT

🚨 VULNERABILIDADES CRÍTICAS ENCONTRADAS:
1. [CRITICAL] SQL Injection
   URL: https://exemplo.com?id=' OR '1'='1
   Descrição: SQL error detected with payload: ' OR '1'='1

📊 RESUMO FINAL:
🔴 Problemas críticos: 2
🌐 Subdomínios: 3
🔌 Portas abertas: 4
```

### 🎯 **Para Apresentar ao Cliente:**

1. **Execute o scan completo** com backend Python
2. **Mostre resultados REAIS** (portas, subdomínios, vulnerabilidades)
3. **Documente problemas críticos** encontrados
4. **Ofereça soluções** profissionais

### ⚖️ **Uso Ético:**
- ✅ Use apenas em sites próprios
- ✅ Obtenha autorização por escrito
- ✅ Reporte vulnerabilidades responsavelmente
- ❌ Nunca use para ataques maliciosos

### 🆘 **Troubleshooting:**

**Erro: ModuleNotFoundError**
```bash
pip install -r requirements.txt
```

**Erro: Permission denied**
```bash
# Linux/Mac
sudo python backend-scanner.py

# Windows (executar como administrador)
```

**Backend não conecta:**
- Verifique se está rodando na porta 5000
- Desative firewall temporariamente
- Use http://localhost:5000 (não https)

---

**🎉 Agora você tem um scanner REAL que funciona de verdade!**