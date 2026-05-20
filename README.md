# 🕐 Sistema de Ponto

> Aplicativo desktop para controle de ponto de funcionários e oficineiros, desenvolvido com Electron.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Armazenamento de Dados](#armazenamento-de-dados)
- [Geração do Instalador](#geração-do-instalador)
- [Melhorias Futuras](#melhorias-futuras)
- [Autor](#autor)

---

## Visão Geral

O **Sistema de Ponto** é uma aplicação desktop desenvolvida com Electron que empacota uma interface HTML/CSS/JavaScript em um executável `.exe` para Windows. Os dados são armazenados localmente via `localStorage`, sem necessidade de servidor ou banco de dados externo.

---

## Funcionalidades

- 👤 Cadastro e autenticação de usuários
- ⏱️ Registro automático de entrada e saída
- 👷 Cadastro de funcionários e oficineiros
- 📊 Importação de planilhas Excel (`.xlsx` / `.xls`)
- 💾 Exportação e importação de backup em JSON
- 📄 Geração de relatórios em PDF
- 🔍 Visualização, edição e exclusão de registros

---

## Tecnologias

| Tecnologia | Descrição |
|---|---|
| HTML5 / CSS3 / JS ES6 | Interface do usuário |
| Electron | Empacotamento como app desktop |
| Electron Builder | Geração do instalador `.exe` |
| SheetJS | Importação de planilhas Excel |
| jsPDF | Geração de relatórios em PDF |
| LocalStorage | Armazenamento local de dados |

---

## Estrutura do Projeto

```
sistema-ponto/
│
├── frontend/                        # Páginas HTML
│   ├── login.html
│   ├── menu.html
│   ├── dashboard.html
│   ├── ponto_funcionarios.html
│   ├── ponto_oficineiros.html
│   ├── visualizar_funcionarios.html
│   ├── visualizar_oficineiros.html
│   └── cadastro_usuarios.html
│
├── backend/                         # Scripts JavaScript
│   ├── login.js
│   ├── menu.js
│   ├── ponto_funcionarios.js
│   ├── ponto_oficineiros.js
│   ├── visualizar_funcionarios.js
│   ├── visualizar_oficineiros.js
│   ├── leitor_csv.js
│   ├── backup_sistema.js
│   ├── importar_backup.js
│   └── gerador_relatorioPDF.js
│
├── style/                           # Arquivos CSS
│   ├── login.css
│   ├── menu.css
│   ├── ponto_funcionarios.css
│   ├── ponto_oficineiros.css
│   ├── visualizar_funcionarios.css
│   └── visualizar_oficineiros.css
│
├── assets/                          # Imagens e ícones
│   ├── logo.avif
│   └── icon.ico
│
├── main.js                          # Ponto de entrada do Electron
├── package.json                     # Configuração do projeto
└── README.md
```

---

## Pré-requisitos

Antes de começar, instale o [Node.js](https://nodejs.org) (o NPM já vem incluído).

---

## Instalação

**1. Inicialize o projeto**

```bash
npm init -y
```

**2. Instale o Electron**

```bash
npm install electron --save-dev
```

**3. Instale o Electron Builder**

```bash
npm install electron-builder --save-dev
```

---

## Como Usar

### Executar em modo desenvolvimento

```bash
npm start
```

Isso abre o aplicativo diretamente, sem gerar um instalador.

### Configuração do `main.js`

O arquivo `main.js` é o ponto de entrada do Electron. Ele cria a janela principal e carrega a tela de login:

```javascript
const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    autoHideMenuBar: true,
    icon: "assets/icon.ico",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile("frontend/login.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
```

### Configuração do `package.json`

```json
{
  "name": "sistema-ponto",
  "version": "1.0.0",
  "description": "Sistema de Ponto com Electron",
  "main": "main.js",
  "author": "Miguel Santos",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  },
  "devDependencies": {
    "electron": "^37.0.0",
    "electron-builder": "^26.0.0"
  },
  "build": {
    "appId": "com.sistemaponto.app",
    "productName": "Sistema de Ponto",
    "directories": {
      "output": "dist"
    },
    "files": [
      "frontend/**/*",
      "backend/**/*",
      "style/**/*",
      "assets/**/*",
      "main.js",
      "package.json"
    ],
    "win": {
      "target": ["nsis"],
      "icon": "assets/icon.ico"
    }
  }
}
```

---

## Armazenamento de Dados

Os dados são salvos localmente no computador do usuário via `localStorage`:

| Chave | Conteúdo |
|---|---|
| `usuarios` | Lista de usuários cadastrados |
| `usuarioLogado` | Sessão do usuário atual |
| `funcionarios` | Cadastro de funcionários |
| `oficineiros` | Cadastro de oficineiros |

### Backup

O sistema permite exportar e importar os dados em formato JSON, garantindo recuperação em caso de perda ou migração para outro computador.

---

## Geração do Instalador

```bash
npm run build
```

Após a compilação, a pasta `dist/` será criada com os seguintes arquivos:

```
dist/
├── Sistema de Ponto Setup 1.0.0.exe   ← instalador para distribuição
└── win-unpacked/
```

---

## Melhorias Futuras

- [ ] Banco de dados SQLite para maior robustez
- [ ] Criptografia de senhas
- [ ] Controle de permissões por nível de acesso
- [ ] Atualizações automáticas via Electron Updater
- [ ] Integração com nuvem para backup remoto

---

## Autor

Desenvolvido por **Miguel Santos**.

---

## Licença

Projeto de uso interno para controle de ponto da instituição.
