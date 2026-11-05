
// CARNE & CINZAS RPG
// Sistema de navegação - Versão 0.1

const telas = document.querySelectorAll(".tela");

const botoesMenu = document.querySelectorAll(
  "[data-destino]"
);

const botoesVoltar = document.querySelectorAll(
  ".voltar"
);

// Função para abrir uma tela
function abrirTela(id) {

  // Esconde todas as telas
  telas.forEach(function(tela) {
    tela.classList.add("escondido");
  });

  // Encontra a tela desejada
  const destino = document.getElementById(id);

  // Mostra a tela
  if (destino) {
    destino.classList.remove("escondido");
  }
}

// Eventos dos botões do menu
botoesMenu.forEach(function(botao) {

  botao.addEventListener("click", function() {

    const destino = botao.dataset.destino;

    abrirTela(destino);

  });

});

// Eventos dos botões de voltar
botoesVoltar.forEach(function(botao) {

  botao.addEventListener("click", function() {

    abrirTela("inicio");

  });

});

// CRIADOR DE SOBREVIVENTES
// Etapa 1: Identidade

const formulario = document.getElementById("form-personagem");
const resumo = document.getElementById("resumo-personagem");
const editar = document.getElementById("editar-personagem");

formulario.addEventListener("submit", function(evento) {

  // Impede que a página recarregue
  evento.preventDefault();

  // Coleta as informações preenchidas
  const nome = document.getElementById("nome").value.trim();
  const idade = document.getElementById("idade").value;
  const descricao = document.getElementById("descricao").value.trim();

  // Preenche o resumo
  document.getElementById("resumo-nome").textContent = nome;
  document.getElementById("resumo-idade").textContent = idade;
  document.getElementById("resumo-descricao").textContent =
    descricao || "Nenhuma descrição informada.";

 // Esconde a identidade e abre a escolha do Tipo
formulario.classList.add("escondido");
document.getElementById("etapa-tipo")
  .classList.remove("escondido");

});

editar.addEventListener("click", function() {

  resumo.classList.add("escondido");
  formulario.classList.remove("escondido");

});

// ==================================
// ETAPA 2: SELEÇÃO DE TIPO
// ==================================

const etapaTipo = document.getElementById("etapa-tipo");

const cartoesTipo = document.querySelectorAll(
  ".cartao-tipo"
);

const textoTipo = document.getElementById("tipo-escolhido");

const continuarTipo = document.getElementById("continuar-tipo");

const voltarIdentidade = document.getElementById(
  "voltar-identidade"
);

// Guarda a escolha do jogador
let tipoSelecionado = null;

// Seleção dos cartões
cartoesTipo.forEach(function(cartao) {

  cartao.addEventListener("click", function() {

    tipoSelecionado = cartao.dataset.tipo;

    // Remove a seleção anterior
    cartoesTipo.forEach(function(outroCartao) {
      outroCartao.classList.remove("selecionado");
      outroCartao.setAttribute("aria-pressed", "false");
    });

    // Marca o cartão escolhido
    cartao.classList.add("selecionado");
    cartao.setAttribute("aria-pressed", "true");

    textoTipo.textContent =
      "Tipo selecionado: " + tipoSelecionado;

    continuarTipo.disabled = false;

  });

});

// Voltar à identidade
voltarIdentidade.addEventListener("click", function() {

  etapaTipo.classList.add("escondido");
  formulario.classList.remove("escondido");

});

// Continuar após escolher o Tipo
continuarTipo.addEventListener("click", function() {

  if (!tipoSelecionado) {
    return;
  }

 etapaTipo.classList.add("escondido");

document.getElementById("etapa-arquetipo")
  .classList.remove("escondido");

  // Adiciona o Tipo ao resumo
  document.getElementById("resumo-tipo").textContent =
    tipoSelecionado;

});


// ==================================
// ETAPA 3: SELEÇÃO DE ARQUÉTIPO
// ==================================

const etapaArquetipo =
  document.getElementById("etapa-arquetipo");

const cartoesArquetipo =
  document.querySelectorAll(".cartao-arquetipo");

const textoArquetipo =
  document.getElementById("arquetipo-escolhido");

const continuarArquetipo =
  document.getElementById("continuar-arquetipo");

const voltarTipo =
  document.getElementById("voltar-tipo");

let arquetipoSelecionado = null;

// Selecionar Arquétipo
cartoesArquetipo.forEach(function(cartao) {

  cartao.setAttribute("aria-pressed", "false");

  cartao.addEventListener("click", function() {

    arquetipoSelecionado = cartao.dataset.arquetipo;

    cartoesArquetipo.forEach(function(outro) {
      outro.classList.remove("selecionado");
      outro.setAttribute("aria-pressed", "false");
    });

    cartao.classList.add("selecionado");
    cartao.setAttribute("aria-pressed", "true");

    textoArquetipo.textContent =
      "Arquétipo selecionado: " + arquetipoSelecionado;

    continuarArquetipo.disabled = false;

  });

});

// Voltar para escolher o Tipo
voltarTipo.addEventListener("click", function() {
  etapaArquetipo.classList.add("escondido");
  etapaTipo.classList.remove("escondido");
});

// Continuar para o resumo
continuarArquetipo.addEventListener("click", function() {

  if (!arquetipoSelecionado) {
    return;
  }

  document.getElementById("resumo-arquetipo").textContent =
    arquetipoSelecionado;

  etapaArquetipo.classList.add("escondido");
  resumo.classList.remove("escondido");

});
