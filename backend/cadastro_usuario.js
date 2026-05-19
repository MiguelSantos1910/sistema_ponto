function registrarUsuario(dados) {
    let registros = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica se usuário já existe
    const usuarioExistente = registros.some(u => u.usuario === dados.usuario);
    if (usuarioExistente) {
        alert("Esse nome de usuário já está em uso!");
        return;
    }

    // Verifica campos vazios
    if (!dados.nome || !dados.usuario || !dados.senha) {
        alert("Preencha todos os campos!");
        return;
    }

    // Senha mínima
    if (dados.senha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres!");
        return;
    }

    const novoUsuario = {
        nome: dados.nome,
        usuario: dados.usuario,
        senha: dados.senha
    };

    registros.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(registros));
    

    alert("Usuário cadastrado com sucesso!");
    window.location.href = "../frontend/login.html";
}

const form = document.getElementById("cadastro");


if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const dadosForm = new FormData(form);
        const dados = Object.fromEntries(dadosForm.entries());

        registrarUsuario(dados);
    });
} else {
    alert("Formulário de cadastro não encontrado!");
}   