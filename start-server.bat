@echo off
echo 🚀 Iniciando GUNIC Meet Server...
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo 📥 Baixe em: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se as dependências estão instaladas
if not exist node_modules (
    echo 📦 Instalando dependências...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
)

echo ✅ Dependências OK
echo 🚀 Iniciando servidor WebSocket...
echo.
echo 📹 Acesse: http://localhost:8080
echo 🔗 WebSocket: ws://localhost:8080
echo.
echo ⚠️  Para parar o servidor, pressione Ctrl+C
echo.

REM Iniciar servidor
node websocket-server.js

pause