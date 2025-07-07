# 🚀 GUNIC Advanced Security Scanner - JavaScript Version

Scanner de segurança avançado convertido de Python para JavaScript com as mesmas funcionalidades e resultados.

## ⚠️ Aviso Legal

**Este scanner deve ser usado APENAS em sistemas que você possui autorização para testar. O uso não autorizado é ilegal.**

## 🎯 Funcionalidades

### 1. **Port Scanning REAL**
- Scan de portas comuns (21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3306, 3389, 5432, 6379, 27017)
- Detecção de serviços em portas abertas
- Timeout configurável (2 segundos por porta)

### 2. **Subdomain Enumeration REAL**
- Enumeração de subdomínios com wordlist personalizada
- Verificação de existência via DNS lookup
- Subdomínios testados: www, mail, ftp, admin, test, dev, staging, api, blog, shop, portal, secure, vpn, remote, backup, db, mysql, phpmyadmin, cpanel, webmail, support

### 3. **SSL/TLS Analysis REAL**
- Análise completa de certificados SSL/TLS
- Informações sobre versão do protocolo, cipher suite
- Detalhes do certificado (subject, issuer, data de expiração)

### 4. **DNS Enumeration REAL**
- Resolução de registros DNS: A, AAAA, MX, TXT, CNAME, NS, SOA
- Uso das APIs nativas do Node.js para DNS

### 5. **WHOIS Lookup REAL**
- Consulta WHOIS via API pública
- Informações sobre registrar, datas de criação/expiração
- Name servers e emails de contato

### 6. **Web Vulnerability Scanning REAL**
- **SQL Injection**: Testa payloads SQL maliciosos
- **Cross-Site Scripting (XSS)**: Detecta reflexão de payloads XSS
- **Local File Inclusion (LFI)**: Testa directory traversal
- Detecção de erros SQL em respostas

### 7. **Technology Detection REAL**
- Detecção de servidor web (Apache, Nginx, etc.)
- Identificação de frameworks (X-Powered-By header)
- Detecção de CMS (WordPress, Joomla, Drupal)

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Ou instalar manualmente
npm install express cors axios
```

## 🚀 Uso

### Iniciar o servidor
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start

# Ou diretamente
node backend-scanner.js
```

### Endpoints da API

#### POST `/scan`
Realiza scan completo do alvo.

**Request:**
```json
{
  "url": "https://exemplo.com"
}
```

**Response:**
```json
{
  "url": "https://exemplo.com",
  "timestamp": 1703123456789,
  "vulnerabilities": [
    {
      "type": "SQL Injection",
      "severity": "critical",
      "url": "https://exemplo.com?id='",
      "description": "SQL error detected with payload: '"
    }
  ],
  "open_ports": [
    {
      "port": 80,
      "service": "http"
    },
    {
      "port": 443,
      "service": "https"
    }
  ],
  "subdomains": ["www.exemplo.com", "mail.exemplo.com"],
  "technologies": {
    "server": "nginx/1.18.0",
    "powered_by": "PHP/7.4",
    "framework": "Unknown",
    "cms": "WordPress"
  },
  "ssl_info": {
    "version": "TLSv1.3",
    "cipher": "TLS_AES_256_GCM_SHA384",
    "cert_subject": { "CN": "exemplo.com" },
    "cert_issuer": { "CN": "Let's Encrypt" },
    "cert_expires": "2024-03-15T12:00:00.000Z"
  },
  "dns_records": {
    "A": ["192.168.1.1"],
    "AAAA": ["2001:db8::1"],
    "MX": ["mail.exemplo.com"],
    "TXT": ["v=spf1 include:_spf.google.com ~all"],
    "CNAME": [],
    "NS": ["ns1.exemplo.com", "ns2.exemplo.com"],
    "SOA": []
  },
  "whois_data": {
    "registrar": "Registrar Example",
    "creation_date": "2020-01-01",
    "expiration_date": "2025-01-01",
    "name_servers": ["ns1.exemplo.com", "ns2.exemplo.com"],
    "emails": ["admin@exemplo.com"]
  }
}
```

#### GET `/health`
Verifica status do servidor.

**Response:**
```json
{
  "status": "Scanner backend online"
}
```

## 🔧 Configuração

### Variáveis de Ambiente
```bash
PORT=5000  # Porta do servidor (padrão: 5000)
```

### Personalização

#### Adicionar novas portas para scan:
```javascript
const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3306, 3389, 5432, 6379, 27017, 8080, 8443];
```

#### Adicionar novos subdomínios:
```javascript
const wordlist = ['www', 'mail', 'ftp', 'admin', 'test', 'dev', 'staging', 'api', 'blog', 'shop', 'portal', 'secure', 'vpn', 'remote', 'backup', 'db', 'mysql', 'phpmyadmin', 'cpanel', 'webmail', 'support', 'novo-subdominio'];
```

#### Adicionar novos payloads de teste:
```javascript
const sqlPayloads = ["'", "' OR '1'='1", "' UNION SELECT 1,2,3--", "'; DROP TABLE users--", "novo-payload"];
```

## 📊 Comparação Python vs JavaScript

| Funcionalidade | Python | JavaScript | Status |
|----------------|--------|------------|--------|
| Port Scanning | ✅ socket | ✅ net.Socket | ✅ Igual |
| Subdomain Enum | ✅ socket.gethostbyname | ✅ dns.lookup | ✅ Igual |
| SSL Analysis | ✅ ssl module | ✅ https module | ✅ Igual |
| DNS Enum | ✅ dns.resolver | ✅ dns.promises | ✅ Igual |
| WHOIS | ✅ python-whois | ✅ API pública | ✅ Similar |
| Web Vuln Scan | ✅ requests | ✅ axios | ✅ Igual |
| Tech Detection | ✅ requests | ✅ axios | ✅ Igual |
| Threading | ✅ threading | ✅ Promise.allSettled | ✅ Melhor |

## 🚀 Vantagens da Versão JavaScript

1. **Performance**: Promise.allSettled é mais eficiente que threading
2. **Ecosystem**: Melhor integração com frontend JavaScript
3. **Deploy**: Mais fácil de deployar em plataformas como Vercel, Heroku
4. **Manutenção**: Código mais moderno e legível
5. **Dependências**: Menos dependências externas

## 🔒 Segurança

- Timeouts configurados para evitar DoS
- Rate limiting recomendado para produção
- Logs detalhados para auditoria
- Validação de entrada rigorosa

## 📝 Logs

O scanner gera logs detalhados:
```
[+] Starting scan for: https://exemplo.com
[+] Scanning ports on exemplo.com
[+] Port 80 open (http)
[+] Port 443 open (https)
[+] Enumerating subdomains for exemplo.com
[+] Found subdomain: www.exemplo.com
[+] Analyzing SSL/TLS for exemplo.com
[+] DNS enumeration for exemplo.com
[+] WHOIS lookup for exemplo.com
[+] Web vulnerability scanning for https://exemplo.com
[!] SQL Injection found: id
[+] Technology detection for https://exemplo.com
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## ⚡ Suporte

Para suporte técnico ou dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação
- Verifique os logs de erro

## 🎯 **NOVO: Sistema de Detecção de Aplicações Específicas**

### Funcionalidades Avançadas
- **Detecção de Discord**: Processos, portas (6463-6465) e caminhos de instalação
- **Detecção de Radmin**: RServer3.exe, porta 4899/4900
- **Detecção de TeamViewer**: Processos e porta 5938
- **Detecção de AnyDesk**: Processo e porta 7070
- **Detecção de Chrome Remote Desktop**: remoting_host.exe
- **Detecção de Steam**: Processos e portas 27015/27036

### Arquivos do Sistema
```
app-detector.js          # Módulo principal de detecção
app-scanner-backend.js   # Backend Express da API
app-scanner.html         # Interface web moderna
package-app-scanner.json # Dependências específicas
```

### Como Usar o App Scanner

#### 1. Instalar dependências
```bash
npm install --save express cors
```

#### 2. Iniciar o backend
```bash
node app-scanner-backend.js
# Ou com auto-reload:
npx nodemon app-scanner-backend.js
```

#### 3. Abrir interface
Abra `app-scanner.html` no navegador

### Endpoints da API

#### POST `/detect-apps`
Detecta todas as aplicações suportadas

**Response:**
```json
{
  "success": true,
  "timestamp": 1703123456789,
  "detected_apps": [
    {
      "name": "Discord",
      "detected": true,
      "running": true,
      "installed": true,
      "open_ports": [6463],
      "processes": ["Discord.exe"],
      "paths": ["%APPDATA%\\Discord"]
    }
  ]
}
```

#### GET `/system-info`
Informações detalhadas do sistema

#### GET `/network-scan`
Dispositivos na rede local

#### POST `/detect-app/:appName`
Detecta aplicação específica

#### GET `/supported-apps`
Lista todas as aplicações suportadas

### Aplicações Detectadas

| Aplicação | Processos | Portas | Status |
|-----------|-----------|--------|---------|
| Discord | Discord.exe, DiscordCanary.exe | 6463-6465 | ✅ |
| Radmin | RServer3.exe, Radmin.exe | 4899-4900 | ✅ |
| TeamViewer | TeamViewer.exe | 5938 | ✅ |
| AnyDesk | AnyDesk.exe | 7070 | ✅ |
| Chrome RDP | remoting_host.exe | 22 | ✅ |
| Steam | Steam.exe | 27015, 27036 | ✅ |

### Métodos de Detecção

1. **Processos Ativos**: Verifica se o processo está rodando
2. **Portas Abertas**: Detecta portas específicas em uso
3. **Caminhos de Instalação**: Verifica diretórios de instalação
4. **Combinação**: Usa todos os métodos para máxima precisão

### Interface Web

- **Design Futurístico**: Tema cyberpunk com gradientes neon
- **Scan em Tempo Real**: Resultados instantâneos
- **Informações do Sistema**: CPU, memória, uptime
- **Scan de Rede**: Dispositivos conectados
- **Status Visual**: Indicadores coloridos (verde/amarelo/vermelho)

### Segurança e Ética

⚠️ **IMPORTANTE**: Este sistema deve ser usado apenas em:
- Seus próprios dispositivos
- Sistemas com autorização explícita
- Ambientes de teste controlados
- Auditoria de segurança autorizada

### Performance

- **Scan Rápido**: Menos de 3 segundos para todas as aplicações
- **Baixo Impacto**: Uso mínimo de CPU e memória
- **Cross-Platform**: Funciona em Windows, Linux e macOS
- **API RESTful**: Fácil integração com outros sistemas

---

**⚠️ Lembre-se: Use apenas em sistemas autorizados!**
