function registrarPonto(dados) {
    // Recupera registros já existentes
    let registros =
        JSON.parse(localStorage.getItem("funcionarios")) || [];

    // Validação básica
    if (
        !dados.nome ||
        !dados.atividade ||
        !dados.data ||
        !dados.entrada ||
        !dados.intervalo ||
        !dados.retorno ||
        !dados.saida ||
        !dados.situacao
    ) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    // Cria objeto com os dados do formulário
    const novoRegistro = {
        nome: dados.nome.trim(),
        atividade: dados.atividade.trim(),
        data: dados.data,
        entrada: dados.entrada,
        intervalo: dados.intervalo,
        retorno: dados.retorno,
        saida: dados.saida,
        situacao: dados.situacao,
        observacao: (dados.observacao || "").trim()
    };

    // Adiciona novo registro
    registros.push(novoRegistro);

    // Salva no localStorage
    localStorage.setItem(
        "funcionarios",
        JSON.stringify(registros)
    );

    alert("Ponto registrado com sucesso!");

    // Limpa formulário
    form.reset();

    // Define a data atual novamente (opcional)
    const campoData = document.getElementById("data");
    if (campoData) {
        campoData.value = new Date()
            .toISOString()
            .split("T")[0];
    }
}

// FORMULÁRIO

const form = document.getElementById("funcionarios");

if (form) {
    // Preenche automaticamente a data com o dia atual
    const campoData = document.getElementById("data");
    if (campoData && !campoData.value) {
        campoData.value = new Date()
            .toISOString()
            .split("T")[0];
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const dadosForm = new FormData(form);

        // Converte os dados do formulário em objeto
        const dados =
            Object.fromEntries(dadosForm.entries());

        registrarPonto(dados);

    });
    
} else {
    alert('Formulário com id "funcionarios" não encontrado.');
}