function exportarBackup() {
    const backup = {
        usuarios: JSON.parse(localStorage.getItem("usuarios")) || [],
        usuarioLogado: JSON.parse(localStorage.getItem("usuarioLogado")) || null,
        oficineiros: JSON.parse(localStorage.getItem("oficineiros")) || []
    };

    const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    const dataAtual = new Date().toISOString().split("T")[0];
    link.download = `backup_sistema_ponto_${dataAtual}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    alert("Backup exportado com sucesso!");
}
