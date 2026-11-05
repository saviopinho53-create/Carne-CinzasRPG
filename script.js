
"use strict";

// ==========================================
// CARNE & CINZAS RPG
// CRIADOR DE SOBREVIVENTES - V0.2
// ==========================================

// ==========================================
// 1. NAVEGAÇÃO
// ==========================================

const telas = document.querySelectorAll(".tela");
const botoesMenu = document.querySelectorAll("[data-destino]");
const botoesVoltar = document.querySelectorAll(".voltar");

function abrirTela(id) {
  telas.forEach(function(tela) {
    tela.classList.add("escondido");
  });

  const destino = document.getElementById(id);

  if (destino) {
    destino.classList.remove("escondido");
  }
}

botoesMenu.forEach(function(botao) {
  botao.addEventListener("click", function() {
    abrirTela(botao.dataset.destino);
  });
});

botoesVoltar.forEach(function(botao) {
  botao.addEventListener("click", function() {
    abrirTela("inicio");
  });
});

// ==========================================
// 2. ELEMENTOS DO CRIADOR
// ==========================================

const formulario = document.getElementById("form-personagem");
const resumo = document.getElementById("resumo-personagem");
const editar = document.getElementById("editar-personagem");

const etapaTipo = document.getElementById("etapa-tipo");
const etapaArquetipo = document.getElementById("etapa-arquetipo");
const etapaAtributos = document.getElementById("etapa-atributos");

const cartoesTipo = document.querySelectorAll(".cartao-tipo");
const cartoesArquetipo = document.querySelectorAll(".cartao-arquetipo");

const textoTipo = document.getElementById("tipo-escolhido");
const textoArquetipo = document.getElementById("arquetipo-escolhido");

const continuarTipo = document.getElementById("continuar-tipo");
const continuarArquetipo = document.getElementById("continuar-arquetipo");
const continuarAtributos = document.getElementById("continuar-atributos");

const voltarIdentidade = document.getElementById("voltar-identidade");
const voltarTipo = document.getElementById("voltar-tipo");
const voltarArquetipo = document.getElementById("voltar-arquetipo");

const pontosRestantes = document.getElementById("pontos-restantes");
const reiniciarAtributos = document.getElementById("reiniciar-atributos");

const botaoSalvar = document.getElementById("salvar-personagem");
const cancelarEdicao = document.getElementById("cancelar-edicao");
const mensagemSalvamento = document.getElementById("mensagem-salvamento");

// ==========================================
// 3. ESTADO DO PERSONAGEM
// ==========================================

const CHAVE_SALVAMENTO = "carneCinzas_personagem_v1";

const TOTAL_PONTOS = 6;
const MAX_ATRIBUTO = 3;
const MIN_ATRIBUTO = 0;

const valoresIniciais = {
  corpo: 3,
  mente: 2,
  vontade: 1,
  aparencia: 0
};

let atributos = { ...valoresIniciais };

let tipoSelecionado = null;
let arquetipoSelecionado = null;

let personagemSalvo = null;
let editandoPersonagemSalvo = false;

// ==========================================
// 4. FUNÇÕES AUXILIARES
// ==========================================

function mostrarEtapa(elemento) {
  [
    formulario,
    etapaTipo,
    etapaArquetipo,
    etapaAtributos,
    resumo
  ].forEach(function(etapa) {
    etapa.classList.add("escondido");
  });

  elemento.classList.remove("escondido");
}

function mostrarMensagem(texto) {
  mensagemSalvamento.textContent = texto;
}

function pontosUsados() {
  return Object.values(atributos).reduce(function(total, valor) {
    return total + valor;
  }, 0);
}

function atributosValidos(valores) {
  if (!valores || typeof valores !== "object") {
    return false;
  }

  const nomes = ["corpo", "mente", "vontade", "aparencia"];

  const validos = nomes.every(function(nome) {
    return Number.isInteger(valores[nome]) &&
      valores[nome] >= MIN_ATRIBUTO &&
      valores[nome] <= MAX_ATRIBUTO;
  });

  if (!validos) {
    return false;
  }

  return nomes.reduce(function(total, nome) {
    return total + valores[nome];
  }, 0) === TOTAL_PONTOS;
}

function preencherResumo(personagem) {
  document.getElementById("resumo-nome").textContent =
    personagem.nome;

  document.getElementById("resumo-idade").textContent =
    personagem.idade;

  document.getElementById("resumo-descricao").textContent =
    personagem.descricao || "Nenhuma descrição informada.";

  document.getElementById("resumo-tipo").textContent =
    personagem.tipo;

  document.getElementById("resumo-arquetipo").textContent =
    personagem.arquetipo;

  document.getElementById("resumo-corpo").textContent =
    personagem.atributos.corpo;

  document.getElementById("resumo-mente").textContent =
    personagem.atributos.mente;

  document.getElementById("resumo-vontade").textContent =
    personagem.atributos.vontade;

  document.getElementById("resumo-aparencia").textContent =
    personagem.atributos.aparencia;
}

function preencherFormulario(personagem) {
  document.getElementById("nome").value = personagem.nome;
  document.getElementById("idade").value = personagem.idade;
  document.getElementById("descricao").value =
    personagem.descricao || "";
}

function atualizarEstadoSalvamento() {
  botaoSalvar.textContent = personagemSalvo
    ? "Sobrevivente salvo"
    : "Salvar Sobrevivente";

  botaoSalvar.disabled = personagemSalvo !== null;
}

// ==========================================
// 5. ETAPA 1: IDENTIDADE
// ==========================================

formulario.addEventListener("submit", function(evento) {
  evento.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const idade = document.getElementById("idade").value;
  const descricao = document.getElementById("descricao").value.trim();

  if (!nome || !idade) {
    return;
  }

  // Edição de um personagem já salvo
  if (editandoPersonagemSalvo && personagemSalvo) {
    const atualizado = {
      ...personagemSalvo,
      nome: nome,
      idade: idade,
      descricao: descricao
    };

    if (gravarPersonagem(atualizado)) {
      personagemSalvo = atualizado;
      preencherResumo(personagemSalvo);

      editandoPersonagemSalvo = false;
      cancelarEdicao.classList.add("escondido");

      mostrarEtapa(resumo);
      mostrarMensagem("Informações atualizadas com sucesso!");
    }

    return;
  }

  // Primeira criação
  document.getElementById("resumo-nome").textContent = nome;
  document.getElementById("resumo-idade").textContent = idade;
  document.getElementById("resumo-descricao").textContent =
    descricao || "Nenhuma descrição informada.";

  mostrarEtapa(etapaTipo);
});

// Editar personagem
editar.addEventListener("click", function() {
  if (personagemSalvo) {
    editandoPersonagemSalvo = true;

    preencherFormulario(personagemSalvo);

    cancelarEdicao.classList.remove("escondido");
    mostrarEtapa(formulario);

    return;
  }

  // Antes do primeiro salvamento
  editandoPersonagemSalvo = false;
  cancelarEdicao.classList.add("escondido");

  mostrarEtapa(formulario);
});

// Cancelar edição de personagem salvo
cancelarEdicao.addEventListener("click", function() {
  if (!personagemSalvo) {
    return;
  }

  preencherFormulario(personagemSalvo);

  editandoPersonagemSalvo = false;
  cancelarEdicao.classList.add("escondido");

  mostrarEtapa(resumo);
});

// ==========================================
// 6. ETAPA 2: TIPO
// ==========================================

cartoesTipo.forEach(function(cartao) {
  cartao.setAttribute("aria-pressed", "false");

  cartao.addEventListener("click", function() {
    if (personagemSalvo) {
      return;
    }

    tipoSelecionado = cartao.dataset.tipo;

    cartoesTipo.forEach(function(outro) {
      outro.classList.remove("selecionado");
      outro.setAttribute("aria-pressed", "false");
    });

    cartao.classList.add("selecionado");
    cartao.setAttribute("aria-pressed", "true");

    textoTipo.textContent =
      "Tipo selecionado: " + tipoSelecionado;

    continuarTipo.disabled = false;
  });
});

voltarIdentidade.addEventListener("click", function() {
  if (personagemSalvo) {
    return;
  }

  mostrarEtapa(formulario);
});

continuarTipo.addEventListener("click", function() {
  if (!tipoSelecionado || personagemSalvo) {
    return;
  }

  document.getElementById("resumo-tipo").textContent =
    tipoSelecionado;

  mostrarEtapa(etapaArquetipo);
});

// ==========================================
// 7. ETAPA 3: ARQUÉTIPO
// ==========================================

cartoesArquetipo.forEach(function(cartao) {
  cartao.setAttribute("aria-pressed", "false");

  cartao.addEventListener("click", function() {
    if (personagemSalvo) {
      return;
    }

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

voltarTipo.addEventListener("click", function() {
  if (personagemSalvo) {
    return;
  }

  mostrarEtapa(etapaTipo);
});

continuarArquetipo.addEventListener("click", function() {
  if (!arquetipoSelecionado || personagemSalvo) {
    return;
  }

  document.getElementById("resumo-arquetipo").textContent =
    arquetipoSelecionado;

  mostrarEtapa(etapaAtributos);
});

// ==========================================
// 8. ETAPA 4: ATRIBUTOS
// ==========================================

function atualizarAtributos() {
  const restantes = TOTAL_PONTOS - pontosUsados();

  pontosRestantes.textContent = restantes;

  document.querySelectorAll(".cartao-atributo")
    .forEach(function(cartao) {
      const nome = cartao.dataset.atributo;
      const valor = atributos[nome];

      const textoValor =
        cartao.querySelector(".valor-atributo");

      const diminuir =
        cartao.querySelector(".diminuir");

      const aumentar =
        cartao.querySelector(".aumentar");

      textoValor.textContent = valor;

      diminuir.disabled =
        personagemSalvo !== null ||
        valor <= MIN_ATRIBUTO;

      aumentar.disabled =
        personagemSalvo !== null ||
        valor >= MAX_ATRIBUTO ||
        restantes === 0;
    });

  continuarAtributos.disabled =
    personagemSalvo !== null || restantes !== 0;
}

document.querySelectorAll(".cartao-atributo")
  .forEach(function(cartao) {
    const nome = cartao.dataset.atributo;

    const diminuir =
      cartao.querySelector(".diminuir");

    const aumentar =
      cartao.querySelector(".aumentar");

    diminuir.addEventListener("click", function() {
      if (personagemSalvo) {
        return;
      }

      if (atributos[nome] > MIN_ATRIBUTO) {
        atributos[nome]--;
        atualizarAtributos();
      }
    });

    aumentar.addEventListener("click", function() {
      if (personagemSalvo) {
        return;
      }

      if (
        atributos[nome] < MAX_ATRIBUTO &&
        pontosUsados() < TOTAL_PONTOS
      ) {
        atributos[nome]++;
        atualizarAtributos();
      }
    });
  });

reiniciarAtributos.addEventListener("click", function() {
  if (personagemSalvo) {
    return;
  }

  atributos = { ...valoresIniciais };
  atualizarAtributos();
});

voltarArquetipo.addEventListener("click", function() {
  if (personagemSalvo) {
    return;
  }

  mostrarEtapa(etapaArquetipo);
});

continuarAtributos.addEventListener("click", function() {
  if (personagemSalvo || !atributosValidos(atributos)) {
    return;
  }

  const personagem = montarPersonagem();

  preencherResumo(personagem);
  mostrarEtapa(resumo);

  mostrarMensagem(
    "Ficha pronta! Clique em Salvar Sobrevivente para guardar."
  );
});

// ==========================================
// 9. SALVAMENTO LOCAL
// ==========================================

function montarPersonagem() {
  return {
    versao: 1,
    nome: document.getElementById("nome").value.trim(),
    idade: document.getElementById("idade").value,
    descricao: document.getElementById("descricao").value.trim(),
    tipo: tipoSelecionado,
    arquetipo: arquetipoSelecionado,
    atributos: { ...atributos }
  };
}

function gravarPersonagem(personagem) {
  try {
    localStorage.setItem(
      CHAVE_SALVAMENTO,
      JSON.stringify(personagem)
    );

    return true;
  } catch (erro) {
    console.error("Erro ao salvar personagem:", erro);

    mostrarMensagem(
      "Não foi possível salvar. Verifique o armazenamento do navegador."
    );

    return false;
  }
}

function personagemValido(personagem) {
  if (!personagem || typeof personagem !== "object") {
    return false;
  }

  return (
    typeof personagem.nome === "string" &&
    personagem.nome.trim().length > 0 &&
    typeof personagem.idade === "string" &&
    personagem.idade.trim().length > 0 &&
    typeof personagem.descricao === "string" &&
    typeof personagem.tipo === "string" &&
    personagem.tipo.length > 0 &&
    typeof personagem.arquetipo === "string" &&
    personagem.arquetipo.length > 0 &&
    atributosValidos(personagem.atributos)
  );
}

// Primeiro salvamento
botaoSalvar.addEventListener("click", function() {
  if (personagemSalvo) {
    return;
  }

  if (!tipoSelecionado || !arquetipoSelecionado) {
    mostrarMensagem("Complete todas as etapas antes de salvar.");
    return;
  }

  if (!atributosValidos(atributos)) {
    mostrarMensagem("A distribuição de atributos é inválida.");
    return;
  }

  const personagem = montarPersonagem();

  if (!personagemValido(personagem)) {
    mostrarMensagem("Confira os dados do personagem.");
    return;
  }

  if (gravarPersonagem(personagem)) {
    personagemSalvo = personagem;

    atualizarEstadoSalvamento();
    atualizarAtributos();

    mostrarMensagem("Sobrevivente salvo com sucesso!");
  }
});

// ==========================================
// 10. RECUPERAR PERSONAGEM SALVO
// ==========================================

function recuperarPersonagem() {
  let dados;

  try {
    dados = localStorage.getItem(CHAVE_SALVAMENTO);
  } catch (erro) {
    console.error("Erro ao acessar armazenamento:", erro);
    return;
  }

  if (!dados) {
    return;
  }

  try {
    const personagem = JSON.parse(dados);

    if (!personagemValido(personagem)) {
      console.warn("Dados de personagem inválidos.");
      return;
    }

    personagemSalvo = personagem;

    tipoSelecionado = personagem.tipo;
    arquetipoSelecionado = personagem.arquetipo;
    atributos = { ...personagem.atributos };

    preencherFormulario(personagem);
    preencherResumo(personagem);

    atualizarEstadoSalvamento();
    atualizarAtributos();

    cancelarEdicao.classList.add("escondido");
    mostrarEtapa(resumo);

    mostrarMensagem("Sobrevivente recuperado do navegador.");
  } catch (erro) {
    console.error("Erro ao recuperar personagem:", erro);
  }
}

// ==========================================
// 11. INICIALIZAÇÃO
// ==========================================

atualizarAtributos();
atualizarEstadoSalvamento();
recuperarPersonagem();
