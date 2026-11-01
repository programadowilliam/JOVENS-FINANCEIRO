// Definição das fases e seus conteúdos
const listaFases = [
    { id: 1, x: 240, y: 180, icon: "🎯", titulo: "Fase 1: O que fazer ao receber seu primeiro salário?" },
    { id: 2, x: 290, y: 270, icon: "🛒", titulo: "Fase 2: Diferença prática entre Desejo vs. Necessidade." },
    { id: 3, x: 240, y: 360, icon: "💳", titulo: "Fase 3: Sobrevivendo aos juros do Cartão de Crédito." },
    { id: 4, x: 190, y: 460, icon: "🐷", titulo: "Fase 4: Montando sua primeira reserva de emergência." },
    { id: 5, x: 240, y: 560, icon: "📈", titulo: "Fase 5: O básico de investimentos em renda fixa." },
    { id: 6, x: 290, y: 660, icon: "🛡️", titulo: "Fase 6: Evitando golpes financeiros na internet." }
];

let faseAtualDoUsuario = 1; // Guarda qual id de fase está ativa para fazer
let xpTotal = 0;
let diasStreak = 0;

document.addEventListener("DOMContentLoaded", () => {
    // Carrega dados salvos anteriormente, se houver
    if(localStorage.getItem("granaUp_faseAtual")) {
        faseAtualDoUsuario = parseInt(localStorage.getItem("granaUp_faseAtual"), 10);
        xpTotal = parseInt(localStorage.getItem("granaUp_xp"), 10) || 0;
        diasStreak = parseInt(localStorage.getItem("granaUp_streak"), 10) || 0;
    } else {
        // Inicialização padrão para novos usuários
        faseAtualDoUsuario = 1;
        xpTotal = 0;
        diasStreak = 1;
        salvarDadosNoNavegador();
    }

    atualizarPlacarInterface();
    renderizarMapaDeFases();
    configurarSistemaDeArrastar();
});

// Monta as fases visualmente na tela de acordo com o progresso atual
function renderizarMapaDeFases() {
    const container = document.getElementById("nodesLayer");
    container.innerHTML = ""; // Limpa o mapa anterior

    listaFases.forEach((fase) => {
        const divNo = document.createElement("div");
        divNo.className = "phase-node";
        divNo.style.left = `calc(${fase.x}px - 30px)`;
        divNo.style.top = `${fase.y}px`;

        const botao = document.createElement("button");
        botao.className = "node-btn";

        // Lógica de Estados das Cores pedida por você
        if (fase.id < faseAtualDoUsuario) {
            // Caso 1: Já completou (Fica Verde com ✓)
            divNo.classList.add("completed");
            botao.innerHTML = "✓";
            botao.onclick = () => alert("Você já dominou essa lição!");
        } else if (fase.id === faseAtualDoUsuario) {
            // Caso 2: É a fase da vez (Fica Branca e ativa para interagir)
            divNo.classList.add("active-stage");
            botao.innerHTML = fase.icon;
            botao.onclick = () => openQuizModal(fase);
        } else {
            // Caso 3: Próximas fases trancadas (Ficam em Cinza)
            divNo.classList.add("locked");
            botao.innerHTML = fase.icon;
            botao.setAttribute("disabled", "true");
        }

        divNo.appendChild(botao);
        container.appendChild(divNo);
    });
}

// Abre o pop-up simulando o exercício ao clicar no botão Branco
function openQuizModal(fase) {
    const modal = document.getElementById("quizModal");
    const texto = document.getElementById("quizText");
    texto.innerHTML = `<strong>${fase.titulo}</strong><br><br>Gaste menos do que ganha e invista a diferença para concluir este nível com sucesso!`;
    modal.style.display = "flex";
}

function closeQuiz() {
    document.getElementById("quizModal").style.display = "none";
}

// Executado ao clicar no botão de concluir o exercício dentro da modal
function completeCurrentStage() {
    closeQuiz();
    
    // Avança para o próximo nível
    faseAtualDoUsuario += 1;
    xpTotal += 20;
    
    // Se o usuário passar da última fase criada, reseta para demonstração contínua
    if (faseAtualDoUsuario > listaFases.length) {
        alert("🎉 Parabéns! Você concluiu toda a trilha básica! Vamos reiniciar a jornada com novos desafios.");
        faseAtualDoUsuario = 1;
    }

    salvarDadosNoNavegador();
    atualizarPlacarInterface();
    renderizarMapaDeFases(); // Atualiza as cores na tela instantaneamente
}

function salvarDadosNoNavegador() {
    localStorage.setItem("granaUp_faseAtual", faseAtualDoUsuario);
    localStorage.setItem("granaUp_xp", xpTotal);
    localStorage.setItem("granaUp_streak", diasStreak);
}

function atualizarPlacarInterface() {
    document.getElementById("xpCount").innerText = xpTotal;
    document.getElementById("streakCount").innerText = diasStreak;
}

// Mantém o comportamento de rolar arrastando com o mouse
function configurarSistemaDeArrastar() {
    const viewport = document.getElementById("mapViewport");
    let isDown = false; let startY; let scrollTop;

    // Recupera o posicionamento de scroll anterior se houver
    const posAnterior = localStorage.getItem("granaUp_scrollPos");
    if (posAnterior) viewport.scrollTop = parseInt(posAnterior, 10);

    viewport.addEventListener("scroll", () => {
        localStorage.setItem("granaUp_scrollPos", viewport.scrollTop);
    });

    viewport.addEventListener("mousedown", (e) => {
        isDown = true;
        startY = e.pageY - viewport.offsetTop;
        scrollTop = viewport.scrollTop;
    });
    viewport.addEventListener("mouseleave", () => isDown = false);
    viewport.addEventListener("mouseup", () => isDown = false);
    viewport.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const y = e.pageY - viewport.offsetTop;
        const walkY = (y - startY) * 1.5;
        viewport.scrollTop = scrollTop - walkY;
    });
}
