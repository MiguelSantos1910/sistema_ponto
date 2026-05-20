const tabela = document.getElementById("tabela-funcionarios");
const totalRegistros = document.getElementById("total-registros");

// Modal
const modal = document.getElementById("modal-edicao");
const formEdicao = document.getElementById("form-edicao");

// Campos do modal
const indiceEdicao = document.getElementById("indice-edicao");
const editNome = document.getElementById("edit-nome");
const editCredito = document.getElementById("edit-credito");
const editTotalHoras = document.getElementById("edit-total-horas");
const editDias = document.getElementById("edit-dias");
const editPrevisao = document.getElementById("edit-previsao");
const editObservacao = document.getElementById("edit-observacao");

// Chave do localStorage
// Esta chave é a mesma utilizada em registrarPonto()
const CHAVE_STORAGE = "funcionarios";

// Carrega registros
let registros =
    JSON.parse(localStorage.getItem(CHAVE_STORAGE)) || [];


// FUNÇÕES AUXILIARES


function salvarLocalStorage() {
    localStorage.setItem(
        CHAVE_STORAGE,
        JSON.stringify(registros)
    );
}

function atualizarTotalRegistros() {
    totalRegistros.textContent = registros.length;
}

function abrirModal() {
    modal.classList.remove("hidden");
}

function fecharModal() {
    modal.classList.add("hidden");
    formEdicao.reset();
}

// Calcula diferença entre dois horários HH:MM
function calcularMinutos(inicio, fim) {
    if (!inicio || !fim) {
        return 0;
    }

    const [h1, m1] = inicio.split(":").map(Number);
    const [h2, m2] = fim.split(":").map(Number);

    return (h2 * 60 + m2) - (h1 * 60 + m1);
}

// Converte minutos em HH:MM
function formatarHoras(totalMinutos) {
    const sinal = totalMinutos < 0 ? "-" : "";
    const minutosAbs = Math.abs(totalMinutos);

    const horas = Math.floor(minutosAbs / 60);
    const minutos = minutosAbs % 60;

    return (
        sinal +
        String(horas).padStart(2, "0") +
        ":" +
        String(minutos).padStart(2, "0")
    );
}

// Calcula os campos automaticamente
function calcularResumo(registro) {
    const periodo1 = calcularMinutos(
        registro.entrada,
        registro.intervalo
    );

    const periodo2 = calcularMinutos(
        registro.retorno,
        registro.saida
    );

    const totalMinutos = periodo1 + periodo2;

    // Jornada padrão de 8 horas
    const jornadaPadrao = 8 * 60;
    const saldoMinutos =
        totalMinutos - jornadaPadrao;

    // Dias equivalentes (8h = 1 dia)
    const dias = (
        totalMinutos / jornadaPadrao
    ).toFixed(2);

    return {
        creditoDebito:
            saldoMinutos >= 0
                ? "+" + formatarHoras(saldoMinutos)
                : formatarHoras(saldoMinutos),

        totalHoras:
            formatarHoras(totalMinutos),

        transformacaoDias:
            `${dias} dias`,

        // Campo inicialmente vazio,
        // poderá ser preenchido manualmente
        previsaoCompensacao:
            registro.previsaoCompensacao || ""
    };
}


// EXCLUIR REGISTRO


function excluirRegistro(indice) {
    const confirmar = confirm(
        "Deseja realmente excluir este registro?"
    );

    if (!confirmar) {
        return;
    }

    registros.splice(indice, 1);

    salvarLocalStorage();
    renderizarTabela();

    alert("Registro excluído com sucesso!");
}

// EDITAR REGISTRO


function editarRegistro(indice) {
    const registro = registros[indice];

    if (!registro) {
        return;
    }

    // Recalcula os campos automáticos
    const resumo = calcularResumo(registro);

    indiceEdicao.value = indice;
    editNome.value = registro.nome || "";
    editCredito.value =
        registro.creditoDebito ||
        resumo.creditoDebito;
    editTotalHoras.value =
        registro.totalHoras ||
        resumo.totalHoras;
    editDias.value =
        registro.transformacaoDias ||
        resumo.transformacaoDias;
    editPrevisao.value =
        registro.previsaoCompensacao || "";
    editObservacao.value =
        registro.observacao || "";

    abrirModal();
}


// RENDERIZAÇÃO DA TABELA


function renderizarTabela() {
    // Recarrega dados atualizados
    registros =
        JSON.parse(
            localStorage.getItem(CHAVE_STORAGE)
        ) || [];

    atualizarTotalRegistros();
    tabela.innerHTML = "";

    if (registros.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="7" class="sem-dados">
                    Nenhum registro encontrado.
                </td>
            </tr>
        `;
        return;
    }

    registros.forEach((registro, indice) => {
        // Calcula os campos automaticamente
        const resumo = calcularResumo(registro);

        // Se já houver valores salvos manualmente,
        // utiliza-os; caso contrário, usa os calculados.
        const creditoDebito =
            registro.creditoDebito ||
            resumo.creditoDebito;

        const totalHoras =
            registro.totalHoras ||
            resumo.totalHoras;

        const transformacaoDias =
            registro.transformacaoDias ||
            resumo.transformacaoDias;

        const previsaoCompensacao =
            registro.previsaoCompensacao || "";

        tabela.innerHTML += `
            <tr>
                <td>${registro.nome || ""}</td>
                <td>${creditoDebito}</td>
                <td>${totalHoras}</td>
                <td>${transformacaoDias}</td>
                <td>${previsaoCompensacao}</td>
                <td>${registro.observacao || ""}</td>
                <td>
                    <button
                        type="button"
                        class="btn-editar"
                        onclick="editarRegistro(${indice})"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-excluir"
                        onclick="excluirRegistro(${indice})"
                    >
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

// SALVAR ALTERAÇÕES DO MODAL


if (formEdicao) {
    formEdicao.addEventListener(
        "submit",
        function (e) {
            e.preventDefault();

            const indice = Number(
                indiceEdicao.value
            );

            if (
                isNaN(indice) ||
                !registros[indice]
            ) {
                alert("Registro inválido.");
                return;
            }

            // Atualiza apenas os campos exibidos

            registros[indice] = {
                ...registros[indice],
                nome: editNome.value.trim(),
                creditoDebito:
                    editCredito.value.trim(),
                totalHoras:
                    editTotalHoras.value.trim(),
                transformacaoDias:
                    editDias.value.trim(),
                previsaoCompensacao:
                    editPrevisao.value.trim(),
                observacao:
                    editObservacao.value.trim()
            };

            salvarLocalStorage();
            fecharModal();
            renderizarTabela();

            alert(
                "Registro atualizado com sucesso!"
            );
        }
    );
}


// FECHAR MODAL AO CLICAR FORA


if (modal) {
    modal.addEventListener(
        "click",
        function (e) {
            if (e.target === modal) {
                fecharModal();
            }
        }
    );
}


// FUNÇÕES GLOBAIS


window.editarRegistro = editarRegistro;
window.excluirRegistro = excluirRegistro;
window.fecharModal = fecharModal;


// INICIALIZAÇÃO


renderizarTabela();