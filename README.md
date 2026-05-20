# ============================================================
# README - Sistema de Ponto com Electron
# ============================================================
#
# Este documento explica, passo a passo, como transformar
# o Sistema de Ponto (HTML, CSS e JavaScript) em um aplicativo
# executável para Windows usando Electron.
#
# Todo o conteúdo deste arquivo está comentado para facilitar
# o entendimento.
#
# ============================================================



# ============================================================
# VISÃO GERAL DO PROJETO
# ============================================================
#
# O Sistema de Ponto foi desenvolvido utilizando:
#
# - HTML5
# - CSS3
# - JavaScript
# - LocalStorage
# - Electron
#
# Funcionalidades disponíveis:
#
# - Cadastro de usuários
# - Login e logout
# - Registro automático de entrada e saída
# - Cadastro de funcionários
# - Cadastro de oficineiros
# - Importação de planilhas Excel
# - Exportação e importação de backup JSON
# - Geração de relatórios em PDF
# - Visualização, edição e exclusão de registros
#
# O Electron empacota todo o sistema em um executável (.exe),
# permitindo a instalação em computadores Windows sem depender
# de um navegador.
#
# ============================================================



# ============================================================
# ESTRUTURA DO PROJETO
# ============================================================
#
# sistema-ponto/
# │
# ├── frontend/                  # Arquivos HTML
# │   ├── login.html
# │   ├── menu.html
# │   ├── dashboard.html
# │   ├── ponto_funcionarios.html
# │   ├── ponto_oficineiros.html
# │   ├── visualizar_funcionarios.html
# │   ├── visualizar_oficineiros.html
# │   └── cadastro_usuarios.html
# │
# ├── backend/                   # Arquivos JavaScript
# │   ├── login.js
# │   ├── menu.js
# │   ├── ponto_funcionarios.js
# │   ├── ponto_oficineiros.js
# │   ├── visualizar_funcionarios.js
# │   ├── visualizar_oficineiros.js
# │   ├── leitor_csv.js
# │   ├── backup_sistema.js
# │   ├── importar_backup.js
# │   └── gerador_relatorioPDF.js
# │
# ├── style/                     # Arquivos CSS
# │   ├── login.css
# │   ├── menu.css
# │   ├── ponto_funcionarios.css
# │   ├── ponto_oficineiros.css
# │   ├── visualizar_funcionarios.css
# │   └── visualizar_oficineiros.css
# │
# ├── assets/                    # Imagens, logo e ícones
# │   ├── logo.avif
# │   └── icon.ico
# │
# ├── main.js                    # Arquivo principal do Electron
# ├── package.json               # Configuração do projeto
# └── README.md                  # Este arquivo
#
# ============================================================



# ============================================================
# PRÉ-REQUISITOS
# ============================================================
#
# Antes de iniciar, é necessário instalar:
#
# 1. Node.js
# 2. NPM (já incluído com o Node.js)
#
# Site oficial:
# https://nodejs.org
#
# ============================================================



# ============================================================
# INICIALIZAR O PROJETO
# ============================================================
#
# O comando abaixo cria o arquivo package.json automaticamente.
#
# npm init -y
#
# Explicação:
# - npm init      -> inicializa um projeto Node.js
# - -y            -> aceita todas as configurações padrão
#
# ============================================================



# ============================================================
# INSTALAR O ELECTRON
# ============================================================
#
# npm install electron --save-dev
#
# Explicação:
# - npm install        -> instala um pacote
# - electron          -> framework para criar apps desktop
# - --save-dev        -> adiciona em devDependencies
#
# ============================================================



# ============================================================
# INSTALAR O ELECTRON BUILDER
# ============================================================
#
# npm install electron-builder --save-dev
#
# Explicação:
# - electron-builder -> gera instaladores (.exe, .deb, .AppImage)
#
# ============================================================



# ============================================================
# ARQUIVO main.js
# ============================================================
#
# Este arquivo é o ponto de entrada do aplicativo.
# Ele cria a janela principal e carrega a tela de login.
#
# ------------------------------------------------------------
# Código:
# ------------------------------------------------------------

const { app, BrowserWindow } = require("electron");
# Importa:
# - app: controla o ciclo de vida da aplicação
# - BrowserWindow: cria janelas

function createWindow() {
    # Função responsável por criar a janela principal

    const win = new BrowserWindow({
        width: 1400,
        # Largura inicial da janela

        height: 900,
        # Altura inicial da janela

        minWidth: 1000,
        # Largura mínima permitida

        minHeight: 700,
        # Altura mínima permitida

        autoHideMenuBar: true,
        # Oculta a barra de menu padrão

        icon: "assets/icon.ico",
        # Define o ícone do aplicativo

        webPreferences: {
            nodeIntegration: false,
            # Impede acesso direto ao Node.js no frontend

            contextIsolation: true
            # Isola o contexto por segurança
        }
    });

    win.loadFile("frontend/login.html");
    # Carrega a página inicial
}

app.whenReady().then(() => {
    # Executa quando o Electron estiver pronto

    createWindow();

    app.on("activate", () => {
        # No macOS, recria a janela ao clicar no ícone do app

        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    # Fecha o aplicativo quando todas as janelas forem encerradas

    if (process.platform !== "darwin") {
        # No macOS, é comum manter o app aberto
        app.quit();
    }
});

# ============================================================



# ============================================================
# ARQUIVO package.json
# ============================================================
#
# Este arquivo configura:
# - Nome do projeto
# - Scripts
# - Dependências
# - Geração do instalador
#
# ------------------------------------------------------------
# Código:
# ------------------------------------------------------------

{
  "name": "sistema-ponto",
  # Nome interno do projeto

  "version": "1.0.0",
  # Versão atual

  "description": "Sistema de Ponto com Electron",
  # Descrição do aplicativo

  "main": "main.js",
  # Arquivo principal

  "author": "Miguel Santos",
  # Autor do projeto

  "scripts": {
    "start": "electron .",
    # Executa o projeto em modo desenvolvimento

    "build": "electron-builder"
    # Gera o instalador
  },

  "devDependencies": {
    "electron": "^37.0.0",
    # Dependência do Electron

    "electron-builder": "^26.0.0"
    # Dependência do empacotador
  },

  "build": {
    "appId": "com.sistemaponto.app",
    # Identificador único da aplicação

    "productName": "Sistema de Ponto",
    # Nome exibido ao usuário

    "directories": {
      "output": "dist"
      # Pasta onde será gerado o instalador
    },

    "files": [
      "frontend/**/*",
      # Inclui todos os HTML

      "backend/**/*",
      # Inclui todos os JavaScript

      "style/**/*",
      # Inclui todos os CSS

      "assets/**/*",
      # Inclui imagens e ícones

      "main.js",
      # Inclui o arquivo principal

      "package.json"
      # Inclui a configuração
    ],

    "win": {
      "target": ["nsis"],
      # Gera instalador .exe

      "icon": "assets/icon.ico"
      # Ícone do executável
    }
  }
}

# ============================================================



# ============================================================
# EXECUTAR O PROJETO
# ============================================================
#
# npm start
#
# Explicação:
# - Executa o script "start" definido no package.json
# - Abre o aplicativo em modo desenvolvimento
#
# ============================================================



# ============================================================
# GERAR O INSTALADOR
# ============================================================
#
# npm run build
#
# Explicação:
# - Executa o script "build"
# - Gera o instalador para Windows
#
# ============================================================



# ============================================================
# ARQUIVOS GERADOS
# ============================================================
#
# Após a compilação, a pasta dist/ será criada:
#
# dist/
# ├── Sistema de Ponto Setup 1.0.0.exe
# └── win-unpacked/
#
# O arquivo .exe é o instalador que pode ser distribuído.
#
# ============================================================



# ============================================================
# ARMAZENAMENTO DE DADOS
# ============================================================
#
# O sistema utiliza localStorage para armazenar:
#
# - usuarios
# - usuarioLogado
# - funcionarios
# - oficineiros
#
# Os dados ficam salvos localmente no computador do usuário.
#
# ============================================================



# ============================================================
# BACKUP DO SISTEMA
# ============================================================
#
# O sistema permite:
#
# - Exportar backup em JSON
# - Importar backup em JSON
#
# Isso garante recuperação de dados em caso de perda.
#
# ============================================================



# ============================================================
# IMPORTAÇÃO DE PLANILHAS
# ============================================================
#
# Utiliza a biblioteca SheetJS.
#
# Formatos aceitos:
#
# - .xlsx
# - .xls
#
# ============================================================



# ============================================================
# RELATÓRIOS EM PDF
# ============================================================
#
# Utiliza a biblioteca jsPDF.
#
# Relatórios disponíveis:
#
# - Funcionários
# - Oficineiros
#
# ============================================================



# ============================================================
# TECNOLOGIAS UTILIZADAS
# ============================================================
#
# - HTML5
# - CSS3
# - JavaScript ES6
# - LocalStorage
# - Electron
# - Electron Builder
# - SheetJS
# - jsPDF
#
# ============================================================



# ============================================================
# MELHORIAS FUTURAS
# ============================================================
#
# - Banco de dados SQLite
# - Criptografia de senhas
# - Controle de permissões
# - Atualizações automáticas
# - Integração com nuvem
#
# ============================================================



# ============================================================
# AUTOR
# ============================================================
#
# Miguel Santos
#
# ============================================================



# ============================================================
# LICENÇA
# ============================================================
#
# Projeto de uso interno para controle de ponto da instituição.
#
# ============================================================
