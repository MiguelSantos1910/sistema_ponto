function validarLogin(dados) {
    // Remove espaços
    dados.usuario = dados.usuario.trim();
    dados.senha = dados.senha.trim();

    // Verifica campos vazios
    if (!dados.usuario || !dados.senha) {
        alert("Preencha todos os campos!");
        return;
    }

    
    let usuarios = [];

    try {
        usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    } catch (error) {
        console.error("Erro ao ler usuários do localStorage:", error);
        usuarios = [];
    }

    // Verifica se a lista de usuários está vazia
    if (usuarios.length === 0) {
        alert("Nenhum usuário cadastrado!");
        return;
    }

    const usuarioEncontrado = usuarios.find(
        u =>
            u.usuario === dados.usuario &&
            u.senha === dados.senha
    );

    if (usuarioEncontrado) {
        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuarioEncontrado)
        );

        window.location.href = "../frontend/menu.html";
    } else {
        alert("Usuário ou senha inválidos!");
    }
}

const form = document.getElementById("login");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const dadosForm = new FormData(form);
        const dados = Object.fromEntries(dadosForm.entries());

        validarLogin(dados);
    });
} else {
    alert('Formulário com id "login" não encontrado.');
}