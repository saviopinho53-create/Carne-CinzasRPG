
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
