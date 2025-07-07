const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class ScreenCapture {
    constructor() {
        this.isCapturing = false;
        this.quality = 'medium';
        this.fps = 10;
        this.tempDir = path.join(__dirname, 'temp');
        
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir);
        }
    }

    async captureScreen() {
        return new Promise((resolve, reject) => {
            const timestamp = Date.now();
            const filename = path.join(this.tempDir, `screen_${timestamp}.png`);
            
            // Windows screenshot usando PowerShell
            const command = `powershell -Command "Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing; $bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds; $bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height; $graphics = [System.Drawing.Graphics]::FromImage($bitmap); $graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size); $bitmap.Save('${filename}', [System.Drawing.Imaging.ImageFormat]::Png); $graphics.Dispose(); $bitmap.Dispose()"`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                
                // Converter para base64
                try {
                    const imageBuffer = fs.readFileSync(filename);
                    const base64 = imageBuffer.toString('base64');
                    
                    // Limpar arquivo temporário
                    fs.unlinkSync(filename);
                    
                    resolve(base64);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    async startStreaming(callback) {
        this.isCapturing = true;
        
        const capture = async () => {
            if (!this.isCapturing) return;
            
            try {
                const screenData = await this.captureScreen();
                callback(screenData);
            } catch (error) {
                console.error('Erro na captura:', error);
            }
            
            setTimeout(capture, 1000 / this.fps);
        };
        
        capture();
    }

    stopStreaming() {
        this.isCapturing = false;
    }

    setQuality(quality) {
        this.quality = quality;
        switch (quality) {
            case 'high':
                this.fps = 30;
                break;
            case 'medium':
                this.fps = 15;
                break;
            case 'low':
                this.fps = 5;
                break;
        }
    }

    simulateMouseClick(x, y) {
        // Converter coordenadas relativas para absolutas
        const command = `powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${Math.floor(x * 1920)}, ${Math.floor(y * 1080)}); Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Mouse { [DllImport(\\"user32.dll\\")] public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, UIntPtr dwExtraInfo); }'; [Mouse]::mouse_event(0x02, 0, 0, 0, 0); [Mouse]::mouse_event(0x04, 0, 0, 0, 0)"`;
        
        exec(command, (error) => {
            if (error) console.error('Erro no clique:', error);
        });
    }

    simulateKeyPress(key, action) {
        let keyCode = this.getKeyCode(key);
        if (!keyCode) return;
        
        const actionFlag = action === 'down' ? '0x0000' : '0x0002';
        const command = `powershell -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Keyboard { [DllImport(\\"user32.dll\\")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo); }'; [Keyboard]::keybd_event(${keyCode}, 0, ${actionFlag}, 0)"`;
        
        exec(command, (error) => {
            if (error) console.error('Erro na tecla:', error);
        });
    }

    getKeyCode(key) {
        const keyCodes = {
            'Enter': 13, 'Escape': 27, 'Space': 32,
            'ArrowLeft': 37, 'ArrowUp': 38, 'ArrowRight': 39, 'ArrowDown': 40,
            'Delete': 46, 'Backspace': 8, 'Tab': 9,
            'a': 65, 'b': 66, 'c': 67, 'd': 68, 'e': 69, 'f': 70, 'g': 71,
            'h': 72, 'i': 73, 'j': 74, 'k': 75, 'l': 76, 'm': 77, 'n': 78,
            'o': 79, 'p': 80, 'q': 81, 'r': 82, 's': 83, 't': 84, 'u': 85,
            'v': 86, 'w': 87, 'x': 88, 'y': 89, 'z': 90,
            '0': 48, '1': 49, '2': 50, '3': 51, '4': 52,
            '5': 53, '6': 54, '7': 55, '8': 56, '9': 57
        };
        
        return keyCodes[key] || keyCodes[key.toLowerCase()];
    }
}

module.exports = ScreenCapture;