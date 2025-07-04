// 🔒 AI Configuration - Keys carregadas do env-config.js
let AI_CONFIG = {
    // Groq API (Gratuita - 30 req/min)
    GROQ: {
        apiKey: '', // Carregado automaticamente
        baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'llama-3.1-8b-instant',
        maxTokens: 1000
    },
    
    // Hugging Face (Alternativa gratuita)
    HUGGINGFACE: {
        apiKey: '', // Carregado automaticamente
        baseUrl: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        model: 'microsoft/DialoGPT-medium'
    },
    
    // OpenAI (Se disponível)
    OPENAI: {
        apiKey: '', // Carregado automaticamente
        baseUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        maxTokens: 1000
    }
};

// Carregar configurações
function loadAIConfig() {
    // Carregar API keys
    AI_CONFIG.GROQ.apiKey = getEnv('GROQ_API_KEY');
    AI_CONFIG.HUGGINGFACE.apiKey = getEnv('HUGGINGFACE_API_KEY');
    AI_CONFIG.OPENAI.apiKey = getEnv('OPENAI_API_KEY');
    
    console.log('🔒 Configuração de IA carregada');
    console.log('📊 APIs disponíveis:', {
        Groq: !!AI_CONFIG.GROQ.apiKey,
        HuggingFace: !!AI_CONFIG.HUGGINGFACE.apiKey,
        OpenAI: !!AI_CONFIG.OPENAI.apiKey
    });
}

// Função para fazer chamadas à API da IA
async function callAI(message, context = '') {
    const bestAPI = getBestAPI();
    
    if (!bestAPI) {
        console.warn('⚠️ Nenhuma API configurada, usando fallback');
        return generateAIResponse(message);
    }
    
    const config = AI_CONFIG[bestAPI];
    
    try {
        const response = await fetch(config.baseUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: 'system',
                        content: `Você é a IA assistente da GUNIC Company, uma empresa de tecnologia brasileira. 
                        Seja prestativo, profissional e responda em português. 
                        Foque em: IA, desenvolvimento, tecnologia, inovação.
                        ${context}`
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: config.maxTokens || 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`${bestAPI} API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error(`${bestAPI} API Error:`, error);
        // Fallback para respostas simuladas
        return generateAIResponse(message);
    }
}

// Função para análise de texto com IA real
async function analyzeTextWithAI(text) {
    const prompt = `Analise este texto e retorne um JSON com:
    - sentiment: "positivo", "negativo" ou "neutro"
    - keywords: array com 5 palavras-chave principais
    - summary: resumo em 1 frase
    - score: nota de 0-100 para qualidade do texto
    
    Texto: "${text}"
    
    Responda APENAS com o JSON válido.`;
    
    try {
        const response = await callAI(prompt);
        return JSON.parse(response);
    } catch (error) {
        // Fallback
        return {
            sentiment: "neutro",
            keywords: ["análise", "texto", "conteúdo"],
            summary: "Texto analisado com sucesso.",
            score: 75
        };
    }
}

// Função para review de código com IA real
async function reviewCodeWithAI(code, language) {
    const prompt = `Analise este código ${language} e retorne um JSON com:
    - score: nota de 0-100
    - suggestions: array com 3-5 sugestões de melhoria
    - complexity: número de 1-10
    - security: array com possíveis problemas de segurança
    
    Código:
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Responda APENAS com o JSON válido.`;
    
    try {
        const response = await callAI(prompt);
        return JSON.parse(response);
    } catch (error) {
        // Fallback
        return {
            score: 80,
            suggestions: ["Adicionar comentários", "Melhorar nomes de variáveis", "Otimizar performance"],
            complexity: 6,
            security: ["Validar entradas do usuário"]
        };
    }
}

// Função para gerar código com IA real
async function generateCodeWithAI(prompt, language) {
    const systemPrompt = `Você é um expert em programação. Gere código ${language} limpo e funcional baseado na descrição.
    Inclua comentários explicativos e siga as melhores práticas.
    Responda APENAS com o código, sem explicações adicionais.`;
    
    try {
        const response = await callAI(`${prompt}\n\nLinguagem: ${language}`, systemPrompt);
        return response;
    } catch (error) {
        return simulateCodeGeneration(prompt, language);
    }
}

// Verificar se a API está configurada
function isAIConfigured() {
    return (AI_CONFIG.GROQ.apiKey && AI_CONFIG.GROQ.apiKey !== 'SUA_GROQ_API_KEY_AQUI') ||
           (AI_CONFIG.HUGGINGFACE.apiKey && AI_CONFIG.HUGGINGFACE.apiKey !== 'SUA_HUGGINGFACE_API_KEY_AQUI') ||
           (AI_CONFIG.OPENAI.apiKey && AI_CONFIG.OPENAI.apiKey !== 'SUA_OPENAI_API_KEY_AQUI');
}

// Obter a melhor API disponível
function getBestAPI() {
    if (AI_CONFIG.GROQ.apiKey) return 'GROQ';
    if (AI_CONFIG.OPENAI.apiKey) return 'OPENAI';
    if (AI_CONFIG.HUGGINGFACE.apiKey) return 'HUGGINGFACE';
    return null;
}

// Mostrar status da IA
function showAIStatus() {
    const bestAPI = getBestAPI();
    const status = bestAPI ? 
        `🟢 IA Real Conectada (${bestAPI})` : 
        '🟡 IA Simulada (Configure .env)';
    
    console.log(`🤖 Status da IA: ${status}`);
    
    if (!isAIConfigured()) {
        console.log(`
📋 Para ativar IA real:
1. Edite env-config.js com suas API keys
2. Groq (recomendado): https://console.groq.com
3. Hugging Face: https://huggingface.co
4. Recarregue a página
        `);
    }
}