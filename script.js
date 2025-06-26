
let dados = [];
let animaisFiltrados = [];
let atributos = [];
let atributoAtual = '';

fetch('zoo_dataset.csv')
    .then(response => response.text())
    .then(csv => {
        dados = parseCSV(csv);
        animaisFiltrados = [...dados];
        atributos = Object.keys(dados[0]).filter(attr => attr !== 'animais');
        proximaPergunta();
    });

function parseCSV(csv) {
    const linhas = csv.trim().split('\n');
    const cabecalho = linhas[0].split(',');

    return linhas.slice(1).map(linha => {
        const valores = linha.split(',');
        const obj = {};
        cabecalho.forEach((col, i) => {            
            obj[col] = i === 0 ? valores[i] : valores[i] === 'TRUE';
        });
        return obj;
    });
}

function escolherMelhoresAtributos() {
    const scores = atributos.map(attr => {
        const sim = animaisFiltrados.filter(a => a[attr]).length;
        const nao = animaisFiltrados.length - sim;
        const balanceamento = Math.min(sim, nao);
        return { attr, balanceamento };
    });

    scores.sort((a, b) => b.balanceamento - a.balanceamento);
    scoresReturned = [scores[0]?.attr, scores[1]?.attr].filter(Boolean)
    //console.log(scoresReturned);
    return scoresReturned;
}

function gerarTextoPergunta(attr) {
    const mapa = {
        mamifero: "É um mamífero?",
        ave: "É uma ave?",
        reptil: "É um réptil?",
        anfibio: "É um anfíbio?",
        carnivoro: "É carnívoro?",
        herbivoro: "É herbívoro?",
        pelos: "Possui pelos?",
        penas: "Possui penas?",
        escamas: "Possui escamas?",
        aquatico: "Vive em ambiente aquático?",
        terrestre: "Vive em ambiente terrestre?",
        aereo: "Vive no ambiente aéreo (voa)?",
        chifre: "Possui chifres?",
        presas: "Possui presas?",
        pescoco: "Tem pescoço alongado?",
        dentes: "Possui dentes?",
        ovos: "Bota ovos?",
        bipede: "É bípede?",
        venenoso: "É venenoso?",
        listras: "Possui listras?",
        cauda: "Possui cauda?",
    };
    return mapa[attr] || `Possui a característica ${attr}?`;
}

function proximaPergunta() {
    if (atributos.length === 0) {
        mostrarResultadoFinal();
        return;
    }

    if (animaisFiltrados.length <=1 ) {
        mostrarResultadoFinal();
        return;
    }

    const melhores = escolherMelhoresAtributos();

    if (melhores.length === 0) {
        mostrarResultadoFinal();
        return;
    }

    atributoAtual = melhores[Math.floor(Math.random() * melhores.length)];
    const texto = gerarTextoPergunta(atributoAtual);
    document.getElementById('pergunta').innerText = texto;
}


function responder(resposta) {
    if (resposta !== 'naosei') {
        const valor = resposta === 'sim';
        const antes = animaisFiltrados.length;
        animaisFiltrados = animaisFiltrados.filter(a => a[atributoAtual] === valor);
        const depois = animaisFiltrados.length;

        // Se a filtragem não reduziu o conjunto, o atributo é irrelevante
        if (antes === depois) {
            atributos = atributos.filter(attr => attr !== atributoAtual);
        }
    } else {
        // Usuário respondeu "não sei" → remover atributo da lista
        atributos = atributos.filter(attr => attr !== atributoAtual);
    }
    proximaPergunta();
}


function mostrarResultadoFinal() {
    document.getElementById('pergunta').innerText = '';

    if (animaisFiltrados.length === 0) {
        document.getElementById('resultado').innerText = 
            "😕 Não encontramos nenhum animal com essas características.";
    } else if (animaisFiltrados.length <= 3) {
        const nomes = animaisFiltrados.map(a => a.animais.toUpperCase()).join(', ');
        document.getElementById('resultado').innerText = 
            `🦁 Você não pode deixar de visitar: ${nomes}!`;
    } else {
        document.getElementById('resultado').innerText = 
            "😄 Parece que você não tem um animal preferido em particular, então divirta-se visitando todos!";
    }
}
