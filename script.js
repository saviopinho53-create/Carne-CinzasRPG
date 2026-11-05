
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

  // Esconde o formulário e mostra o resumo
  formulario.classList.add("escondido");
  resumo.classList.remove("escondido");

});

editar.addEventListener("click", function() {

  resumo.classList.add("escondido");
  formulario.classList.remove("escondido");

});
