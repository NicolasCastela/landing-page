# 🔒 Como Configurar Variáveis de Ambiente

## 🎯 **Problema Resolvido**
Agora suas API keys ficam **seguras** no arquivo `.env` e não aparecem no código!

## 📁 **Arquivos Criados**
- `.env` - Suas API keys (NUNCA commitar)
- `.gitignore` - Protege arquivos sensíveis
- `env-loader.js` - Carrega variáveis automaticamente

## 🔧 **Como Configurar**

### 1. **Editar o arquivo `.env`**
Abra o arquivo `.env` e coloque suas API keys:

```bash
# 🔒 Suas API Keys
GROQ_API_KEY=gsk_SuaKeyAqui123...
HUGGINGFACE_API_KEY=hf_SuaKeyAqui123...
OPENAI_API_KEY=sk-SuaKeyAqui123...
```

### 2. **Obter API Keys Gratuitas**

#### **🥇 Groq (RECOMENDADO)**
1. Acesse: https://console.groq.com
2. Crie conta gratuita
3. Vá em "API Keys"
4. Clique "Create API Key"
5. Copie e cole no `.env`

#### **🤗 Hugging Face**
1. Acesse: https://huggingface.co
2. Crie conta
3. Settings → Access Tokens
4. Create new token
5. Copie e cole no `.env`

### 3. **Testar**
1. Salve o arquivo `.env`
2. Recarregue a página (F5)
3. Abra console (F12)
4. Deve aparecer: "🟢 IA Real Conectada"

## 🛡️ **Segurança**

### ✅ **O que está protegido:**
- API keys não aparecem no código
- `.env` está no `.gitignore`
- Fallback automático se falhar

### ⚠️ **IMPORTANTE:**
- **NUNCA** commite o arquivo `.env`
- **NUNCA** compartilhe suas API keys
- Use keys diferentes para produção

## 🔄 **Como Funciona**

1. **env-loader.js** lê o arquivo `.env`
2. **ai-config.js** usa as variáveis carregadas
3. **Sistema escolhe** a melhor API disponível
4. **Fallback automático** se nenhuma funcionar

## 🎯 **Vantagens**

| Antes | Depois |
|-------|--------|
| Keys no código | Keys no .env |
| Inseguro | Seguro |
| Hard-coded | Flexível |
| Uma API | Múltiplas APIs |

## 🚨 **Solução de Problemas**

### **Erro: "IA Simulada"**
- Verifique se o `.env` tem as keys
- Confirme se as keys estão corretas
- Recarregue a página

### **Erro: "Failed to fetch .env"**
- Arquivo `.env` deve estar na raiz do projeto
- Verifique se o servidor local está rodando

### **Keys não funcionam**
- Teste cada key individualmente
- Verifique limites de uso
- Confirme se a key está ativa

## 📊 **Status das APIs**

O sistema mostra no console qual API está ativa:
```javascript
🔒 Configuração de IA carregada do .env
📊 APIs disponíveis: {
  Groq: true,
  HuggingFace: false, 
  OpenAI: false
}
🤖 Status da IA: 🟢 IA Real Conectada (GROQ)
```

## 🎉 **Resultado**

Agora você tem:
- ✅ **API keys seguras**
- ✅ **Múltiplas APIs suportadas**
- ✅ **Fallback automático**
- ✅ **Fácil de configurar**
- ✅ **Pronto para produção**

---

**🔐 Suas keys estão seguras agora!**