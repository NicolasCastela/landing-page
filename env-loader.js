// 🔒 Carregador de Variáveis de Ambiente
class EnvLoader {
    constructor() {
        this.env = {};
        this.loadEnv();
    }

    // Carrega variáveis do arquivo .env
    async loadEnv() {
        try {
            const response = await fetch('.env');
            if (response.ok) {
                const envText = await response.text();
                this.parseEnv(envText);
            } else {
                console.warn('📄 Arquivo .env não encontrado, usando configuração padrão');
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar .env:', error.message);
        }
    }

    // Parse do conteúdo do .env
    parseEnv(envText) {
        const lines = envText.split('\n');
        lines.forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#') && line.includes('=')) {
                const [key, ...valueParts] = line.split('=');
                const value = valueParts.join('=').trim();
                this.env[key.trim()] = value;
            }
        });
    }

    // Obter variável de ambiente
    get(key, defaultValue = '') {
        return this.env[key] || defaultValue;
    }

    // Verificar se variável existe
    has(key) {
        return key in this.env && this.env[key] !== '';
    }

    // Listar todas as variáveis (sem mostrar valores)
    list() {
        return Object.keys(this.env);
    }
}

// Instância global
const envLoader = new EnvLoader();

// Aguardar carregamento das variáveis
async function waitForEnv() {
    // Aguarda um pouco para o .env carregar
    await new Promise(resolve => setTimeout(resolve, 100));
    return envLoader;
}

// Função helper para obter variáveis
function getEnv(key, defaultValue = '') {
    return envLoader.get(key, defaultValue);
}

// Verificar se env está carregado
function isEnvLoaded() {
    return envLoader.list().length > 0;
}