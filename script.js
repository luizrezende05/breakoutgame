const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const raiodaBola = 10;
const larguradaRaquete = 120;
const alturadaRaquete = 10;
const linhasdosBlocos = 6;
const colunasdosBlocos = 10;
const larguradoBloco = 70;
const alturadoBloco = 20;
const espacamentodosBlocos = 10;
const margemSuperiordosBlocos = 50;

const larguraTotaldosBlocos = colunasdosBlocos * (larguradoBloco + espacamentodosBlocos) - espacamentodosBlocos;
const margemEsquerdadosBlocos = (canvas.width - larguraTotaldosBlocos) / 2;

let posicaoXBola = canvas.width / 2;
let posicaoYBola = canvas.height - 30;
let velocidadeXBola = 5;
let velocidadeYBola = -5;
let posicaoXRaquete = (canvas.width - larguradaRaquete) / 2;
let setaDireitaPressionada = false;
let setaEsquerdaPressionada = false;
let pontuacao = 0;
let jogoAcabou = false;
let idAnimacao;
const blocos = [];
for (let c = 0; c < colunasdosBlocos; c++) {
    blocos[c] = [];
    for (let r = 0; r < linhasdosBlocos; r++) {
        blocos[c][r] = { x: 0, y: 0, status: 1 };
    }
}
function bola() {
    ctx.beginPath();
    ctx.arc(posicaoXBola, posicaoYBola, raiodaBola, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}
function raquete() {
    ctx.beginPath();
    ctx.rect(posicaoXRaquete, canvas.height - alturadaRaquete, larguradaRaquete, alturadaRaquete);
    ctx.fillStyle = "#FA4900";
    ctx.fill();
    ctx.closePath();
}
function desenharBlocos() {
    for (let c = 0; c < colunasdosBlocos; c++) {
        for (let r = 0; r < linhasdosBlocos; r++) {
            if (blocos[c][r].status === 1) {
                const posicaoXBloco = c * (larguradoBloco + espacamentodosBlocos) + margemEsquerdadosBlocos;
                const posicaoYBloco = r * (alturadoBloco + espacamentodosBlocos) + margemSuperiordosBlocos;
                blocos[c][r].x = posicaoXBloco;
                blocos[c][r].y = posicaoYBloco;
                ctx.beginPath();
                ctx.rect(posicaoXBloco, posicaoYBloco, larguradoBloco, alturadoBloco);
                ctx.fillStyle = "#F58251";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function colisao() {
    for (let c = 0; c < colunasdosBlocos; c++) {
        for (let r = 0; r < linhasdosBlocos; r++) {
            const bloco = blocos[c][r];
            if (bloco.status === 1) {
                if (
                    posicaoXBola > bloco.x &&
                    posicaoXBola < bloco.x + larguradoBloco &&
                    posicaoYBola > bloco.y &&
                    posicaoYBola < bloco.y + alturadoBloco
                ) {
                    velocidadeYBola = -velocidadeYBola;
                    bloco.status = 0;
                    pontuacao++;
                    document.getElementById('score').textContent = `Pontuação: ${pontuacao}`;
                    if (pontuacao === linhasdosBlocos * colunasdosBlocos) {
                        jogoAcabou = true;
                        document.getElementById('gameOverMessage').textContent = 'Você venceu!';
                        document.getElementById('gameOver').style.display = 'flex';
                        cancelAnimationFrame(idAnimacao);
                    }
                }
            }
        }
    }
}
function atualizabola() {
    if (posicaoXBola + velocidadeXBola > canvas.width - raiodaBola || posicaoXBola + velocidadeXBola < raiodaBola) {
        velocidadeXBola = -velocidadeXBola;
    }
    if (posicaoYBola + velocidadeYBola < raiodaBola) {
        velocidadeYBola = -velocidadeYBola;
    } else if (posicaoYBola + velocidadeYBola > canvas.height - raiodaBola) {
        if (posicaoXBola > posicaoXRaquete && posicaoXBola < posicaoXRaquete + larguradaRaquete) {
            velocidadeYBola = -velocidadeYBola;
        } else {
            jogoAcabou = true;
            document.getElementById('gameOverMessage').textContent = 'Game Over!';
            document.getElementById('gameOver').style.display = 'flex';
            cancelAnimationFrame(idAnimacao);
        }
    }
    posicaoXBola += velocidadeXBola;
    posicaoYBola += velocidadeYBola;
}
function atualizaraquete() {
    if (setaDireitaPressionada && posicaoXRaquete < canvas.width - larguradaRaquete) {
        posicaoXRaquete += 7;
    } else if (setaEsquerdaPressionada && posicaoXRaquete > 0) {
        posicaoXRaquete -= 7;
    }
}
function Loop() {
    if (jogoAcabou) {
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bola();
    raquete();
    desenharBlocos();
    colisao();
    atualizabola();
    atualizaraquete();
    idAnimacao = requestAnimationFrame(Loop);
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        setaDireitaPressionada = true;
    } else if (e.key === 'ArrowLeft') {
        setaEsquerdaPressionada = true;
    }
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') {
        setaDireitaPressionada = false;
    } else if (e.key === 'ArrowLeft') {
        setaEsquerdaPressionada = false;
    }
});
document.getElementById('restartButton').addEventListener('click', () => {
    document.getElementById('gameOver').style.display = 'none';
    reset();
});
function reset() {
    posicaoXBola = canvas.width / 2;
    posicaoYBola = canvas.height - 30;
    velocidadeXBola = 5;
    velocidadeYBola = -5;
    posicaoXRaquete = (canvas.width - larguradaRaquete) / 2;
    pontuacao = 0;
    jogoAcabou = false;
    document.getElementById('score').textContent = `Pontuação: ${pontuacao}`;
    for (let c = 0; c < colunasdosBlocos; c++) {
        for (let r = 0; r < linhasdosBlocos; r++) {
            blocos[c][r].status = 1;
        }
    }
    Loop();
}
Loop();