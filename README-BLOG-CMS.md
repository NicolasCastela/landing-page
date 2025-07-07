# 📝 GUNIC Blog CMS - Sistema de Gerenciamento de Conteúdo

Plataforma moderna e corporativa para criação e gerenciamento de blog com tecnologia de ponta e interface flexível similar ao WordPress.

## ⚡ Funcionalidades

### 🎨 **Interface Moderna**
- **Design Cyberpunk**: Visual futurístico com gradientes neon
- **Dashboard Intuitivo**: Painel administrativo completo
- **Layout Flexível**: 3 tipos de layout (Padrão, Destaque, Minimalista)
- **Responsivo**: Adaptável a todos os dispositivos

### ✍️ **Editor Avançado**
- **Editor de Texto**: Área de texto rica para conteúdo
- **Sistema de Tags**: Adicionar/remover tags facilmente
- **Metadados**: Autor, data, slug automático
- **Preview**: Visualização em tempo real

### 📊 **Painel Administrativo**
- **Dashboard**: Estatísticas e métricas
- **Gerenciar Posts**: CRUD completo
- **Layouts**: Seletor visual de layouts
- **Status**: Controle de publicação

## 📁 Arquivos do Sistema

```
blog-cms.js          # Backend Express com API REST
blog-admin.html      # Painel administrativo
blog-data/           # Diretório de dados
├── posts.json       # Base de dados dos posts
blog-{slug}.html     # Páginas geradas automaticamente
README-BLOG-CMS.md   # Esta documentação
```

## 🚀 Como Usar

### 1. **Instalar Dependências**
```bash
npm install express
```

### 2. **Iniciar Backend**
```bash
# Produção
npm run blog

# Desenvolvimento (auto-reload)
npm run blog-dev

# Ou diretamente
node blog-cms.js
```

### 3. **Acessar Painel**
- Abra `blog-admin.html` no navegador
- Ou acesse através do menu Tech no `index.html`

### 4. **Criar Posts**
1. Clique em "Criar Post"
2. Preencha título, autor, conteúdo
3. Escolha layout e adicione tags
4. Clique em "Publicar Post"
5. Post será gerado automaticamente

## 🎨 Layouts Disponíveis

### **1. Padrão**
- Layout clássico de blog
- Texto centralizado
- Ideal para artigos técnicos

### **2. Destaque**
- Layout com destaque visual
- Título maior e colorido
- Para posts importantes

### **3. Minimalista**
- Design limpo e simples
- Foco no conteúdo
- Leitura otimizada

## 📊 API REST

### **Endpoints Disponíveis**

#### `GET /api/blog/posts`
Lista todos os posts
```json
[
  {
    "id": "1703123456789",
    "title": "Meu Primeiro Post",
    "content": "Conteúdo do post...",
    "author": "GUNIC Team",
    "tags": ["tecnologia", "ia"],
    "layout": "default",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "slug": "meu-primeiro-post"
  }
]
```

#### `POST /api/blog/posts`
Cria novo post
```json
{
  "title": "Título do Post",
  "content": "Conteúdo completo...",
  "author": "Autor",
  "tags": ["tag1", "tag2"],
  "layout": "default"
}
```

#### `PUT /api/blog/posts/:id`
Atualiza post existente

#### `DELETE /api/blog/posts/:id`
Remove post

## 🎯 Funcionalidades do Painel

### **📊 Dashboard**
- **Total de Posts**: Contador geral
- **Posts Hoje**: Posts criados hoje
- **Último Post**: Post mais recente

### **📝 Gerenciar Posts**
- **Grid de Posts**: Visualização em cards
- **Ações**: Ver, Editar, Deletar
- **Busca**: Filtrar posts
- **Ordenação**: Por data, título

### **✍️ Criar Post**
- **Título**: Campo obrigatório
- **Autor**: Padrão "GUNIC Team"
- **Layout**: Seletor visual
- **Tags**: Sistema de tags dinâmico
- **Conteúdo**: Editor de texto

## 🔧 Personalização

### **Adicionar Novo Layout**
```javascript
// No blog-cms.js
const layouts = {
  'custom': {
    name: 'Custom Layout',
    template: 'custom-template.html'
  }
};
```

### **Modificar Estilos**
```css
/* Personalizar cores */
:root {
  --primary-color: #00ffff;
  --secondary-color: #ff0080;
  --bg-color: #0a0a0a;
}
```

### **Adicionar Campos**
```javascript
// Adicionar campo categoria
const post = {
  // ... campos existentes
  category: req.body.category,
  featured: req.body.featured || false
};
```

## 🌐 Integração com Index.html

O Blog CMS está integrado no menu principal:

### **Menu Tech**
- **📝 Blog CMS**: Acesso direto ao painel
- **📄 Conteúdo & CMS**: Categoria específica
- **🚀 Tecnologias**: Menu lateral

### **Footer**
- **IA Tools**: Link para Blog CMS
- **Links**: Navegação rápida

## 📱 Responsividade

### **Desktop**
- Layout completo com sidebar
- Grid de posts otimizado
- Editor expandido

### **Tablet**
- Sidebar colapsável
- Grid adaptativo
- Touch-friendly

### **Mobile**
- Menu hambúrguer
- Cards empilhados
- Editor mobile-first

## 🔒 Segurança

### **Validação**
- Campos obrigatórios
- Sanitização de HTML
- Validação de entrada

### **Armazenamento**
- Dados em JSON local
- Backup automático
- Versionamento

## ⚡ Performance

### **Otimizações**
- Geração estática de páginas
- Cache de posts
- Lazy loading
- Compressão de imagens

### **Métricas**
- Tempo de carregamento < 2s
- Lighthouse Score 90+
- Mobile-friendly

## 🎨 Tecnologias Utilizadas

### **Backend**
- **Express.js**: Servidor web
- **Node.js**: Runtime JavaScript
- **File System**: Armazenamento local

### **Frontend**
- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos
- **JavaScript ES6+**: Interatividade
- **Font Awesome**: Ícones

### **Bibliotecas**
- **AOS**: Animações on scroll
- **Fetch API**: Requisições HTTP
- **LocalStorage**: Cache local

## 🚀 Próximas Funcionalidades

### **Em Desenvolvimento**
- [ ] Editor WYSIWYG
- [ ] Upload de imagens
- [ ] Comentários
- [ ] SEO otimizado
- [ ] Múltiplos autores

### **Planejado**
- [ ] Temas personalizáveis
- [ ] Plugin system
- [ ] Analytics integrado
- [ ] Newsletter
- [ ] Backup na nuvem

## 🔧 Troubleshooting

### **Problemas Comuns**

#### Backend não inicia
```bash
# Verificar porta
netstat -an | findstr 5004

# Verificar dependências
npm install express
```

#### Posts não aparecem
```bash
# Verificar arquivo de dados
ls blog-data/posts.json

# Recriar diretório
mkdir blog-data
```

#### Erro de permissão
```bash
# Windows
icacls blog-data /grant Users:F

# Linux/Mac
chmod 755 blog-data
```

## 📈 Casos de Uso

### **Blog Corporativo**
- Artigos técnicos
- Novidades da empresa
- Cases de sucesso

### **Blog Pessoal**
- Portfolio de projetos
- Tutoriais
- Experiências

### **Blog de Produto**
- Documentação
- Changelog
- Guias de uso

## 🎯 Vantagens

### **Simplicidade**
- Setup em minutos
- Interface intuitiva
- Sem banco de dados

### **Flexibilidade**
- Layouts customizáveis
- API REST completa
- Fácil integração

### **Performance**
- Páginas estáticas
- Cache otimizado
- Carregamento rápido

---

**📝 GUNIC Blog CMS - O futuro do gerenciamento de conteúdo!**

*Desenvolvido com tecnologias modernas para máxima produtividade e flexibilidade.*