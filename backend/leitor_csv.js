const inputArquivo = document.getElementById("arquivo");

if (inputArquivo) {
    inputArquivo.addEventListener("change", function () {
        const arquivo = inputArquivo.files[0];

        if (!arquivo) {
            alert("Selecione um arquivo Excel.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            const primeiraAba = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[primeiraAba];

            const dados = XLSX.utils.sheet_to_json(worksheet);

            console.log("Dados importados:", dados);

            const registros =
                JSON.parse(localStorage.getItem("oficineiros")) || [];

            dados.forEach((linha) => {
                if (
                    linha.nome &&
                    linha.matricula &&
                    linha.atividade &&
                    linha.data
                ) {
                    registros.push({
                        nome: linha.nome,
                        matricula: String(linha.matricula),
                        atividade: linha.atividade,
                        data: linha.data,
                        entrada: linha.entrada || "",
                        intervalo: linha.intervalo || "",
                        retorno: linha.retorno || "",
                        situacao: linha.situacao || "ativo",
                        saida: linha.saida || "",
                        observacao: linha.observacao || ""
                    });
                }
            });

            localStorage.setItem(
                "oficineiros",
                JSON.stringify(registros)
            );

            alert("Planilha importada com sucesso!");
        };

        reader.readAsArrayBuffer(arquivo);
    });
}