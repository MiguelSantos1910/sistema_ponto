# ⏱️ Sistema de Ponto Desktop com Electron

Este projeto transforma um sistema de ponto feito em **HTML, CSS e JavaScript** em um aplicativo desktop (.exe) utilizando Electron.

---

## 📌 Objetivo

Permitir que um sistema web simples rode como aplicativo desktop, com suporte a:

* Registro de entrada/saída
* Funcionamento offline
* Armazenamento local
* Possível exportação de dados

---

## 🚀 Tecnologias utilizadas

* HTML5
* CSS3
* JavaScript
* Node.js
* Electron

---

## 📁 Estrutura do Projeto

```
ponto-app/
├── index.html
├── style.css
├── script.js
├── main.js
├── package.json
```

---

## ⚙️ Instalação

### 1. Instalar o Node.js

Baixe e instale:
https://nodejs.org

Verifique no terminal:

```bash
node -v
npm -v
```

---

### 2. Inicializar o projeto

Dentro da pasta do projeto:

```bash
npm init -y
```

---

### 3. Instalar o Electron

```bash
npm install electron --save-dev
```

---

## 🧠 Configuração

### 📄 main.js

Arquivo principal do Electron:

```js
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
```

---

### 📦 package.json

Edite o arquivo para incluir:

```json
{
  "name": "ponto-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  }
}
```

---

## ▶️ Executando o projeto

```bash
npm start
```

Isso abrirá o sistema como um aplicativo desktop.

---

## 🏗️ Gerando o .exe

### 1. Instalar o builder

```bash
npm install electron-builder --save-dev
```

---

### 2. Configurar build no package.json

```json
"build": {
  "appId": "com.ponto.app",
  "win": {
    "target": "nsis"
  }
}
```

---

### 3. Gerar o executável

```bash
npm run build
```

---

### 📂 Saída

O executável será gerado em:

```
dist/
```

Exemplo:

```
Ponto App Setup.exe
```

---

## 💾 Armazenamento de Dados

### Opções:

* localStorage 
* Arquivo JSON local

---

## 📤 Exportação de Dados (Exemplo CSV)

```js
const fs = require('fs');

fs.writeFileSync('pontos.csv', 'dados aqui');
```

---

## 🔥 Possíveis melhorias

* Banco de dados SQLite
* Exportação automática para Excel/CSV
* Integração com API
* Inicialização automática com o Windows
