const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    alert("Nenhum usuário logado!");
    window.location.href = "../frontend/login.html";
}

const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const usuarioAtual = usuarios.find(u => u.usuario === usuarioLogado.usuario);
const pontos = usuarioAtual?.pontos || [];

// UTILITÁRIOS

function calcularHorasTrabalhadas(entrada, saida) {
    if (!entrada || !saida) return null;

    const [hE, mE, sE] = entrada.split(":").map(Number);
    const [hS, mS, sS] = saida.split(":").map(Number);

    const totalMinutos = (hS * 60 + mS) - (hE * 60 + mE);
    if (totalMinutos < 0) return null;

    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return { horas, minutos, totalMinutos };
}

function formatarHoras(horas, minutos) {
    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

function obterDataHoje() {
    return new Date().toLocaleDateString("pt-BR");
}

// HOJE

const hoje = obterDataHoje();
const pontoHoje = pontos.findLast(p => p.data === hoje);

// Resumo do dia
document.getElementById("entrada-dia").textContent = pontoHoje?.entrada || "--:--";
document.getElementById("saida-dia").textContent = pontoHoje?.saida || "--:--";

// Horas hoje
let hojeMinutos = 0;
if (pontoHoje?.entrada && pontoHoje?.saida) {
    const resultado = calcularHorasTrabalhadas(pontoHoje.entrada, pontoHoje.saida);
    if (resultado) {
        hojeMinutos = resultado.totalMinutos;
        document.getElementById("horas-hoje").textContent = formatarHoras(resultado.horas, resultado.minutos);
        document.getElementById("horas-dia").textContent = formatarHoras(resultado.horas, resultado.minutos);
    }
} else if (pontoHoje?.entrada && !pontoHoje?.saida) {
    document.getElementById("horas-hoje").textContent = "Em andamento";
    document.getElementById("horas-dia").textContent = "Em andamento";
}

// Status
const status = document.getElementById("status");
if (pontoHoje?.entrada && !pontoHoje?.saida) {
    status.textContent = "Em expediente 🟢";
    status.style.color = "#4CAF50";
} else if (pontoHoje?.saida) {
    status.textContent = "Expediente encerrado 🔴";
    status.style.color = "#f44336";
} else {
    status.textContent = "Fora do expediente ⚪";
}

// HISTÓRICO

const historicoBody = document.getElementById("historico-body");
historicoBody.innerHTML = "";

const CARGA_DIARIA = 8 * 60; // 8 horas em minutos

if (pontos.length === 0) {
    historicoBody.innerHTML = `
        <tr>
            <td colspan="4">Nenhum registro encontrado.</td>
        </tr>`;
} else {
    // Exibe do mais recente ao mais antigo
    [...pontos].reverse().forEach(ponto => {
        const resultado = calcularHorasTrabalhadas(ponto.entrada, ponto.saida);
        const horasTexto = resultado
            ? formatarHoras(resultado.horas, resultado.minutos)
            : ponto.saida ? "--" : "Em andamento";

        historicoBody.innerHTML += `
            <tr>
                <td>${ponto.data}</td>
                <td>${ponto.entrada || "--:--"}</td>
                <td>${ponto.saida || "--:--"}</td>
                <td>${horasTexto}</td>
            </tr>`;
    });
}

// BANCO DE HORAS

const CARGA_MENSAL = pontos.length * CARGA_DIARIA; // carga esperada com base nos dias registrados

let totalMinutosTrabalhados = 0;
let horasExtrasMin = 0;
let horasFaltantesMin = 0;

pontos.forEach(ponto => {
    if (ponto.entrada && ponto.saida) {
        const resultado = calcularHorasTrabalhadas(ponto.entrada, ponto.saida);
        if (resultado) {
            totalMinutosTrabalhados += resultado.totalMinutos;
            const diff = resultado.totalMinutos - CARGA_DIARIA;
            if (diff > 0) horasExtrasMin += diff;
            else horasFaltantesMin += Math.abs(diff);
        }
    }
});

const saldoMinutos = totalMinutosTrabalhados - (pontos.filter(p => p.saida).length * CARGA_DIARIA);
const saldoPositivo = saldoMinutos >= 0;
const saldoFormatado = formatarHoras(Math.floor(Math.abs(saldoMinutos) / 60), Math.abs(saldoMinutos) % 60);

document.getElementById("saldo-horas").textContent = `${saldoPositivo ? "+" : "-"}${saldoFormatado}`;
document.getElementById("saldo-atual").textContent = `${saldoPositivo ? "+" : "-"}${saldoFormatado}`;
document.getElementById("horas-extras").textContent = formatarHoras(Math.floor(horasExtrasMin / 60), horasExtrasMin % 60);
document.getElementById("horas-faltantes").textContent = formatarHoras(Math.floor(horasFaltantesMin / 60), horasFaltantesMin % 60);

// TOTAL REGISTROS

document.getElementById("total-registros").textContent = pontos.length;

// ALERTAS

const alertasUl = document.querySelector(".alertas ul");
const alertas = [];

if (pontoHoje?.entrada && !pontoHoje?.saida) {
    alertas.push("⚠️ Você ainda não registrou sua saída hoje.");
}
if (!pontoHoje) {
    alertas.push("⚠️ Nenhum ponto registrado hoje.");
}
if (horasFaltantesMin > 0) {
    alertas.push(`⚠️ Você tem ${formatarHoras(Math.floor(horasFaltantesMin / 60), horasFaltantesMin % 60)} de horas faltantes.`);
}

alertasUl.innerHTML = alertas.length > 0
    ? alertas.map(a => `<li>${a}</li>`).join("")
    : "<li>Nenhum alerta no momento. ✅</li>";

// GRÁFICO

function gerarUltimos7Dias() {
    const dias = [];
    for (let i = 6; i >= 0; i--) {
        const data = new Date();
        data.setDate(data.getDate() - i);
        dias.push(data.toLocaleDateString("pt-BR"));
    }
    return dias;
}

const ultimos7Dias = gerarUltimos7Dias();

const dadosGrafico = ultimos7Dias.map(dia => {
    const ponto = pontos.findLast(p => p.data === dia);
    if (ponto?.entrada && ponto?.saida) {
        const resultado = calcularHorasTrabalhadas(ponto.entrada, ponto.saida);
        return resultado ? parseFloat((resultado.totalMinutos / 60).toFixed(2)) : 0;
    }
    return 0;
});

const ctx = document.getElementById("grafico-horas").getContext("2d");

new Chart(ctx, {
    type: "bar",
    data: {
        labels: ultimos7Dias,
        datasets: [{
            label: "Horas Trabalhadas",
            data: dadosGrafico,
            backgroundColor: dadosGrafico.map(h => {
                if (h === 0) return "#e0e0e0";        // sem registro
                if (h >= 8) return "#4CAF50";         // meta batida
                if (h >= 6) return "#FFC107";         // quase lá
                return "#f44336";                      // abaixo do esperado
            }),
            borderRadius: 6,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const horas = Math.floor(context.raw);
                        const minutos = Math.round((context.raw - horas) * 60);
                        return `${formatarHoras(horas, minutos)}h trabalhadas`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                ticks: {
                    callback: value => `${value}h`
                },
                grid: {
                    color: "#f0f0f0"
                }
            },
            x: {
                grid: { display: false }
            }
        }
    }
});