// Verifica login
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    alert("Faça login primeiro!");
    window.location.href = "../frontend/login.html";
}

// Exibe nome do usuário logado
const el = document.getElementById("usuarioLogadoNome");
if (el && usuarioLogado) {
    el.textContent = usuarioLogado.nome;
    el.style.color = "black";
}

// Logout
const botaoLogout = document.querySelector(".logout-button");

if (botaoLogout) {
    botaoLogout.addEventListener("click", function () {
        localStorage.removeItem("usuarioLogado");
        window.location.href = "../frontend/login.html";
    });
}

// Botões de ponto
const iniciarPonto = document.querySelector(".cadastro-ponto");
const finalizarPonto = document.querySelector(".finalizar-ponto");

// Utilitário para obter data e hora atual
function obterDataHoraAtual() {
    const agora = new Date();
    return {
        data: agora.toLocaleDateString("pt-BR"),
        hora: agora.toLocaleTimeString("pt-BR")
    };
}

// Atualiza estado dos botões
function atualizarBotoes() {
    // Só executa se os dois botões existirem
    if (!iniciarPonto || !finalizarPonto || !usuarioLogado) {
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioAtual = usuarios.find(
        u => u.usuario === usuarioLogado.usuario
    );

    const hoje = new Date().toLocaleDateString("pt-BR");

    // Compatível com todos os navegadores
    const pontoAberto = [...(usuarioAtual?.pontos || [])]
        .reverse()
        .find(p => p.data === hoje && p.saida === null);

    // Se existe ponto aberto:
    // - desabilita entrada
    // - habilita saída
    iniciarPonto.disabled = !!pontoAberto;
    finalizarPonto.disabled = !pontoAberto;

    // Ajuste visual
    iniciarPonto.style.opacity = pontoAberto ? "0.5" : "1";
    finalizarPonto.style.opacity = pontoAberto ? "1" : "0.5";
}

// Registrar entrada
if (iniciarPonto && usuarioLogado) {
    iniciarPonto.addEventListener("click", function () {
        const { data, hora } = obterDataHoraAtual();

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const index = usuarios.findIndex(
            u => u.usuario === usuarioLogado.usuario
        );

        const registroEntrada = {
            data,
            entrada: hora,
            saida: null
        };

        if (index !== -1) {
            if (!usuarios[index].pontos) {
                usuarios[index].pontos = [];
            }

            // Verifica se já existe expediente aberto hoje
            const jaEntrou = usuarios[index].pontos.some(
                p => p.data === data && p.saida === null
            );

            if (jaEntrou) {
                alert("Você já registrou entrada hoje!");
                return;
            }

            usuarios[index].pontos.push(registroEntrada);

            // Atualiza também o usuário logado
            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(usuarios[index])
            );
        } else {
            // Caso o usuário não esteja na lista
            usuarioLogado.pontos = [registroEntrada];
            usuarios.push(usuarioLogado);

            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(usuarioLogado)
            );
        }

        // Salva usuários atualizados
        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
        );

        alert(`Entrada registrada: ${data} às ${hora}`);

        // Atualiza os botões imediatamente
        atualizarBotoes();
    });
}

// Registrar saída
if (finalizarPonto && usuarioLogado) {
    finalizarPonto.addEventListener("click", function () {
        const { data, hora } = obterDataHoraAtual();

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const index = usuarios.findIndex(
            u => u.usuario === usuarioLogado.usuario
        );

        if (index !== -1 && usuarios[index].pontos) {
            const pontos = usuarios[index].pontos;

            // Procura o último ponto em aberto
            const ultimoPonto = [...pontos]
                .reverse()
                .find(p => p.data === data && p.saida === null);

            if (ultimoPonto) {
                ultimoPonto.saida = hora;

                // Salva usuários atualizados
                localStorage.setItem(
                    "usuarios",
                    JSON.stringify(usuarios)
                );

                // Atualiza também o usuário logado
                localStorage.setItem(
                    "usuarioLogado",
                    JSON.stringify(usuarios[index])
                );

                alert(`Saída registrada: ${data} às ${hora}`);

                // Atualiza os botões imediatamente
                atualizarBotoes();
            } else {
                alert("Nenhuma entrada encontrada para registrar saída!");
            }
        } else {
            alert("Usuário não encontrado. Registre a entrada primeiro!");
        }
    });
}

// Atualiza o estado dos botões ao carregar a página
atualizarBotoes();