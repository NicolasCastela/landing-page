# 🤖 Guia de Configuração da IA

## 🆓 **APIs Gratuitas Recomendadas**

### 1. **🥇 Groq (RECOMENDADO)**
- **Velocidade**: Ultra rápida (mais rápida que GPT-4)
- **Limite**: 30 requisições/minuto GRÁTIS
- **Modelos**: Llama 3.1, Mixtral, Gemma
- **Qualidade**: Excelente

#### Como configurar Groq:
1. Acesse: https://console.groq.com
2. Crie conta gratuita (só email)
3. Vá em "API Keys"
4. Clique "Create API Key"
5. Copie a key gerada

### 2. **🤗 Hugging Face**
- **Limite**: Generoso para uso pessoal
- **Modelos**: Centenas disponíveis
- **Qualidade**: Boa

#### Como configurar Hugging Face:
1. Acesse: https://huggingface.co
2. Crie conta gratuita
3. Vá em Settings > Access Tokens
4. Crie novo token
5. Copie o token

### 3. **⚡ Together AI**
- **Créditos**: $25 grátis no cadastro
- **Modelos**: Llama, Code Llama, Mixtral
- **Qualidade**: Excelente

## 🔧 **Configuração Passo a Passo**

### Passo 1: Obter API Key
Escolha uma das opções acima e obtenha sua API key.

### Passo 2: Configurar no Projeto
Abra o arquivo `ai-config.js` e substitua:

```javascript
// Para Groq (RECOMENDADO)
GROQ: {
    apiKey: 'gsk_SuaKeyAqui123...', // Cole sua key aqui
    // resto da configuração já está pronta
}
```

### Passo 3: Testar
1. Abra `index.html` no navegador
2. Clique no chatbot (ícone do robô)
3. Digite uma mensagem
4. Se aparecer "🟢 IA Real Conectada" no console = funcionando!

## 🎯 **Funcionalidades com IA Real**

### ✅ **Chatbot Inteligente**
- Conversas naturais em português
- Contexto sobre a empresa GUNIC
- Respostas personalizadas

### ✅ **Gerador de Código**
- Código real baseado em descrições
- Múltiplas linguagens
- Comentários explicativos

### ✅ **Análise de Texto**
- Análise de sentimentos precisa
- Extração de palavras-chave
- Resumos automáticos
- Score de qualidade

### ✅ **Review de Código**
- Sugestões de melhoria reais
- Análise de segurança
- Score de qualidade
- Detecção de problemas

## 🚨 **Solução de Problemas**

### Erro: "API Error: 401"
- Verifique se a API key está correta
- Confirme se copiou a key completa

### Erro: "API Error: 429"
- Limite de requisições atingido
- Aguarde alguns minutos
- Para Groq: 30 req/min

### IA não responde
- Verifique conexão com internet
- Abra console do navegador (F12)
- Veja se há erros na aba Console

### Fallback automático
Se a IA real falhar, o sistema automaticamente usa respostas simuladas.

## 💡 **Dicas de Otimização**

### Para melhor performance:
1. **Use Groq**: Mais rápida que outras APIs
2. **Mensagens curtas**: Respostas mais rápidas
3. **Cache local**: Evite repetir perguntas

### Para economizar requisições:
1. **Teste localmente**: Antes de usar muito
2. **Use fallbacks**: Sistema já configurado
3. **Monitore uso**: Acompanhe limites

## 🔒 **Segurança**

### ⚠️ **IMPORTANTE**
- **NUNCA** commite API keys no Git
- Use variáveis de ambiente em produção
- Monitore uso das keys

### Para produção:
```javascript
// Use variáveis de ambiente
apiKey: process.env.GROQ_API_KEY || 'fallback_key'
```

## 📊 **Comparação de APIs**

| API | Velocidade | Limite Grátis | Qualidade | Facilidade |
|-----|------------|---------------|-----------|------------|
| **Groq** | ⭐⭐⭐⭐⭐ | 30 req/min | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Hugging Face | ⭐⭐⭐ | Generoso | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Together AI | ⭐⭐⭐⭐ | $25 créditos | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🎉 **Resultado Final**

Com a IA configurada, você terá:
- **Chatbot real** respondendo perguntas
- **Gerador de código** funcional
- **Análise de texto** precisa
- **Review de código** profissional
- **Experiência premium** para visitantes

---

**🚀 Sua landing page agora tem IA de verdade!**