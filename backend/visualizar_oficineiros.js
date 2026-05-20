// visualizar_oficineiros.js

const tabela = document.getElementById("tabela-oficineiros");
const totalRegistros = document.getElementById("total-registros");

const modal = document.getElementById("modal-edicao");
const formEdicao = document.getElementById("form-edicao");

// Campos do modal
const indiceEdicao = document.getElementById("indice-edicao");
const editNome = document.getElementById("edit-nome");
const editMatricula = document.getElementById("edit-matricula");
const editAtividade = document.getElementById("edit-atividade");
const editData = document.getElementById("edit-data");
const editEntrada = document.getElementById("edit-entrada");
const editIntervalo = document.getElementById("edit-intervalo");
const editRetorno = document.getElementById("edit-retorno");
const editSituacao = document.getElementById("edit-situacao");
const editSaida = document.getElementById("edit-saida");
const editObservacao = document.getElementById("edit-observacao");

// Recupera os registros do localStorage
let registros =
    JSON.parse(localStorage.getItem("oficineiros")) || [];

/**
 * Formata a data de YYYY-MM-DD para DD/MM/YYYY
 */
function formatarDataParaExibicao(data) {
    if (!data) return "";

    // Se já estiver no formato DD/MM/YYYY
    if (data.includes("/")) return data;

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

/**
 * Formata a data de DD/MM/YYYY para YYYY-MM-DD
 * (necessário para o input type="date")
 */
function formatarDataParaInput(data) {
    if (!data) return "";

    // Se já estiver no formato YYYY-MM-DD
    if (data.includes("-")) return data;

    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
}

/**
 * Salva os registros no localStorage
 */
function salvarRegistros() {
    localStorage.setItem(
        "oficineiros",
        JSON.stringify(registros)
    );
}

/**
 * Renderiza a tabela
 */
function carregarTabela() {
    tabela.innerHTML = "";
    totalRegistros.textContent = registros.length;

    if (registros.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="11" class="sem-dados">
                    Nenhum registro encontrado.
                </td>
            </tr>
        `;
        return;
    }

    registros.forEach((registro, index) => {
        const situacao =
            (registro.situacao || "ativo").toLowerCase();

        tabela.innerHTML += `
            <tr>
                <td>${registro.nome || ""}</td>
                <td>${registro.matricula || ""}</td>
                <td>${registro.atividade || ""}</td>
                <td>${formatarDataParaExibicao(registro.data)}</td>
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
                <td>
                    <button
                        type="button"
                        class="btn-editar"
                        onclick="abrirModal(${index})"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-excluir"
                        onclick="excluirRegistro(${index})"
                    >
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

/**
 * Abre o modal e preenche os campos
 */
function abrirModal(index) {
    const registro = registros[index];

    indiceEdicao.value = index;
    editNome.value = registro.nome || "";
    editMatricula.value = registro.matricula || "";
    editAtividade.value = registro.atividade || "";
    editData.value =
        formatarDataParaInput(registro.data);
    editEntrada.value = registro.entrada || "";
    editIntervalo.value = registro.intervalo || "";
    editRetorno.value = registro.retorno || "";
    editSituacao.value =
        registro.situacao || "ativo";
    editSaida.value = registro.saida || "";
    editObservacao.value =
        registro.observacao || "";

    modal.classList.remove("hidden");
}

/**
 * Fecha o modal
 */
function fecharModal() {
    modal.classList.add("hidden");
    formEdicao.reset();
}

/**
 * Exclui um registro
 */
function excluirRegistro(index) {
    const confirmar = confirm(
        "Deseja realmente excluir este registro?"
    );

    if (!confirmar) return;

    registros.splice(index, 1);
    salvarRegistros();
    carregarTabela();

    alert("Registro excluído com sucesso!");
}

/**
 * Salva alterações do modal
 */
if (formEdicao) {
    formEdicao.addEventListener("submit", function (e) {
        e.preventDefault();

        const index =
            Number(indiceEdicao.value);

        registros[index] = {
            ...registros[index],
            nome: editNome.value.trim(),
            matricula:
                editMatricula.value.trim(),
            atividade:
                editAtividade.value.trim(),
            data: editData.value,
            entrada: editEntrada.value,
            intervalo: editIntervalo.value,
            retorno: editRetorno.value,
            situacao: editSituacao.value,
            saida: editSaida.value,
            observacao:
                editObservacao.value.trim()
        };

        salvarRegistros();
        carregarTabela();
        fecharModal();

        alert("Registro atualizado com sucesso!");
    });
}

/**
 * Fecha modal ao clicar fora
 */
if (modal) {
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            fecharModal();
        }
    });
}

// Disponibiliza funções para o HTML
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.excluirRegistro = excluirRegistro;

// Inicializa a tabela
carregarTabela();