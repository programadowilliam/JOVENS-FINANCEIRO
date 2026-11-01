//FASES CRIADAS, INTELIGADO COM CSS (style.css) EFEITOS  
// X=LADOS (QUANTO MENOR O Ñ MAIS PRA ESQUERDA) 
//  Y= CIMA/BAIXO  (QUANTO MENOR Ñ MAIS PARA CIMA)

const fasesDoJogo = [
    { id: 1, icone: '🎯', titulo: 'Introdução à Sobrevivência Financeira', link: 'PAGINAS/NIVEIS/1.html', x: 240, y: 160 },
    { id: 2, icone: '🛒', titulo: 'Necessidade vs Desejo', link: 'PAGINAS/NIVEIS/2.html', x: 280, y: 315 },
    { id: 3, icone: '🤯', titulo: 'Golpe Financeiro', link: 'PAGINAS/NIVEIS/3.html', x: 190, y: 460 },
    { id: 4, icone: '🐷', titulo: 'Uma Regrinha', link: 'PAGINAS/NIVEIS/4.html', x: 280, y: 610 },
    { id: 5, icone: '📈', titulo: 'Primeiros Investimentos', link: 'PAGINAS/NIVEIS/5.html', x: 240, y: 760 }
];

// 2. Executa a montagem do mapa assim que a página abre
document.addEventListener("DOMContentLoaded", () => {
    montarMapaTrilha();
});

function montarMapaTrilha() {
    const nodesLayer = document.getElementById('nodesLayer');
    if (!nodesLayer) return;

    // Limpa o mapa para não duplicar elementos
    nodesLayer.innerHTML = '';

    fasesDoJogo.forEach((fase) => {
        // Pega os status de progresso direto da memória do navegador
        const estaConcluida = localStorage.getItem(`fase_${fase.id}_concluida`) === 'true';
        
        // Regra de Liberação: A fase 1 inicia aberta. As outras abrem se a anterior foi concluída.
        let estaLiberada = false;
        if (fase.id === 1) {
            estaLiberada = true;
        } else {
            const anteriorConcluida = localStorage.getItem(`fase_${fase.id - 1}_concluida`) === 'true';
            if (anteriorConcluida) {
                estaLiberada = true;
            }
        }

        // 3. Criação do elemento container da fase (.phase-node)
        const nodeContainer = document.createElement('div');
        nodeContainer.className = 'phase-node';
        
        // Define o estado baseado no progresso para bater com o seu style.css
        if (estaConcluida) {
            nodeContainer.classList.add('completed');
        } else if (estaLiberada) {
            nodeContainer.classList.add('active-stage'); // Ativa a animação de pulo branca
        } else {
            nodeContainer.classList.add('locked');
        }

        // Posiciona a fase nas coordenadas corretas em cima da linha guia
        nodeContainer.style.position = 'absolute';
        nodeContainer.style.left = `${(fase.x / 480) * 100}%`; // 480 = largura base do mapa (mesmo do viewBox do SVG)
        nodeContainer.style.top = `${fase.y}px`;
        nodeContainer.style.transform = 'translate(-50%, -50%)';

        // 4. Cria o botão mecânico 3D interno
        const botao = document.createElement('button');
        botao.className = 'node-btn';
        botao.innerHTML = fase.icone;

        // Gerencia a ação de clique do botão
        if (estaLiberada || estaConcluida) {
            botao.onclick = () => dispararModalFase(fase);
        } else {
            botao.disabled = true;
            botao.onclick = () => {
                alert('Bloqueado! Complete a fase anterior primeiro.');
            };
        }

        // Junta as peças e joga na tela
        nodeContainer.appendChild(botao);
        nodesLayer.appendChild(nodeContainer);
    });
}

// 5. Controla a abertura do Modal com os dados dinâmicos da fase clicada
function dispararModalFase(fase) {
    const modal = document.getElementById('quizModal');
    const quizText = document.getElementById('quizText');
    const btnConfirmar = document.querySelector('.btn-action.correct');

    if (modal && quizText && btnConfirmar) {
        // Customiza o texto com o título real da fase
        quizText.innerHTML = `Você vai entrar na <strong>Fase ${fase.id}: ${fase.titulo}</strong>.<br>Prepare-se para o desafio!`;
        
        // Atualiza a rota do botão para ir direto ao arquivo específico dela (ex: 1.html, 2.html)
        btnConfirmar.onclick = () => {
            window.location.href = fase.link;
        };

        // Torna o modal visível na tela mudando o display de none para flex
        modal.style.display = 'flex';
    }
}

// Função para fechar o Modal caso o usuário queira desistir
function closeQuiz() {
    const modal = document.getElementById('quizModal');
    if (modal) {
        modal.style.display = 'none';
    }
}
