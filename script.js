
const botoes = document.querySelectorAll(".opcao");
const mensagem = document.getElementById("mensagem");

botoes.forEach(function(botao) {
  botao.addEventListener("click", function() {
    const tela = botao.dataset.tela;

    mensagem.textContent =
      "Abrindo a área de " + tela + "...";
  });
});
