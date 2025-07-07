const express = require('express');
const fs = require('fs');
const path = require('path');

class BlogCMS {
    constructor() {
        this.app = express();
        this.blogDir = path.join(__dirname, 'blog-data');
        this.postsFile = path.join(this.blogDir, 'posts.json');
        
        this.ensureDirectories();
        this.setupMiddleware();
        this.setupRoutes();
    }

    ensureDirectories() {
        if (!fs.existsSync(this.blogDir)) {
            fs.mkdirSync(this.blogDir);
        }
        if (!fs.existsSync(this.postsFile)) {
            fs.writeFileSync(this.postsFile, JSON.stringify([]));
        }
    }

    setupMiddleware() {
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
        this.app.use(express.json());
        this.app.use(express.static('.'));
    }

    setupRoutes() {
        // Listar posts
        this.app.get('/api/blog/posts', (req, res) => {
            const posts = this.getPosts();
            res.json(posts);
        });

        // Criar post
        this.app.post('/api/blog/posts', (req, res) => {
            const { title, content, author, tags, layout } = req.body;
            const post = {
                id: Date.now().toString(),
                title,
                content,
                author: author || 'GUNIC Team',
                tags: tags || [],
                layout: layout || 'default',
                createdAt: new Date().toISOString(),
                slug: this.generateSlug(title)
            };

            const posts = this.getPosts();
            posts.unshift(post);
            this.savePosts(posts);
            this.generatePostPage(post);

            res.json({ success: true, post });
        });

        // Atualizar post
        this.app.put('/api/blog/posts/:id', (req, res) => {
            const { id } = req.params;
            const updates = req.body;
            
            const posts = this.getPosts();
            const index = posts.findIndex(p => p.id === id);
            
            if (index !== -1) {
                posts[index] = { ...posts[index], ...updates };
                this.savePosts(posts);
                this.generatePostPage(posts[index]);
                res.json({ success: true, post: posts[index] });
            } else {
                res.status(404).json({ error: 'Post não encontrado' });
            }
        });

        // Deletar post
        this.app.delete('/api/blog/posts/:id', (req, res) => {
            const { id } = req.params;
            const posts = this.getPosts();
            const filtered = posts.filter(p => p.id !== id);
            
            if (filtered.length !== posts.length) {
                this.savePosts(filtered);
                res.json({ success: true });
            } else {
                res.status(404).json({ error: 'Post não encontrado' });
            }
        });
    }

    getPosts() {
        try {
            return JSON.parse(fs.readFileSync(this.postsFile, 'utf8'));
        } catch {
            return [];
        }
    }

    savePosts(posts) {
        fs.writeFileSync(this.postsFile, JSON.stringify(posts, null, 2));
    }

    generateSlug(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    generatePostPage(post) {
        const template = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - GUNIC Blog</title>
    <link rel="stylesheet" href="../style.css">
    <style>
        .blog-post {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 15px;
            margin-top: 100px;
        }
        .post-header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 1px solid #333;
            padding-bottom: 20px;
        }
        .post-title {
            font-size: 2.5rem;
            background: linear-gradient(45deg, #00ffff, #ff0080);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .post-meta {
            color: #a0a0a0;
            font-size: 0.9rem;
        }
        .post-content {
            line-height: 1.8;
            font-size: 1.1rem;
            color: #ffffff;
        }
        .post-tags {
            margin-top: 30px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .tag {
            background: linear-gradient(45deg, #7c3aed, #00ffff);
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.8rem;
        }
        .back-btn {
            position: fixed;
            top: 20px;
            left: 20px;
            background: linear-gradient(45deg, #7c3aed, #00ffff);
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <a href="../index.html" class="back-btn">← Voltar</a>
    
    <div class="blog-post">
        <div class="post-header">
            <h1 class="post-title">${post.title}</h1>
            <div class="post-meta">
                Por ${post.author} • ${new Date(post.createdAt).toLocaleDateString('pt-BR')}
            </div>
        </div>
        
        <div class="post-content">
            ${post.content.replace(/\n/g, '<br>')}
        </div>
        
        ${post.tags.length > 0 ? `
        <div class="post-tags">
            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        ` : ''}
    </div>
</body>
</html>`;

        const filename = `blog-${post.slug}.html`;
        fs.writeFileSync(path.join(__dirname, filename), template);
    }

    start(port = 5005) {
        this.app.listen(port, () => {
            console.log(`📝 Blog CMS running on port ${port}`);
        });
    }
}

const cms = new BlogCMS();
cms.start();

module.exports = BlogCMS;