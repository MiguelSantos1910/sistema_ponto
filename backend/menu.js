// ==========================================
// VERIFICAÇÃO DE LOGIN
// ==========================================
const usuarioLogado = JSON.parse(
    localStorage.getItem("usuarioLogado")
);

if (!usuarioLogado) {
    alert("Faça login primeiro!");
    window.location.href = "../frontend/login.html";
}

// ==========================================
// ELEMENTOS DA INTERFACE
// ==========================================
const elUsuario = document.getElementById(
    "usuarioLogadoNome"
);

const botaoLogout = document.querySelector(
    ".logout-button"
);

const iniciarPonto = document.querySelector(
    ".cadastro-ponto"
);

const finalizarPonto = document.querySelector(
    ".finalizar-ponto"
);

const statusExpediente = document.getElementById(
    "status-expediente"
);

const saldoHorasMenu = document.getElementById(
    "saldo-horas-menu"
);

// ==========================================
// EXIBE NOME DO USUÁRIO
// ==========================================
if (elUsuario && usuarioLogado) {
    elUsuario.textContent = usuarioLogado.nome;
}

// ==========================================
// LOGOUT
// ==========================================
if (botaoLogout) {
    botaoLogout.addEventListener("click", function () {
        if (confirm("Deseja realmente sair do sistema?")) {
            localStorage.removeItem("usuarioLogado");
            window.location.href =
                "../frontend/login.html";
        }
    });
}

// ==========================================
// UTILITÁRIOS
// ==========================================
function obterDataHoraAtual() {
    const agora = new Date();

    return {
        data: agora.toLocaleDateString("pt-BR"),
        hora: agora.toLocaleTimeString("pt-BR")
    };
}

function obterUsuarios() {
    try {
        return JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];
    } catch (error) {
        console.error(
            "Erro ao ler usuários:",
            error
        );
        return [];
    }
}

function salvarUsuarios(usuarios) {
    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );
}

function atualizarUsuarioLogado(usuarioAtualizado) {
    localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuarioAtualizado)
    );
}

function obterUsuarioAtual() {
    const usuarios = obterUsuarios();

    return usuarios.find(
        u => u.usuario === usuarioLogado.usuario
    );
}

function formatarHoras(minutosTotais) {
    const sinal = minutosTotais >= 0 ? "+" : "-";
    const abs = Math.abs(minutosTotais);

    const horas = Math.floor(abs / 60);
    const minutos = abs % 60;

    return `${sinal}${String(horas).padStart(2, "0")}:${String(
        minutos
    ).padStart(2, "0")}`;
}

function calcularMinutosEntre(entrada, saida) {
    if (!entrada || !saida) {
        return 0;
    }

    const [hE, mE] = entrada.split(":").map(Number);
    const [hS, mS] = saida.split(":").map(Number);

    return (hS * 60 + mS) - (hE * 60 + mE);
}

// ==========================================
// ATUALIZA STATUS DO EXPEDIENTE
// ==========================================
function atualizarStatusExpediente() {
    if (!statusExpediente) {
        return;
    }

    const usuarioAtual = obterUsuarioAtual();
    const hoje = new Date().toLocaleDateString("pt-BR");

    const pontoAberto = [...(usuarioAtual?.pontos || [])]
        .reverse()
        .find(
            ponto =>
                ponto.data === hoje &&
                ponto.saida === null
        );

    if (pontoAberto) {
        statusExpediente.textContent =
            "Em expediente";
        statusExpediente.style.color = "#2e7d32";
    } else {
        statusExpediente.textContent =
            "Fora do expediente";
        statusExpediente.style.color = "#666";
    }
}

// ==========================================
// ATUALIZA BANCO DE HORAS
// ==========================================
function atualizarBancoHoras() {
    if (!saldoHorasMenu) {
        return;
    }

    const usuarioAtual = obterUsuarioAtual();
    const pontos = usuarioAtual?.pontos || [];

    const CARGA_DIARIA = 8 * 60; // 8 horas
    let saldoMinutos = 0;

    pontos.forEach(ponto => {
        if (ponto.entrada && ponto.saida) {
            const minutosTrabalhados =
                calcularMinutosEntre(
                    ponto.entrada,
                    ponto.saida
                );

            saldoMinutos +=
                minutosTrabalhados -
                CARGA_DIARIA;
        }
    });

    saldoHorasMenu.textContent =
        formatarHoras(saldoMinutos);

    saldoHorasMenu.style.color =
        saldoMinutos >= 0
            ? "#2e7d32"
            : "#c62828";
}

// ==========================================
// ATUALIZA BOTÕES
// ==========================================
function atualizarBotoes() {
    if (
        !iniciarPonto ||
        !finalizarPonto ||
        !usuarioLogado
    ) {
        return;
    }

    const usuarioAtual = obterUsuarioAtual();
    const hoje = new Date().toLocaleDateString("pt-BR");

    const pontoAberto = [...(usuarioAtual?.pontos || [])]
        .reverse()
        .find(
            ponto =>
                ponto.data === hoje &&
                ponto.saida === null
        );

    // Habilita/desabilita botões
    iniciarPonto.disabled = !!pontoAberto;
    finalizarPonto.disabled = !pontoAberto;

    // Aparência visual
    iniciarPonto.style.opacity =
        pontoAberto ? "0.6" : "1";

    finalizarPonto.style.opacity =
        pontoAberto ? "1" : "0.6";

    iniciarPonto.style.cursor =
        pontoAberto ? "not-allowed" : "pointer";

    finalizarPonto.style.cursor =
        pontoAberto ? "pointer" : "not-allowed";
}

// ==========================================
// REGISTRAR ENTRADA
// ==========================================
function registrarEntrada() {
    const { data, hora } = obterDataHoraAtual();
    const usuarios = obterUsuarios();

    const index = usuarios.findIndex(
        u => u.usuario === usuarioLogado.usuario
    );

    if (index === -1) {
        alert("Usuário não encontrado.");
        return;
    }

    if (!usuarios[index].pontos) {
        usuarios[index].pontos = [];
    }

    const pontoAberto = usuarios[index].pontos.some(
        ponto =>
            ponto.data === data &&
            ponto.saida === null
    );

    if (pontoAberto) {
        alert("Você já registrou entrada hoje!");
        return;
    }

    usuarios[index].pontos.push({
        data,
        entrada: hora,
        saida: null
    });

    salvarUsuarios(usuarios);
    atualizarUsuarioLogado(usuarios[index]);

    alert(`Entrada registrada em ${data} às ${hora}`);

    atualizarInterface();
}

// ==========================================
// REGISTRAR SAÍDA
// ==========================================
function registrarSaida() {
    const { data, hora } = obterDataHoraAtual();
    const usuarios = obterUsuarios();

    const index = usuarios.findIndex(
        u => u.usuario === usuarioLogado.usuario
    );

    if (
        index === -1 ||
        !usuarios[index].pontos
    ) {
        alert(
            "Nenhuma entrada encontrada para finalizar."
        );
        return;
    }

    const pontoAberto = [...usuarios[index].pontos]
        .reverse()
        .find(
            ponto =>
                ponto.data === data &&
                ponto.saida === null
        );

    if (!pontoAberto) {
        alert(
            "Nenhuma entrada encontrada para registrar saída!"
        );
        return;
    }

    pontoAberto.saida = hora;

    salvarUsuarios(usuarios);
    atualizarUsuarioLogado(usuarios[index]);

    alert(`Saída registrada em ${data} às ${hora}`);

    atualizarInterface();
}

// ==========================================
// EVENTOS DOS BOTÕES
// ==========================================
if (iniciarPonto) {
    iniciarPonto.addEventListener(
        "click",
        registrarEntrada
    );
}

if (finalizarPonto) {
    finalizarPonto.addEventListener(
        "click",
        registrarSaida
    );
}

// ==========================================
// ATUALIZA TODA A INTERFACE
// ==========================================
function atualizarInterface() {
    atualizarBotoes();
    atualizarStatusExpediente();
    atualizarBancoHoras();
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener(
    "DOMContentLoaded",
    function () {
        atualizarInterface();
    }
);

// Caso o script seja carregado após o DOM
atualizarInterface();