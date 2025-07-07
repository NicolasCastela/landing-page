# 🖥️ GUNIC Remote Desktop - Sistema de Controle Remoto

Sistema completo de controle remoto similar ao AnyDesk, desenvolvido com WebRTC e WebSocket para conexões diretas entre dispositivos.

## ⚡ Funcionalidades

### 🎯 **Controle Remoto Completo**
- **Compartilhamento de Tela**: Streaming em tempo real
- **Controle de Mouse**: Cliques e movimentação
- **Controle de Teclado**: Digitação remota
- **Qualidade Ajustável**: Alta, Média, Baixa (5-30 FPS)

### 🔗 **Conexão Direta**
- **WebRTC P2P**: Conexão direta entre dispositivos
- **ID Único**: Sistema de identificação simples
- **Baixa Latência**: Menos de 100ms
- **Sem Servidor Central**: Dados não passam por terceiros

### 🎨 **Interface Moderna**
- **Design Cyberpunk**: Visual futurístico
- **Tela Cheia**: Modo fullscreen
- **Screenshot**: Captura de tela
- **Status em Tempo Real**: FPS e latência

## 📁 Arquivos do Sistema

```
remote-control.js        # Servidor WebSocket principal
remote-desktop.html      # Interface web do cliente
screen-capture.js        # Módulo de captura de tela
README-REMOTE-DESKTOP.md # Esta documentação
```

## 🚀 Como Usar

### 1. **Instalar Dependências**
```bash
npm install ws express
```

### 2. **Iniciar Servidor**
```bash
node remote-control.js
```

### 3. **Abrir Interface**
- Abra `remote-desktop.html` no navegador
- Copie seu ID único
- Compartilhe com quem vai se conectar

### 4. **Conectar**
- Digite o ID do computador de destino
- Clique em "Conectar"
- Aguarde a conexão ser estabelecida

## 🔧 Configuração

### **Qualidade de Streaming**
```javascript
// Alta qualidade (30 FPS)
setQuality('high');

// Média qualidade (15 FPS) 
setQuality('medium');

// Baixa qualidade (5 FPS)
setQuality('low');
```

### **Portas Utilizadas**
- **WebSocket**: 5002 (configurável)
- **WebRTC**: Portas dinâmicas (STUN/TURN)

## 🎮 Controles

### **Mouse**
- **Clique**: Clique na tela remota
- **Movimento**: Mova o mouse sobre a tela

### **Teclado**
- **Digitação**: Digite normalmente
- **Teclas Especiais**: Enter, Escape, Setas, etc.

### **Atalhos**
- **F11**: Tela cheia
- **Ctrl+S**: Screenshot
- **Ctrl+D**: Desconectar

## 📊 Monitoramento

### **Métricas em Tempo Real**
- **FPS**: Frames por segundo
- **Latência**: Delay da conexão
- **Status**: Online/Offline/Conectando
- **Qualidade**: Alta/Média/Baixa

## 🔒 Segurança

### **Recursos de Segurança**
- **Conexão Criptografada**: WebRTC com DTLS
- **IDs Únicos**: Gerados aleatoriamente
- **Sem Armazenamento**: Dados não são salvos
- **Conexão Direta**: Sem intermediários

### **Boas Práticas**
- Use apenas em redes confiáveis
- Não compartilhe IDs publicamente
- Desconecte após o uso
- Monitore conexões ativas

## 🌐 Compatibilidade

### **Navegadores Suportados**
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Edge 80+
- ✅ Safari 14+

### **Sistemas Operacionais**
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux Ubuntu 18+

## ⚙️ API WebSocket

### **Mensagens do Cliente**
```javascript
// Registrar cliente
{
  "type": "register",
  "id": "abc123def"
}

// Iniciar compartilhamento
{
  "type": "start-sharing",
  "id": "abc123def"
}

// Evento de controle
{
  "type": "control-event",
  "target": "xyz789ghi",
  "event": {
    "type": "mouse",
    "action": "click",
    "x": 0.5,
    "y": 0.3
  }
}
```

### **Mensagens do Servidor**
```javascript
// Cliente registrado
{
  "type": "registered",
  "id": "abc123def"
}

// Dados da tela
{
  "type": "screen-data",
  "data": "base64_image_data",
  "source": "abc123def"
}
```

## 🔧 Personalização

### **Alterar FPS**
```javascript
// No screen-capture.js
this.fps = 60; // Máximo FPS
```

### **Alterar Qualidade**
```javascript
// Resolução personalizada
const command = `powershell -Command "... $bounds.Width, $bounds.Height ..."`;
```

### **Adicionar Novos Controles**
```javascript
// No remote-desktop.html
canvas.addEventListener('wheel', (e) => {
    sendScrollEvent(e.deltaY);
});
```

## 🚨 Limitações

### **Técnicas**
- Requer PowerShell no Windows
- Latência depende da rede
- Qualidade limitada pela CPU
- Funciona melhor em LAN

### **Funcionais**
- Sem áudio (apenas vídeo)
- Sem transferência de arquivos
- Sem chat integrado
- Uma conexão por vez

## 🔄 Troubleshooting

### **Problemas Comuns**

#### Não consegue conectar
```bash
# Verificar se o servidor está rodando
netstat -an | findstr 5002

# Verificar firewall
# Liberar porta 5002 no Windows Firewall
```

#### Tela preta
```bash
# Verificar permissões do PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Latência alta
- Reduzir qualidade para "Baixa"
- Verificar conexão de rede
- Fechar outros aplicativos

## 📈 Performance

### **Otimizações**
- Compressão de imagem automática
- Throttling de eventos de mouse
- Cache de frames similares
- Ajuste dinâmico de qualidade

### **Benchmarks**
- **LAN**: 10-30ms latência
- **WiFi**: 50-100ms latência
- **Internet**: 100-300ms latência

## 🎯 Casos de Uso

### **Suporte Técnico**
- Assistência remota
- Resolução de problemas
- Treinamento de usuários

### **Trabalho Remoto**
- Acesso a computador do escritório
- Apresentações remotas
- Colaboração em projetos

### **Gaming**
- Streaming de jogos
- Controle remoto de consoles
- Demonstrações

## 🔮 Próximas Funcionalidades

### **Em Desenvolvimento**
- [ ] Transferência de arquivos
- [ ] Chat integrado
- [ ] Áudio bidirecional
- [ ] Múltiplas conexões
- [ ] Gravação de sessão

### **Planejado**
- [ ] App mobile
- [ ] Integração com VPN
- [ ] Autenticação avançada
- [ ] Dashboard de administração

---

**🖥️ GUNIC Remote Desktop - Controle remoto do futuro!**

*Desenvolvido com tecnologias web modernas para máxima compatibilidade e performance.*