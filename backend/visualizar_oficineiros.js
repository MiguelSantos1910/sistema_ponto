const tabela = document.getElementById("tabela-oficineiros");
const totalRegistros = document.getElementById("total-registros");

const registros =
    JSON.parse(localStorage.getItem("oficineiros")) || [];

totalRegistros.textContent = registros.length;

if (registros.length === 0) {
    tabela.innerHTML = `
        <tr>
            <td colspan="10" class="sem-dados">
                Nenhum registro encontrado.
            </td>
        </tr>
    `;
} else {
    registros.forEach((registro) => {
        const situacao =
            (registro.situacao || "ativo").toLowerCase();

        tabela.innerHTML += `
            <tr>
                <td>${registro.nome || ""}</td>
                <td>${registro.matricula || ""}</td>
                <td>${registro.atividade || ""}</td>
                <td>${registro.data || ""}</td>
                <td>${registro.entrada || ""}</td>
                <td>${registro.intervalo || ""}</td>
                <td>${registro.retorno || ""}</td>
                <td>
                    <span class="badge ${situacao}">
                        ${registro.situacao || ""}
                    </span>
                </td>
                <td>${registro.saida || ""}</td>
                <td>${registro.observacao || ""}</td>
            </tr>
        `;
    });
}