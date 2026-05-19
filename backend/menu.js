// Verifica login
const usuarioLogado =
    JSON.parse(localStorage.getItem("usuarioLogado"));

if(!usuarioLogado){
    alert("Faça login primeiro!");
    window.location.href = "../frontend/login.html";
}else{
    const el = document.getElementById("usuarioLogadoNome");
    if(el){
        el.textContent = usuarioLogado.nome;
        el.style.color = "black";
    }
}

// Logout
const botaoLogout = document.querySelector(".logout-button");

if(botaoLogout){
    botaoLogout.addEventListener("click", function(){
        localStorage.removeItem("usuarioLogado");
        window.location.href = "../frontend/login.html";
    });
}

// Ponto Automatico
const iniciarPonto = document.querySelector(".cadastro-ponto");
const finalizarPonto = document.querySelector(".finalizar-ponto");

function obterDataHoraAtual() {
    const agora = new Date();
    return {
        data: agora.toLocaleDateString("pt-BR"),
        hora: agora.toLocaleTimeString("pt-BR")
    };
}

if (iniciarPonto && usuarioLogado) {
    iniciarPonto.addEventListener("click", function () {
        const { data, hora } = obterDataHoraAtual();

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const index = usuarios.findIndex(u => u.usuario === usuarioLogado.usuario);

        const registroEntrada = { data, entrada: hora, saida: null };

        if (index !== -1) {
            if (!usuarios[index].pontos) usuarios[index].pontos = [];

            // Impede dupla entrada
            const jaEntrou = usuarios[index].pontos.some(
                p => p.data === data && p.saida === null
            );
            if (jaEntrou) {
                alert("Você já registrou entrada hoje!");
                return;
            }

            usuarios[index].pontos.push(registroEntrada);
        } else {
            usuarioLogado.pontos = [registroEntrada];
            usuarios.push(usuarioLogado);
        }

        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        alert(`Entrada registrada: ${data} às ${hora}`);
    });
    function atualizarBotoes() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioAtual = usuarios.find(u => u.usuario === usuarioLogado.usuario);
    const hoje = new Date().toLocaleDateString("pt-BR");

    const pontoAberto = usuarioAtual?.pontos?.findLast(p => p.data === hoje && p.saida === null);

    iniciarPonto.disabled = !!pontoAberto;
    finalizarPonto.disabled = !pontoAberto;

    iniciarPonto.style.opacity = pontoAberto ? "0.5" : "1";
    finalizarPonto.style.opacity = pontoAberto ? "1" : "0.5";
}

// Chame ao carregar a página
atualizarBotoes();
}

if (finalizarPonto && usuarioLogado) {
    finalizarPonto.addEventListener("click", function () {
        const { data, hora } = obterDataHoraAtual();

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const index = usuarios.findIndex(u => u.usuario === usuarioLogado.usuario);

        if (index !== -1 && usuarios[index].pontos) {
            const pontos = usuarios[index].pontos;
            const ultimoPonto = pontos.findLast(p => p.saida === null);

            if (ultimoPonto) {
                ultimoPonto.saida = hora;
                localStorage.setItem("usuarios", JSON.stringify(usuarios));
                alert(`Saída registrada: ${data} às ${hora}`);
            } else {
                alert("Nenhuma entrada encontrada para registrar saída!");
            }
        } else {
            alert("Usuário não encontrado. Registre a entrada primeiro!");
        }
    });
    function atualizarBotoes() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioAtual = usuarios.find(u => u.usuario === usuarioLogado.usuario);
    const hoje = new Date().toLocaleDateString("pt-BR");

    const pontoAberto = usuarioAtual?.pontos?.findLast(p => p.data === hoje && p.saida === null);

    iniciarPonto.disabled = !!pontoAberto;
    finalizarPonto.disabled = !pontoAberto;

    iniciarPonto.style.opacity = pontoAberto ? "0.5" : "1";
    finalizarPonto.style.opacity = pontoAberto ? "1" : "0.5";
}

// Chame ao carregar a página
atualizarBotoes();
}