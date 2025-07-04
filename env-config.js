// 🔒 Configuração de Ambiente Segura
// Substitua pelas suas API keys aqui

const ENV_CONFIG = {
    // 🔒 SUBSTITUA PELAS SUAS API KEYS AQUI
    // Groq API (Recomendado - 30 req/min grátis)
    GROQ_API_KEY: 'SUA_GROQ_API_KEY_AQUI',
    
    // Hugging Face API (Alternativa)
    HUGGINGFACE_API_KEY: 'SUA_HUGGINGFACE_API_KEY_AQUI',
    
    // OpenAI API (Se tiver)
    OPENAI_API_KEY: 'SUA_OPENAI_API_KEY_AQUI',
    
    // Together AI (Se tiver)
    TOGETHER_API_KEY: 'SUA_TOGETHER_API_KEY_AQUI'
};

// Função para obter variável
function getEnv(key, defaultValue = '') {
    return ENV_CONFIG[key] || defaultValue;
}

// Verificar se env existe
function hasEnv(key) {
    return key in ENV_CONFIG && ENV_CONFIG[key] !== '';
}

console.log('🔒 Configuração de ambiente carregada');