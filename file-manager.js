// 📁 GUNIC Drive - File Manager
class FileManager {
    constructor() {
        this.edgedbConfig = {
            instance: "vercel-AQvDofjRD7bI05OPMj9Xoxtw/gunicbase",
            secretKey: "nbwt1_eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJlZGIuZC5hbGwiOnRydWUsImVkYi5pIjpbInZlcmNlbC1BUXZEb2ZqUkQ3YkkwNU9QTWo5WG94dHcvZ3VuaWNiYXNlIl0sImVkYi5yLmFsbCI6dHJ1ZSwiaWF0IjoxNzUxODk5MzM4LCJpc3MiOiJhd3MuZWRnZWRiLmNsb3VkIiwianRpIjoibE1oSC1sdEFFZkNwU2hmZFFVN3ZxdyIsInN1YiI6ImxIS3Q5RnRBRWZDZ1k3ZUoxR1d4ZHcifQ.8BFi-bIB3oEDVg3cjp8MSvaB9QgLsPnBaihUxCfs1_ydBcQmjlcPUEUJ_ZmKOR-Eegk2ophPqsts24ot5bI_UQ"
        };
        
        this.files = [];
        this.totalSize = 0;
        this.maxSize = 1024 * 1024 * 1024; // 1GB
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFiles();
        console.log('📁 GUNIC Drive inicializado');
    }

    setupEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            this.handleFiles(files);
        });

        // File input
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFiles(files);
        });
    }

    async handleFiles(files) {
        if (files.length === 0) return;

        console.log('📤 Enviando arquivos:', files.length);
        
        for (let file of files) {
            if (this.totalSize + file.size > this.maxSize) {
                alert('Espaço insuficiente! Limite de 1GB atingido.');
                break;
            }
            
            await this.uploadFile(file);
        }
        
        this.loadFiles();
    }

    async uploadFile(file) {
        const progressBar = document.getElementById('uploadProgress');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        progressBar.style.display = 'block';
        progressText.textContent = `Enviando ${file.name}...`;
        
        try {
            // Simular progresso
            for (let i = 0; i <= 100; i += 10) {
                progressFill.style.width = i + '%';
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Converter arquivo para base64
            const base64 = await this.fileToBase64(file);
            
            // Salvar no EdgeDB (simulado - usando localStorage por enquanto)
            const fileData = {
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size,
                type: file.type,
                data: base64,
                uploadDate: new Date().toISOString(),
                extension: this.getFileExtension(file.name)
            };
            
            // Salvar localmente (substituir por EdgeDB depois)
            this.saveToStorage(fileData);
            
            progressText.textContent = `${file.name} enviado com sucesso!`;
            
            setTimeout(() => {
                progressBar.style.display = 'none';
                progressFill.style.width = '0%';
            }, 1000);
            
        } catch (error) {
            console.error('Erro no upload:', error);
            progressText.textContent = 'Erro no upload!';
            setTimeout(() => {
                progressBar.style.display = 'none';
            }, 2000);
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    getFileIcon(extension) {
        const icons = {
            'rar': '🗜️',
            'zip': '🗜️',
            '7z': '🗜️',
            'pdf': '📄',
            'doc': '📝',
            'docx': '📝',
            'txt': '📝',
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'png': '🖼️',
            'gif': '🖼️',
            'mp4': '🎬',
            'avi': '🎬',
            'mp3': '🎵',
            'wav': '🎵',
            'exe': '⚙️',
            'msi': '⚙️',
            'default': '📁'
        };
        
        return icons[extension] || icons.default;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    saveToStorage(fileData) {
        let files = JSON.parse(localStorage.getItem('gunicDriveFiles') || '[]');
        files.push(fileData);
        localStorage.setItem('gunicDriveFiles', JSON.stringify(files));
    }

    loadFiles() {
        // Carregar do localStorage (substituir por EdgeDB depois)
        this.files = JSON.parse(localStorage.getItem('gunicDriveFiles') || '[]');
        this.calculateTotalSize();
        this.renderFiles();
        this.updateStats();
    }

    calculateTotalSize() {
        this.totalSize = this.files.reduce((total, file) => total + file.size, 0);
    }

    updateStats() {
        document.getElementById('totalFiles').textContent = this.files.length;
        document.getElementById('totalSize').textContent = this.formatFileSize(this.totalSize);
    }

    renderFiles() {
        const filesGrid = document.getElementById('filesGrid');
        filesGrid.innerHTML = '';

        if (this.files.length === 0) {
            filesGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: var(--text-gray); padding: 40px;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">📂</div>
                    <div>Nenhum arquivo encontrado</div>
                    <div style="font-size: 0.9rem; margin-top: 10px;">Faça upload de seus primeiros arquivos!</div>
                </div>
            `;
            return;
        }

        this.files.forEach(file => {
            const fileCard = document.createElement('div');
            fileCard.className = 'file-card';
            fileCard.innerHTML = `
                <div class="file-icon">${this.getFileIcon(file.extension)}</div>
                <div class="file-name">${file.name}</div>
                <div class="file-size">${this.formatFileSize(file.size)}</div>
                <div class="file-date">${this.formatDate(file.uploadDate)}</div>
                <div class="file-actions">
                    <button class="action-btn" onclick="fileManager.downloadFile(${file.id})">
                        📥 Baixar
                    </button>
                    <button class="action-btn delete-btn" onclick="fileManager.deleteFile(${file.id})">
                        🗑️ Excluir
                    </button>
                </div>
            `;
            filesGrid.appendChild(fileCard);
        });
    }

    downloadFile(fileId) {
        const file = this.files.find(f => f.id === fileId);
        if (!file) return;

        try {
            // Criar link de download
            const link = document.createElement('a');
            link.href = file.data;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('📥 Download iniciado:', file.name);
        } catch (error) {
            console.error('Erro no download:', error);
            alert('Erro ao baixar arquivo!');
        }
    }

    deleteFile(fileId) {
        const file = this.files.find(f => f.id === fileId);
        if (!file) return;

        if (confirm(`Tem certeza que deseja excluir "${file.name}"?`)) {
            // Remover do localStorage
            this.files = this.files.filter(f => f.id !== fileId);
            localStorage.setItem('gunicDriveFiles', JSON.stringify(this.files));
            
            // Atualizar interface
            this.loadFiles();
            
            console.log('🗑️ Arquivo excluído:', file.name);
        }
    }

    // Método para integrar com EdgeDB (implementar depois)
    async saveToEdgeDB(fileData) {
        try {
            const response = await fetch('/api/files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.edgedbConfig.secretKey}`
                },
                body: JSON.stringify({
                    query: `
                        INSERT File {
                            name := <str>$name,
                            size := <int64>$size,
                            type := <str>$type,
                            data := <str>$data,
                            extension := <str>$extension
                        }
                    `,
                    variables: {
                        name: fileData.name,
                        size: fileData.size,
                        type: fileData.type,
                        data: fileData.data,
                        extension: fileData.extension
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error('Erro ao salvar no EdgeDB');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro EdgeDB:', error);
            throw error;
        }
    }

    async loadFromEdgeDB() {
        try {
            const response = await fetch('/api/files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.edgedbConfig.secretKey}`
                },
                body: JSON.stringify({
                    query: `
                        SELECT File {
                            id,
                            name,
                            size,
                            type,
                            data,
                            extension,
                            created_at
                        }
                    `
                })
            });
            
            if (!response.ok) {
                throw new Error('Erro ao carregar do EdgeDB');
            }
            
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Erro EdgeDB:', error);
            return [];
        }
    }
}

// Instância global
const fileManager = new FileManager();

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('📁 GUNIC Drive Interface carregada');
});