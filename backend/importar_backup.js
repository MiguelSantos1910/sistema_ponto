function importarBackup(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const backup = JSON.parse(e.target.result);

            if (backup.usuarios !== undefined) {
                localStorage.setItem(
                    "usuarios",
                    JSON.stringify(backup.usuarios)
                );
            }

            if (backup.usuarioLogado !== undefined) {
                localStorage.setItem(
                    "usuarioLogado",
                    JSON.stringify(backup.usuarioLogado)
                );
            }

            if (backup.oficineiros !== undefined) {
                localStorage.setItem(
                    "oficineiros",
                    JSON.stringify(backup.oficineiros)
                );
            }

            alert("Backup restaurado com sucesso!");
            window.location.reload();
        } catch (error) {
            alert("Arquivo de backup inválido.");
            console.error(error);
        }
    };

    reader.readAsText(arquivo);
}