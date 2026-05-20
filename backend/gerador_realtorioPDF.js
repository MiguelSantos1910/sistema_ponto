const { jsPDF } = window.jspdf;

// =============================
// Funções auxiliares
// =============================

function adicionarCabecalho(doc, titulo) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(titulo, 105, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
        `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
        14,
        30
    );

    doc.line(14, 34, 196, 34);
}

function adicionarRodape(doc) {
    const totalPaginas = doc.getNumberOfPages();

    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(
            `Página ${i} de ${totalPaginas}`,
            105,
            290,
            { align: "center" }
        );
    }
}

function formatarData(data) {
    if (!data) return "";
    if (data.includes("/")) return data;

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

function verificarNovaPagina(doc, y) {
    if (y > 270) {
        doc.addPage();
        return 20;
    }
    return y;
}

// =============================
// Relatório de Funcionários
// =============================

function gerarRelatorioFuncionarios() {
    const registros =
        JSON.parse(localStorage.getItem("funcionarios")) || [];

    if (registros.length === 0) {
        alert("Nenhum registro de funcionários encontrado.");
        return;
    }

    const doc = new jsPDF();
    adicionarCabecalho(doc, "Relatório de Funcionários");

    let y = 45;

    registros.forEach((registro, index) => {
        y = verificarNovaPagina(doc, y);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${registro.nome || ""}`, 14, y);

        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        const linhas = [
            `Atividade: ${registro.atividade || ""}`,
            `Data: ${formatarData(registro.data)}`,
            `Entrada: ${registro.entrada || ""}`,
            `Intervalo: ${registro.intervalo || ""}`,
            `Retorno: ${registro.retorno || ""}`,
            `Saída: ${registro.saida || ""}`,
            `Situação: ${registro.situacao || ""}`,
            `Observação: ${registro.observacao || ""}`
        ];

        linhas.forEach((linha) => {
            y = verificarNovaPagina(doc, y);
            doc.text(linha, 18, y);
            y += 5;
        });

        y += 5;
        doc.line(14, y, 196, y);
        y += 8;
    });

    adicionarRodape(doc);
    doc.save("relatorio_funcionarios.pdf");
}

// =============================
// Relatório de Oficineiros
// =============================

function gerarRelatorioOficineiros() {
    const registros =
        JSON.parse(localStorage.getItem("oficineiros")) || [];

    if (registros.length === 0) {
        alert("Nenhum registro de oficineiros encontrado.");
        return;
    }

    const doc = new jsPDF();
    adicionarCabecalho(doc, "Relatório de Oficineiros");

    let y = 45;

    registros.forEach((registro, index) => {
        y = verificarNovaPagina(doc, y);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${registro.nome || ""}`, 14, y);

        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        const linhas = [
            `Matrícula: ${registro.matricula || ""}`,
            `Atividade: ${registro.atividade || ""}`,
            `Data: ${formatarData(registro.data)}`,
            `Entrada: ${registro.entrada || ""}`,
            `Intervalo: ${registro.intervalo || ""}`,
            `Retorno: ${registro.retorno || ""}`,
            `Saída: ${registro.saida || ""}`,
            `Situação: ${registro.situacao || ""}`,
            `Observação: ${registro.observacao || ""}`
        ];

        linhas.forEach((linha) => {
            y = verificarNovaPagina(doc, y);
            doc.text(linha, 18, y);
            y += 5;
        });

        y += 5;
        doc.line(14, y, 196, y);
        y += 8;
    });

    adicionarRodape(doc);
    doc.save("relatorio_oficineiros.pdf");
}