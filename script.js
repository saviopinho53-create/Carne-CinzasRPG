
"use strict";

// ==========================================
// CARNE & CINZAS RPG
// BIBLIOTECA DE SOBREVIVENTES - V0.3
// ==========================================

// 1. CONFIGURAÇÕES

const CHAVE_ANTIGA = "carneCinzas_personagem_v1";
const CHAVE_BIBLIOTECA = "carneCinzas_biblioteca_v1";

const TOTAL_PONTOS = 6;
const MAX_ATRIBUTO = 3;
const MIN_ATRIBUTO = 0;

const valoresIniciais = {
  corpo: 3,
  mente: 2,
  vontade: 1,
  aparencia: 0
};

// ==========================================
// V0.4 - CATÁLOGO DE PERÍCIAS
// ==========================================

const CATEGORIAS_PERICIAS = {
  tecnicas: [
    "Arrombamento",
    "Biologia",
    "Engenharia",
    "Mecânica",
    "Medicina",
    "Química",
    "Tecnologia",
    "Agricultura"
  ],

  combate: [
    "Armas Brancas",
    "Armas de Fogo",
    "Briga",
    "Explosivos",
    "Furtividade",
    "Tática"
  ],

  sociais: [
    "Adestramento",
    "Empatia",
    "Enganação",
    "Intimidação",
    "Liderança",
    "Negociação",
    "Persuasão"
  ],

  gerais: [
    "Atletismo",
    "Investigação",
    "Pilotagem",
    "Percepção",
    "Sobrevivência"
  ]
};

const TODAS_PERICIAS = Object.values(
  CATEGORIAS_PERICIAS
).flat();

const GRAUS_PERICIA = {
  leigo: {
    nome: "Leigo",
    bonus: 0,
    pontos: 0
  },

  treinado: {
    nome: "Treinado",
    bonus: 1,
    pontos: 2
  },

  expert: {
    nome: "Expert",
    bonus: 2,
    pontos: 4
  },

  mestre: {
    nome: "Mestre",
    bonus: 3,
    pontos: 6
  }
};

// ==========================================
// V0.4 - REGRAS DE PERÍCIAS DOS TIPOS
// ==========================================

const REGRAS_TIPOS = {
  "Líder": {
    quantidade: 2,
    opcoes: [
      "Negociação",
      "Liderança",
      "Persuasão",
      "Investigação",
      "Percepção",
      "Sobrevivência"
    ],
    expertises: 1
  },

  "Lutador": {
    quantidade: 2,
    opcoes: [
      "Briga",
      "Armas Brancas",
      "Armas de Fogo",
      "Intimidação",
      "Tática",
      "Atletismo"
    ],
    expertises: 1
  },

  "Especialista": {
    quantidade: 3,
    opcoes: [...TODAS_PERICIAS],
    expertises: 1
  },

  "Diplomata": {
    quantidade: 2,
    opcoes: [
      ...CATEGORIAS_PERICIAS.sociais,
      ...CATEGORIAS_PERICIAS.gerais
    ],
    expertises: 1
  }
};

// ==========================================
// V0.4 - REGRAS DOS ARQUÉTIPOS
// ==========================================

// Cada entrada em "escolhas" representa
// uma escolha independente de perícia.
//
// Uma lista com um único nome representa
// uma perícia fixa.
//
// "TODAS_PERICIAS" permite escolha livre.

const REGRAS_ARQUETIPOS = {
  "Policial": {
    escolhas: [
      ["Armas de Fogo"],
      [...TODAS_PERICIAS]
    ]
  },

  "Religioso": {
    escolhas: [
      ["Empatia"],
      [
        ...CATEGORIAS_PERICIAS.sociais,
        ...CATEGORIAS_PERICIAS.gerais
      ]
    ]
  },

  "Paramédico": {
    escolhas: [
      ["Medicina"],
      ["Química", "Biologia"]
    ]
  },

  "Criminoso": {
    escolhas: [
      ["Arrombamento"],
      [...CATEGORIAS_PERICIAS.combate]
    ]
  },

  "Soldado": {
    escolhas: [
      ["Armas de Fogo"],
      [...CATEGORIAS_PERICIAS.combate]
    ]
  },

  "Caçador": {
    escolhas: [
      ["Sobrevivência", "Adestramento"],
      ["Armas de Fogo", "Armas Brancas"]
    ]
  },

  "Político": {
    escolhas: [
      ["Negociação"],
      ["Persuasão"]
    ]
  },

  "Professor": {
    escolhas: [
      [...CATEGORIAS_PERICIAS.tecnicas],
      [...TODAS_PERICIAS]
    ]
  },

  "Mecânico": {
    escolhas: [
      ["Mecânica"],
      ["Pilotagem"]
    ]
  },

  "Técnico em Informática": {
    escolhas: [
      ["Tecnologia"],
      [...TODAS_PERICIAS]
    ]
  },

  "Cientista": {
    escolhas: [
      ["Investigação"],
      ["Biologia", "Química"]
    ]
  },

  "Ator": {
    escolhas: [
      [...CATEGORIAS_PERICIAS.sociais],
      [...CATEGORIAS_PERICIAS.sociais]
    ]
  },

  "Artista Marcial": {
    escolhas: [
      ["Briga"],
      ["Atletismo"]
    ]
  },

  "Trabalhador Rural": {
    escolhas: [
      ["Agricultura"],
      ["Biologia", "Adestramento", "Sobrevivência"]
    ]
  },

  "Apostador": {
    escolhas: [
      [...TODAS_PERICIAS],
      [...TODAS_PERICIAS]
    ]
  },

  "Bibliotecário": {
    escolhas: [
      ["Investigação"],
      [...TODAS_PERICIAS]
    ]
  }
};


const $ = (id) => document.getElementById(id);

// 2. ELEMENTOS DA INTERFACE

const telas = document.querySelectorAll(".tela");

const formulario = $("form-personagem");
const resumo = $("resumo-personagem");
const biblioteca = $("biblioteca-sobreviventes");
const lista = $("lista-sobreviventes");
const bibliotecaVazia = $("biblioteca-vazia");

const etapaTipo = $("etapa-tipo");
const etapaArquetipo = $("etapa-arquetipo");
const etapaAtributos = $("etapa-atributos");
const etapaPericias = $("etapa-pericias");

const botaoSalvar = $("salvar-personagem");
const botaoEditar = $("editar-personagem");
const cancelarEdicao = $("cancelar-edicao");
const mensagemSalvamento = $("mensagem-salvamento");

const botaoContinuarTipo = $("continuar-tipo");
const botaoContinuarArquetipo = $("continuar-arquetipo");
const botaoContinuarAtributos = $("continuar-atributos");
const botaoContinuarPericias = $("continuar-pericias");
const botaoVoltarAtributos = $("voltar-atributos");

const cartoesTipo = document.querySelectorAll(".cartao-tipo");
const cartoesArquetipo = document.querySelectorAll(".cartao-arquetipo");
const cartoesAtributo = document.querySelectorAll(".cartao-atributo");

// 3. ESTADO DO APLICATIVO

let sobreviventes = [];
let personagemAtualId = null;
let editando = false;

let tipoSelecionado = null;
let arquetipoSelecionado = null;
let atributos = { ...valoresIniciais };
let escolhasPericiasArquetipo = [];
let escolhasPericiasTipo = [];
let periciaExpertise = null;
let rascunhoConcluido = false;

// ==========================================
// 4. NAVEGAÇÃO PRINCIPAL
// ==========================================

function abrirTela(id) {
  telas.forEach((tela) => {
    tela.classList.add("escondido");
  });

  const destino = $(id);

  if (destino) {
    destino.classList.remove("escondido");
  }

  if (id === "personagens") {
    mostrarBiblioteca();
  }
}

document.querySelectorAll("[data-destino]").forEach((botao) => {
  botao.addEventListener("click", () => {
    abrirTela(botao.dataset.destino);
  });
});

document.querySelectorAll(".voltar").forEach((botao) => {
  botao.addEventListener("click", () => {
    abrirTela("inicio");
  });
});

// ==========================================
// 5. NAVEGAÇÃO INTERNA DO CRIADOR
// ==========================================

const partesCriador = [
  biblioteca,
  formulario,
  etapaTipo,
  etapaArquetipo,
  etapaAtributos,
  etapaPericias,
  resumo
];

function mostrarParte(parte) {
  partesCriador.forEach((elemento) => {
    elemento.classList.add("escondido");
  });

  parte.classList.remove("escondido");

  atualizarVoltarBiblioteca();
}

// Criar automaticamente botão de retorno

const voltarBiblioteca = document.createElement("button");

voltarBiblioteca.type = "button";
voltarBiblioteca.id = "voltar-biblioteca";
voltarBiblioteca.className = "botao-secundario";
voltarBiblioteca.textContent = "← Voltar à biblioteca";

voltarBiblioteca.addEventListener("click", mostrarBiblioteca);

const tituloCriador = formulario.previousElementSibling;

if (tituloCriador) {
  tituloCriador.before(voltarBiblioteca);
} else {
  formulario.before(voltarBiblioteca);
}

// Localizar título e descrição antigos

const tituloFixo = Array.from(
  document.querySelectorAll("#personagens > h2")
).find((elemento) => {
  return elemento.textContent.includes("Criar Sobrevivente");
});

const descricaoFixa =
  tituloFixo?.nextElementSibling?.tagName === "P"
    ? tituloFixo.nextElementSibling
    : null;

function atualizarVoltarBiblioteca() {
  const naBiblioteca =
    !biblioteca.classList.contains("escondido");

  voltarBiblioteca.classList.toggle(
    "escondido",
    naBiblioteca
  );

  const formularioVisivel =
    !formulario.classList.contains("escondido");

  if (tituloFixo) {
    tituloFixo.classList.toggle(
      "escondido",
      naBiblioteca || !formularioVisivel
    );
  }

  if (descricaoFixa) {
    descricaoFixa.classList.toggle(
      "escondido",
      naBiblioteca || !formularioVisivel
    );
  }
}

function mensagem(texto) {
  mensagemSalvamento.textContent = texto;
}

// ==========================================
// 6. VALIDAÇÃO DE PERSONAGENS
// ==========================================

function validarAtributos(valores) {
  if (!valores || typeof valores !== "object") {
    return false;
  }

  const nomes = Object.keys(valoresIniciais);

  const validos = nomes.every((nome) => {
    return (
      Number.isInteger(valores[nome]) &&
      valores[nome] >= MIN_ATRIBUTO &&
      valores[nome] <= MAX_ATRIBUTO
    );
  });

  const total = nomes.reduce((soma, nome) => {
    return soma + valores[nome];
  }, 0);

  return validos && total === TOTAL_PONTOS;
}

function validarPersonagem(p) {
  return (
    p &&
    typeof p === "object" &&
    typeof p.nome === "string" &&
    p.nome.trim().length > 0 &&
    typeof p.idade === "string" &&
    p.idade.trim().length > 0 &&
    typeof p.descricao === "string" &&
    typeof p.tipo === "string" &&
    p.tipo.length > 0 &&
    typeof p.arquetipo === "string" &&
    p.arquetipo.length > 0 &&
    validarAtributos(p.atributos)
  );
}

// ==========================================
// 7. ARMAZENAMENTO
// ==========================================

function gerarId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return (
    Date.now() +
    "-" +
    Math.random().toString(36).slice(2)
  );
}

function gravarBiblioteca(novaLista) {
  try {
    localStorage.setItem(
      CHAVE_BIBLIOTECA,
      JSON.stringify(novaLista)
    );

    return true;
  } catch (erro) {
    console.error("Erro ao salvar biblioteca:", erro);

    alert(
      "Não foi possível salvar. Verifique o armazenamento do navegador."
    );

    return false;
  }
}

function carregarBiblioteca() {
  try {
    const bruto = localStorage.getItem(CHAVE_BIBLIOTECA);

    if (bruto !== null) {
      const dados = JSON.parse(bruto);

      if (!Array.isArray(dados)) {
        throw new Error("Biblioteca inválida.");
      }

      sobreviventes = dados.filter((p) => {
        return (
          validarPersonagem(p) &&
          typeof p.id === "string" &&
          p.id.length > 0
        );
      });

      if (sobreviventes.length !== dados.length) {
        console.warn(
          "Alguns registros da biblioteca não puderam ser lidos."
        );
      }
    }

    // MIGRAÇÃO DA V0.2 PARA V0.3

    const antigoBruto =
      localStorage.getItem(CHAVE_ANTIGA);

    if (antigoBruto) {
      const antigo = JSON.parse(antigoBruto);

      if (validarPersonagem(antigo)) {
        const jaMigrado = sobreviventes.some((p) => {
          return p.origem === CHAVE_ANTIGA;
        });

        if (!jaMigrado) {
          const migrado = {
            ...antigo,
            id: gerarId(),
            origem: CHAVE_ANTIGA
          };

          const novaLista = [
            ...sobreviventes,
            migrado
          ];

          if (gravarBiblioteca(novaLista)) {
            sobreviventes = novaLista;
          }
        }
      }
    }
  } catch (erro) {
    console.error("Erro ao carregar biblioteca:", erro);

    alert(
      "Não foi possível ler os dados salvos. Nenhum registro foi apagado."
    );
  }
}

// ==========================================
// 8. CARTÕES DA BIBLIOTECA
// ==========================================

function adicionarTexto(elemento, classe, texto) {
  const filho = document.createElement(elemento);

  filho.className = classe;
  filho.textContent = texto;

  return filho;
}

function renderizarBiblioteca() {
  lista.replaceChildren();

  bibliotecaVazia.classList.toggle(
    "escondido",
    sobreviventes.length > 0
  );

  sobreviventes.forEach((personagem) => {
    const cartao = document.createElement("article");
    cartao.className = "cartao-sobrevivente";

    const nome = adicionarTexto(
      "h3",
      "sobrevivente-nome",
      personagem.nome
    );

    cartao.appendChild(nome);

    // Detalhes do personagem

    const detalhes = document.createElement("div");
    detalhes.className = "sobrevivente-detalhes";

    const informacoes = [
      personagem.idade + " anos",
      personagem.tipo,
      personagem.arquetipo
    ];

    informacoes.forEach((valor) => {
      detalhes.appendChild(
        adicionarTexto("span", "", valor)
      );
    });

    cartao.appendChild(detalhes);

    // História resumida

    const historia = adicionarTexto(
      "p",
      "sobrevivente-historia",
      personagem.descricao ||
        "Nenhuma história registrada."
    );

    cartao.appendChild(historia);

    // Botões

    const acoes = document.createElement("div");
    acoes.className = "sobrevivente-acoes";

    const abrir = adicionarTexto(
      "button",
      "abrir-sobrevivente",
      "Abrir ficha"
    );

    abrir.type = "button";

    abrir.addEventListener("click", () => {
      abrirPersonagem(personagem.id);
    });

    const excluir = adicionarTexto(
      "button",
      "excluir-sobrevivente",
      "Excluir"
    );

    excluir.type = "button";

    excluir.setAttribute(
      "aria-label",
      "Excluir " + personagem.nome
    );

    excluir.addEventListener("click", () => {
      excluirPersonagem(personagem.id);
    });

    acoes.append(abrir, excluir);

    cartao.appendChild(acoes);
    lista.appendChild(cartao);
  });
}

// ==========================================
// 9. ABRIR A BIBLIOTECA
// ==========================================

function mostrarBiblioteca() {
  personagemAtualId = null;
  editando = false;

  renderizarBiblioteca();
  mostrarParte(biblioteca);
}

// ==========================================
// 10. CRIAR NOVO SOBREVIVENTE
// ==========================================

function limparSelecoes() {
  cartoesTipo.forEach((cartao) => {
    cartao.classList.remove("selecionado");
    cartao.setAttribute("aria-pressed", "false");
  });

  cartoesArquetipo.forEach((cartao) => {
    cartao.classList.remove("selecionado");
    cartao.setAttribute("aria-pressed", "false");
  });

  $("tipo-escolhido").textContent =
    "Nenhum Tipo selecionado.";

  $("arquetipo-escolhido").textContent =
    "Nenhum Arquétipo selecionado.";

  botaoContinuarTipo.disabled = true;
  botaoContinuarArquetipo.disabled = true;
}

function criarNovoPersonagem() {
  personagemAtualId = null;
  editando = false;
  rascunhoConcluido = false;

  tipoSelecionado = null;
  arquetipoSelecionado = null;

  atributos = { ...valoresIniciais };

  formulario.reset();

  limparSelecoes();
  atualizarAtributos();

  cancelarEdicao.classList.add("escondido");

  botaoSalvar.disabled = false;
  botaoSalvar.textContent = "Salvar Sobrevivente";

  mensagem("");

  mostrarParte(formulario);
}

$("criar-novo-personagem").addEventListener(
  "click",
  criarNovoPersonagem
);

// ==========================================
// 11. PREENCHER FICHA
// ==========================================

function preencherResumo(p) {
  const campos = {
    "resumo-nome": p.nome,
    "resumo-idade": p.idade,
    "resumo-descricao":
      p.descricao || "Nenhuma descrição informada.",
    "resumo-tipo": p.tipo,
    "resumo-arquetipo": p.arquetipo,
    "resumo-corpo": p.atributos.corpo,
    "resumo-mente": p.atributos.mente,
    "resumo-vontade": p.atributos.vontade,
    "resumo-aparencia": p.atributos.aparencia
  };

  Object.entries(campos).forEach(([id, valor]) => {
    $(id).textContent = valor;
  });
}

function preencherFormulario(p) {
  $("nome").value = p.nome;
  $("idade").value = p.idade;
  $("descricao").value = p.descricao;
}

// ==========================================
// 12. ABRIR PERSONAGEM SALVO
// ==========================================

function abrirPersonagem(id) {
  const personagem = sobreviventes.find((p) => {
    return p.id === id;
  });

  if (!personagem) {
    return;
  }

  personagemAtualId = id;
  editando = false;
  rascunhoConcluido = true;

  tipoSelecionado = personagem.tipo;
  arquetipoSelecionado = personagem.arquetipo;

  atributos = { ...personagem.atributos };

  preencherFormulario(personagem);
  preencherResumo(personagem);
  atualizarAtributos();

  botaoSalvar.disabled = true;
  botaoSalvar.textContent = "Sobrevivente salvo";

  cancelarEdicao.classList.add("escondido");

  mensagem("Ficha salva neste navegador.");

  mostrarParte(resumo);
}

// ==========================================
// 13. EXCLUIR PERSONAGEM
// ==========================================

function excluirPersonagem(id) {
  const personagem = sobreviventes.find((p) => {
    return p.id === id;
  });

  if (!personagem) {
    return;
  }

  const confirmado = confirm(
    'Excluir permanentemente o sobrevivente "' +
    personagem.nome +
    '" deste navegador?'
  );

  if (!confirmado) {
    return;
  }

  const novaLista = sobreviventes.filter((p) => {
    return p.id !== id;
  });

  if (!gravarBiblioteca(novaLista)) {
    return;
  }

  sobreviventes = novaLista;

  // Evita que o personagem antigo reapareça
  // depois de ser excluído da biblioteca.

  if (personagem.origem === CHAVE_ANTIGA) {
    try {
      localStorage.removeItem(CHAVE_ANTIGA);
    } catch (erro) {
      console.warn(
        "Não foi possível remover o registro antigo.",
        erro
      );
    }
  }

  renderizarBiblioteca();
}

// ==========================================
// 14. MONTAR PERSONAGEM
// ==========================================

function montarPersonagem() {
  return {
    id: gerarId(),
    versao: 1,

    nome: $("nome").value.trim(),
    idade: $("idade").value,
    descricao: $("descricao").value.trim(),

    tipo: tipoSelecionado,
    arquetipo: arquetipoSelecionado,

    atributos: { ...atributos }
  };
}

// ==========================================
// 15. FORMULÁRIO DE IDENTIDADE
// ==========================================

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nome = $("nome").value.trim();
  const idade = $("idade").value;
  const descricao = $("descricao").value.trim();

  if (!nome || !idade) {
    return;
  }

  // EDITAR PERSONAGEM EXISTENTE

  if (editando && personagemAtualId) {
    const indice = sobreviventes.findIndex((p) => {
      return p.id === personagemAtualId;
    });

    if (indice === -1) {
      return;
    }

    const atualizado = {
      ...sobreviventes[indice],
      nome,
      idade,
      descricao
    };

    const novaLista = [...sobreviventes];
    novaLista[indice] = atualizado;

    if (!gravarBiblioteca(novaLista)) {
      return;
    }

    sobreviventes = novaLista;
    editando = false;

    cancelarEdicao.classList.add("escondido");

    preencherResumo(atualizado);

    mensagem("Informações narrativas atualizadas!");

    mostrarParte(resumo);
    return;
  }

  // CRIAÇÃO INICIAL

  if (personagemAtualId) {
    return;
  }

  mostrarParte(etapaTipo);
});

// ==========================================
// 16. EDITAR INFORMAÇÕES
// ==========================================

botaoEditar.addEventListener("click", () => {
  if (personagemAtualId) {
    const personagem = sobreviventes.find((p) => {
      return p.id === personagemAtualId;
    });

    if (!personagem) {
      return;
    }

    preencherFormulario(personagem);

    editando = true;
    cancelarEdicao.classList.remove("escondido");
  } else {
    editando = false;
    cancelarEdicao.classList.add("escondido");
  }

  mostrarParte(formulario);
});

cancelarEdicao.addEventListener("click", () => {
  if (!personagemAtualId) {
    return;
  }

  const personagem = sobreviventes.find((p) => {
    return p.id === personagemAtualId;
  });

  if (personagem) {
    preencherFormulario(personagem);
  }

  editando = false;
  cancelarEdicao.classList.add("escondido");

  mostrarParte(resumo);
});

// ==========================================
// 17. SELEÇÃO DE TIPO
// ==========================================

cartoesTipo.forEach((cartao) => {
  cartao.setAttribute("aria-pressed", "false");

  cartao.addEventListener("click", () => {
    if (personagemAtualId) {
      return;
    }

    tipoSelecionado = cartao.dataset.tipo;

    cartoesTipo.forEach((outro) => {
      outro.classList.remove("selecionado");
      outro.setAttribute("aria-pressed", "false");
    });

    cartao.classList.add("selecionado");
    cartao.setAttribute("aria-pressed", "true");

    $("tipo-escolhido").textContent =
      "Tipo selecionado: " + tipoSelecionado;

    botaoContinuarTipo.disabled = false;
  });
});

$("voltar-identidade").addEventListener("click", () => {
  if (!personagemAtualId) {
    mostrarParte(formulario);
  }
});

botaoContinuarTipo.addEventListener("click", () => {
  if (!tipoSelecionado || personagemAtualId) {
    return;
  }

  mostrarParte(etapaArquetipo);
});

// ==========================================
// 18. SELEÇÃO DE ARQUÉTIPO
// ==========================================

cartoesArquetipo.forEach((cartao) => {
  cartao.setAttribute("aria-pressed", "false");

  cartao.addEventListener("click", () => {
    if (personagemAtualId) {
      return;
    }

    arquetipoSelecionado = cartao.dataset.arquetipo;

    cartoesArquetipo.forEach((outro) => {
      outro.classList.remove("selecionado");
      outro.setAttribute("aria-pressed", "false");
    });

    cartao.classList.add("selecionado");
    cartao.setAttribute("aria-pressed", "true");

    $("arquetipo-escolhido").textContent =
      "Arquétipo selecionado: " + arquetipoSelecionado;

    botaoContinuarArquetipo.disabled = false;
  });
});

$("voltar-tipo").addEventListener("click", () => {
  if (!personagemAtualId) {
    mostrarParte(etapaTipo);
  }
});

botaoContinuarArquetipo.addEventListener("click", () => {
  if (!arquetipoSelecionado || personagemAtualId) {
    return;
  }

  mostrarParte(etapaAtributos);
});

// ==========================================
// 19. DISTRIBUIÇÃO DE ATRIBUTOS
// ==========================================

function pontosUsados() {
  return Object.values(atributos).reduce((total, valor) => {
    return total + valor;
  }, 0);
}

function atualizarAtributos() {
  const restantes = TOTAL_PONTOS - pontosUsados();

  $("pontos-restantes").textContent = restantes;

  cartoesAtributo.forEach((cartao) => {
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
      Boolean(personagemAtualId) ||
      valor <= MIN_ATRIBUTO;

    aumentar.disabled =
      Boolean(personagemAtualId) ||
      valor >= MAX_ATRIBUTO ||
      restantes === 0;
  });

  botaoContinuarAtributos.disabled =
    Boolean(personagemAtualId) ||
    restantes !== 0;
}

cartoesAtributo.forEach((cartao) => {
  const nome = cartao.dataset.atributo;

  const diminuir =
    cartao.querySelector(".diminuir");

  const aumentar =
    cartao.querySelector(".aumentar");

  diminuir.addEventListener("click", () => {
    if (
      personagemAtualId ||
      atributos[nome] <= MIN_ATRIBUTO
    ) {
      return;
    }

    atributos[nome]--;
    atualizarAtributos();
  });

  aumentar.addEventListener("click", () => {
    if (
      personagemAtualId ||
      atributos[nome] >= MAX_ATRIBUTO ||
      pontosUsados() >= TOTAL_PONTOS
    ) {
      return;
    }

    atributos[nome]++;
    atualizarAtributos();
  });
});

// Reiniciar distribuição

$("reiniciar-atributos").addEventListener("click", () => {
  if (personagemAtualId) {
    return;
  }

  atributos = { ...valoresIniciais };
  atualizarAtributos();
});

// Voltar aos Arquétipos

$("voltar-arquetipo").addEventListener("click", () => {
  if (!personagemAtualId) {
    mostrarParte(etapaArquetipo);
  }
});

// ==========================================
// 20. FINALIZAR CRIAÇÃO
// ==========================================

botaoContinuarAtributos.addEventListener("click", () => {
  if (
    personagemAtualId ||
    !validarAtributos(atributos)
  ) {
    return;
  }

  const personagem = montarPersonagem();

  if (!validarPersonagem(personagem)) {
    return;
  }

  rascunhoConcluido = true;

  preencherResumo(personagem);

  botaoSalvar.disabled = false;
  botaoSalvar.textContent = "Salvar Sobrevivente";

  mensagem(
    "Ficha pronta! Salve para adicioná-la à biblioteca."
  );

  mostrarParte(resumo);
});

// ==========================================
// 21. SALVAR NOVO SOBREVIVENTE
// ==========================================

botaoSalvar.addEventListener("click", () => {
  if (
    personagemAtualId ||
    !rascunhoConcluido ||
    !tipoSelecionado ||
    !arquetipoSelecionado ||
    !validarAtributos(atributos)
  ) {
    return;
  }

  const personagem = montarPersonagem();

  if (!validarPersonagem(personagem)) {
    return;
  }

  const novaLista = [
    ...sobreviventes,
    personagem
  ];

  if (!gravarBiblioteca(novaLista)) {
    return;
  }

  sobreviventes = novaLista;

  abrirPersonagem(personagem.id);

  mensagem(
    "Sobrevivente salvo! Ele já está na biblioteca."
  );
});

 // ==========================================
 // V0.4 - NAVEGAÇÃO DAS PERÍCIAS
 // ==========================================

botaoVoltarAtributos.addEventListener("click", () => {
  if (!personagemAtualId) {
    mostrarParte(etapaAtributos);
  }
});

// ==========================================
// V0.4 - SELEÇÃO DE PERÍCIAS DO ARQUÉTIPO
// ==========================================

function obterPericiasArquetipo() {
  const regras = REGRAS_ARQUETIPOS[arquetipoSelecionado];

  if (!regras) {
    return [];
  }

  return regras.escolhas;
}

function criarCartaoPericia(nome, selecionado, aoClicar) {
  const botao = document.createElement("button");

  botao.type = "button";
  botao.className = "cartao-pericia";
  botao.classList.toggle("selecionado", selecionado);
  botao.setAttribute("aria-pressed", String(selecionado));

  const texto = document.createElement("span");
  texto.className = "pericia-nome";
  texto.textContent = nome;

  const indicador = document.createElement("span");
  indicador.className = "pericia-grau";
  indicador.textContent = selecionado
    ? "Selecionada"
    : "Escolher";

  botao.append(texto, indicador);
  botao.addEventListener("click", aoClicar);

  return botao;
}

function atualizarResumoPericiasArquetipo() {
  const resumoPericias = $("pericias-resumo");

  resumoPericias.replaceChildren();

  escolhasPericiasArquetipo
    .filter(Boolean)
    .forEach((nome) => {
      const cartao = document.createElement("div");
      cartao.className = "cartao-pericia";

      const texto = document.createElement("span");
      texto.className = "pericia-nome";
      texto.textContent = nome;

      const grau = document.createElement("span");
      grau.className = "pericia-grau";
      grau.textContent = "Treinado";

      cartao.append(texto, grau);
      resumoPericias.appendChild(cartao);
    });
}

function renderizarPericiasArquetipo() {
  const regras = obterPericiasArquetipo();

  const fixas = $("pericias-fixas");
  const escolhas = $("pericias-escolhas");
  const instrucoes = $("pericias-instrucoes");

  fixas.replaceChildren();
  escolhas.replaceChildren();

  instrucoes.textContent =
    "Escolha as perícias concedidas pelo seu Arquétipo.";

  // Preencher automaticamente as perícias fixas
  regras.forEach((opcoes, indice) => {
    if (opcoes.length === 1) {
      escolhasPericiasArquetipo[indice] = opcoes[0];
    }
  });

  // Renderizar os grupos de escolha
  regras.forEach((opcoes, indice) => {
    if (opcoes.length === 1) {
      const cartao = document.createElement("div");
      cartao.className = "cartao-pericia fixo";

      const nome = document.createElement("span");
      nome.className = "pericia-nome";
      nome.textContent = opcoes[0];

      const grau = document.createElement("span");
      grau.className = "pericia-grau";
      grau.textContent = "Treinado";

      cartao.append(nome, grau);
      fixas.appendChild(cartao);
      return;
    }

    const grupo = document.createElement("div");
    grupo.className = "grupo-escolha-pericia";

    const titulo = document.createElement("h4");
    titulo.textContent = `Escolha ${indice + 1}`;

    const listaGrupo = document.createElement("div");
    listaGrupo.className = "pericias-lista";

    opcoes.forEach((nome) => {
      const jaEscolhida = escolhasPericiasArquetipo.some(
        (escolha, outroIndice) =>
          outroIndice !== indice && escolha === nome
      );

      if (jaEscolhida) return;

      const selecionado =
        escolhasPericiasArquetipo[indice] === nome;

      const cartao = criarCartaoPericia(
        nome,
        selecionado,
        () => {
          escolhasPericiasArquetipo[indice] =
            selecionado ? undefined : nome;

          renderizarPericiasArquetipo();
        }
      );

      listaGrupo.appendChild(cartao);
    });

    grupo.append(titulo, listaGrupo);
    escolhas.appendChild(grupo);
  });

  atualizarResumoPericiasArquetipo();
}

// ==========================================
// V0.4 - PERÍCIAS DO TIPO
// ==========================================

function obterOpcoesPericiasTipo() {
  const regras = REGRAS_TIPOS[tipoSelecionado];

  if (!regras) {
    return [];
  }

  const jaTreinadas =
    escolhasPericiasArquetipo.filter(Boolean);

  return regras.opcoes.filter(
    (nome) => !jaTreinadas.includes(nome)
  );
}

function obterTreinamentosAtuais() {
  return [
    ...new Set([
      ...escolhasPericiasArquetipo.filter(Boolean),
      ...escolhasPericiasTipo.filter(Boolean)
    ])
  ];
}


// ==========================================
// 22. INICIALIZAÇÃO
// ==========================================

carregarBiblioteca();
atualizarAtributos();
mostrarBiblioteca();
