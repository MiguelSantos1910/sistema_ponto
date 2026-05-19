function registrarPonto(dados){
    // Pega registros já existentes
    let registros =
        JSON.parse(localStorage.getItem("registros")) || [];

    // Cria objeto com os dados do formulário
    const novoRegistro = {
        nome: dados.nome,
        matricula: dados.matricula,
        atividade: dados.atividade,
        data: dados.data,
        entrada: dados.entrada,
        intervalo: dados.intervalo,
        retorno: dados.retorno,
        saida: dados.saida,
        situacao: dados.situacao,
        observacao: dados.observacao
    };

    // Adiciona novo registro
    registros.push(novoRegistro);

    // Salva no localStorage
    localStorage.setItem(
        "registros",
        JSON.stringify(registros)
    );

    alert("Ponto registrado com sucesso!");

}

// FORM
const form = document.getElementById("oficineiros");

form.addEventListener("submit", function(e){

    e.preventDefault();

    const dadosForm = new FormData(form);

    // Pega todos os dados automaticamente
    const dados =
        Object.fromEntries(dadosForm.entries());

    console.log(JSON.parse(localStorage.getItem("registros")));

    registrarPonto(dados);
});