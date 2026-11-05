

"use strict";

// ==========================================
// CARNE & CINZAS RPG
// BIBLIOTECA DE SOBREVIVENTES - V0.6
// ==========================================

// ==========================================
// 1. CONFIGURAÇÕES
// ==========================================

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
// 2. CATÁLOGO DE PERÍCIAS
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

// ==========================================
// 3. GRAUS DE PERÍCIA
// ==========================================

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
// 4. REGRAS DOS TIPOS
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
    expertises: 1,
    guardaBase: 10
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
    expertises: 1,
    guardaBase: 11
  },

  "Especialista": {
    quantidade: 3,
    opcoes: [...TODAS_PERICIAS],
    expertises: 1,
    guardaBase: 9
  },

  "Diplomata": {
    quantidade: 2,
    opcoes: [
      ...CATEGORIAS_PERICIAS.sociais,
      ...CATEGORIAS_PERICIAS.gerais
    ],
    expertises: 1,
    guardaBase: 10
  }
};

// ==========================================
// 5. REGRAS DOS ARQUÉTIPOS
// ==========================================

// pvBase representa os PVs antes
// de adicionar o atributo CORPO.
//
// Cada entrada de escolhas representa
// uma perícia fixa ou uma escolha.
//
// Listas de um elemento são perícias fixas.

const REGRAS_ARQUETIPOS = {
  "Policial": {
    pvBase: 11,
    escolhas: [
      ["Armas de Fogo"],
      [...TODAS_PERICIAS]
    ]
  },

  "Religioso": {
    pvBase: 10,
    escolhas: [
      ["Empatia"],
      [
        ...CATEGORIAS_PERICIAS.sociais,
        ...CATEGORIAS_PERICIAS.gerais
      ]
    ]
  },

  "Paramédico": {
    pvBase: 9,
    escolhas: [
      ["Medicina"],
      ["Química", "Biologia"]
    ]
  },

  "Criminoso": {
    pvBase: 8,
    escolhas: [
      ["Arrombamento"],
      [...CATEGORIAS_PERICIAS.combate]
    ]
  },

  "Soldado": {
    pvBase: 13,
    escolhas: [
      ["Armas de Fogo"],
      [...CATEGORIAS_PERICIAS.combate]
    ]
  },

  "Caçador": {
    pvBase: 11,
    escolhas: [
      ["Sobrevivência", "Adestramento"],
      ["Armas de Fogo", "Armas Brancas"]
    ]
  },

  "Político": {
    pvBase: 9,
    escolhas: [
      ["Negociação"],
      ["Persuasão"]
    ]
  },

  "Professor": {
    pvBase: 9,
    escolhas: [
      [...CATEGORIAS_PERICIAS.tecnicas],
      [...TODAS_PERICIAS]
    ]
  },

  "Mecânico": {
    pvBase: 10,
    escolhas: [
      ["Mecânica"],
      ["Pilotagem"]
    ]
  },

  "Técnico em Informática": {
    pvBase: 7,
    escolhas: [
      ["Tecnologia"],
      [...TODAS_PERICIAS]
    ]
  },

  "Cientista": {
    pvBase: 9,
    escolhas: [
      ["Investigação"],
      ["Biologia", "Química"]
    ]
  },

  "Ator": {
    pvBase: 10,
    escolhas: [
      [...CATEGORIAS_PERICIAS.sociais],
      [...CATEGORIAS_PERICIAS.sociais]
    ]
  },

  "Artista Marcial": {
    pvBase: 12,
    escolhas: [
      ["Briga"],
      ["Atletismo"]
    ]
  },

  "Trabalhador Rural": {
    pvBase: 11,
    escolhas: [
      ["Agricultura"],
      [
        "Biologia",
        "Adestramento",
        "Sobrevivência"
      ]
    ]
  },

  "Apostador": {
    pvBase: 9,
    escolhas: [
      [...TODAS_PERICIAS],
      [...TODAS_PERICIAS]
    ]
  },

  "Bibliotecário": {
    pvBase: 8,
    escolhas: [
      ["Investigação"],
      [...TODAS_PERICIAS]
    ]
  }
};

// ==========================================
// 6. CÁLCULO DOS VALORES DE SOBREVIVÊNCIA
// ==========================================

function calcularPontosDeVida(arquetipo, corpo) {
  const regras = REGRAS_ARQUETIPOS[arquetipo];

  if (!regras) {
    return null;
  }

  const valorCorpo = Number(corpo);

  if (!Number.isFinite(valorCorpo)) {
    return null;
  }

  return regras.pvBase + valorCorpo;
}

function calcularGuarda(tipo, corpo) {
  const regras = REGRAS_TIPOS[tipo];

  if (!regras) {
    return null;
  }

  const valorCorpo = Number(corpo);

  if (!Number.isFinite(valorCorpo)) {
    return null;
  }

  return regras.guardaBase + valorCorpo;
}

// ==========================================
// FIM DA PARTE 1 - V0.6
// ==========================================

 // ==========================================
 // PARTE 2 - INTERFACE E ARMAZENAMENTO
 // ==========================================

const $ = (id) => document.getElementById(id);

// ==========================================
// 2. ELEMENTOS DA INTERFACE
// ==========================================

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
const cartoesArquetipo =
  document.querySelectorAll(".cartao-arquetipo");
const cartoesAtributo =
  document.querySelectorAll(".cartao-atributo");

// ==========================================
// 3. ESTADO DO APLICATIVO
// ==========================================

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

voltarBiblioteca.addEventListener(
  "click",
  mostrarBiblioteca
);

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
// FIM DA PARTE 2
// ==========================================


 
 // ==========================================
 // PARTE 3 - BIBLIOTECA E FICHA V0.6
 // ==========================================

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

    const historia = adicionarTexto(
      "p",
      "sobrevivente-historia",
      personagem.descricao ||
        "Nenhuma história registrada."
    );

    cartao.appendChild(historia);

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

  // Reiniciar perícias e Expertise

  escolhasPericiasArquetipo = [];
  escolhasPericiasTipo = [];
  periciaExpertise = null;

  botaoContinuarPericias.disabled = true;

  // Limpar elementos dinâmicos

  $("pericias-fixas")?.replaceChildren();
  $("pericias-escolhas")?.replaceChildren();
  $("pericias-resumo")?.replaceChildren();

  $("grupo-pericias-tipo")?.remove();
  $("grupo-expertise")?.remove();

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
// 11. DADOS DAS PERÍCIAS
// ==========================================

function obterDadosPericias(personagem) {
  const dados = personagem.pericias || {};

  const arquetipo = Array.isArray(dados.arquetipo)
    ? dados.arquetipo.filter(Boolean)
    : [];

  const tipo = Array.isArray(dados.tipo)
    ? dados.tipo.filter(Boolean)
    : [];

  const treinadas = [
    ...new Set([...arquetipo, ...tipo])
  ];

  const expertises = Array.isArray(dados.expertise)
    ? dados.expertise.filter(Boolean)
    : dados.expertise
      ? [dados.expertise]
      : [];

  return {
    treinadas,
    expertises: [
      ...new Set(
        expertises.filter(nome =>
          treinadas.includes(nome)
        )
      )
    ]
  };
}

// ==========================================
// 12. PERÍCIAS NA FICHA
// ==========================================

function renderizarPericiasFicha(personagem) {
  let secao = $("ficha-pericias");

  if (!secao) {
    secao = document.createElement("section");
    secao.id = "ficha-pericias";
    secao.className = "ficha-pericias";

    const acoesResumo = botaoSalvar.parentElement;

    if (
      acoesResumo &&
      acoesResumo.parentElement === resumo
    ) {
      resumo.insertBefore(secao, acoesResumo);
    } else {
      resumo.appendChild(secao);
    }
  }

  secao.replaceChildren();

  const titulo = adicionarTexto(
    "h3",
    "ficha-pericias-titulo",
    "Perícias e Expertise"
  );

  secao.appendChild(titulo);

  const dados = obterDadosPericias(personagem);

  if (dados.treinadas.length === 0) {
    secao.appendChild(
      adicionarTexto(
        "p",
        "ficha-pericias-vazia",
        "Este sobrevivente não possui perícias registradas."
      )
    );

    return;
  }

  const contador = adicionarTexto(
    "p",
    "ficha-pericias-contador",
    `${dados.treinadas.length} perícias treinadas | ` +
    `${dados.expertises.length} Expertise`
  );

  secao.appendChild(contador);

  const listaPericias = document.createElement("div");
  listaPericias.className = "ficha-pericias-lista";

  const ordenadas = [...dados.treinadas].sort(
    (a, b) => {
      const aExpert = dados.expertises.includes(a);
      const bExpert = dados.expertises.includes(b);

      if (aExpert !== bExpert) {
        return aExpert ? -1 : 1;
      }

      return a.localeCompare(b, "pt-BR");
    }
  );

  ordenadas.forEach((nome) => {
    const expert = dados.expertises.includes(nome);

    const cartao = document.createElement("div");
    cartao.className = "cartao-pericia";

    if (expert) {
      cartao.classList.add("selecionado");
      cartao.classList.add("pericia-expert");
    }

    const texto = adicionarTexto(
      "span",
      "pericia-nome",
      nome
    );

    const grau = adicionarTexto(
      "span",
      "pericia-grau",
      expert ? "Expert" : "Treinado"
    );

    cartao.append(texto, grau);
    listaPericias.appendChild(cartao);
  });

  secao.appendChild(listaPericias);
}

// ==========================================
// 13. CÁLCULO DE PV E GUARDA NA FICHA
// ==========================================

function renderizarSobrevivenciaFicha(personagem) {
  let secao = $("ficha-sobrevivencia");

  if (!secao) {
    secao = document.createElement("section");
    secao.id = "ficha-sobrevivencia";
    secao.className = "ficha-sobrevivencia";

    // Posicionar antes das perícias

    const secaoPericias = $("ficha-pericias");

    if (secaoPericias) {
      secaoPericias.before(secao);
    } else {
      const acoesResumo = botaoSalvar.parentElement;

      if (
        acoesResumo &&
        acoesResumo.parentElement === resumo
      ) {
        resumo.insertBefore(secao, acoesResumo);
      } else {
        resumo.appendChild(secao);
      }
    }
  }

  secao.replaceChildren();

  const corpo = Number(personagem.atributos?.corpo);

  const pv = calcularPontosDeVida(
    personagem.arquetipo,
    corpo
  );

  const guarda = calcularGuarda(
    personagem.tipo,
    corpo
  );

  const titulo = adicionarTexto(
    "h3",
    "ficha-sobrevivencia-titulo",
    "Sobrevivência"
  );

  const grade = document.createElement("div");
  grade.className = "ficha-sobrevivencia-grade";

  function criarIndicador(nome, valor, classe) {
    const cartao = document.createElement("div");
    cartao.className = `indicador-sobrevivencia ${classe}`;

    const rotulo = adicionarTexto(
      "span",
      "indicador-sobrevivencia-rotulo",
      nome
    );

    const numero = adicionarTexto(
      "strong",
      "indicador-sobrevivencia-valor",
      valor === null ? "—" : String(valor)
    );

    cartao.append(rotulo, numero);

    return cartao;
  }

  grade.append(
    criarIndicador("Pontos de Vida", pv, "indicador-pv"),
    criarIndicador("Guarda", guarda, "indicador-guarda")
  );

  secao.append(titulo, grade);
}

// ==========================================
// 14. PREENCHER FICHA
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

  renderizarPericiasFicha(p);
  renderizarSobrevivenciaFicha(p);
}

function preencherFormulario(p) {
  $("nome").value = p.nome;
  $("idade").value = p.idade;
  $("descricao").value = p.descricao || "";
}

// ==========================================
// 15. ABRIR PERSONAGEM SALVO
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

  escolhasPericiasArquetipo = [
    ...(personagem.pericias?.arquetipo || [])
  ];

  escolhasPericiasTipo = [
    ...(personagem.pericias?.tipo || [])
  ];

  const expertiseSalva =
    personagem.pericias?.expertise;

  periciaExpertise = Array.isArray(expertiseSalva)
    ? expertiseSalva[0] || null
    : expertiseSalva || null;

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
// 16. EXCLUIR PERSONAGEM
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
// 17. MONTAR PERSONAGEM
// ==========================================

function montarPersonagem() {
  return {
    id: gerarId(),
    versao: 4,

    nome: $("nome").value.trim(),
    idade: $("idade").value,
    descricao: $("descricao").value.trim(),

    tipo: tipoSelecionado,
    arquetipo: arquetipoSelecionado,

    atributos: { ...atributos },

    pericias: {
      arquetipo: [...escolhasPericiasArquetipo],
      tipo: [...escolhasPericiasTipo],
      expertise: periciaExpertise
    }
  };
}

// ==========================================
// FIM DA PARTE 3 - V0.6
// ==========================================

 // ==========================================
 // PARTE 4 - CRIAÇÃO DO SOBREVIVENTE
 // ==========================================

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

    const novoTipo = cartao.dataset.tipo;

    // Reiniciar escolhas se o Tipo mudar

    if (tipoSelecionado !== novoTipo) {
      escolhasPericiasTipo = [];
      periciaExpertise = null;
      rascunhoConcluido = false;
    }

    tipoSelecionado = novoTipo;

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

    const novoArquetipo = cartao.dataset.arquetipo;

    // Reiniciar perícias se o Arquétipo mudar

    if (arquetipoSelecionado !== novoArquetipo) {
      escolhasPericiasArquetipo = [];
      escolhasPericiasTipo = [];
      periciaExpertise = null;
      rascunhoConcluido = false;
    }

    arquetipoSelecionado = novoArquetipo;

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
// FIM DA PARTE 4
// ==========================================



 // ==========================================
 // PARTE 5 - PERÍCIAS E EXPERTISE V0.5
 // ==========================================

// ==========================================
// 20. AVANÇAR PARA PERÍCIAS
// ==========================================

botaoContinuarAtributos.addEventListener("click", () => {
  if (
    personagemAtualId ||
    !validarAtributos(atributos)
  ) {
    return;
  }

  renderizarPericiasArquetipo();
  renderizarPericiasTipo();
  atualizarResumoPericias();
  renderizarExpertise();
  validarEscolhasPericias();

  mostrarParte(etapaPericias);
});

// ==========================================
// 21. NAVEGAÇÃO DAS PERÍCIAS
// ==========================================

botaoVoltarAtributos.addEventListener("click", () => {
  if (!personagemAtualId) {
    mostrarParte(etapaAtributos);
  }
});

// ==========================================
// 22. FUNÇÕES AUXILIARES
// ==========================================

function obterPericiasArquetipo() {
  const regras = REGRAS_ARQUETIPOS[arquetipoSelecionado];
  return regras ? regras.escolhas : [];
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

// ==========================================
// 23. CATEGORIAS DE PERÍCIAS
// ==========================================

const NOMES_CATEGORIAS = {
  tecnicas: "Técnicas",
  combate: "Combate",
  sociais: "Sociais",
  gerais: "Gerais"
};

const categoriasAbertas = new Set();

function criarGruposPericias(
  opcoes,
  selecionadas,
  aoEscolher
) {
  const container = document.createElement("div");
  container.className = "grupos-pericias";

  Object.entries(CATEGORIAS_PERICIAS).forEach(
    ([categoria, nomes]) => {
      const disponiveis = nomes.filter(nome =>
        opcoes.includes(nome)
      );

      if (disponiveis.length === 0) {
        return;
      }

      const grupo = document.createElement("details");
      grupo.className = "grupo-categoria-pericia";

      if (categoriasAbertas.has(categoria)) {
        grupo.open = true;
      }

      const cabecalho = document.createElement("summary");
      cabecalho.className = "categoria-pericia-titulo";

      const titulo = document.createElement("span");
      titulo.textContent =
        NOMES_CATEGORIAS[categoria] || categoria;

      const contador = document.createElement("span");
      contador.className = "categoria-pericia-contador";

      const totalSelecionadas = disponiveis.filter(
        nome => selecionadas.includes(nome)
      ).length;

      contador.textContent =
        `${totalSelecionadas}/${disponiveis.length}`;

      cabecalho.append(titulo, contador);

      const lista = document.createElement("div");
      lista.className = "pericias-lista";

      disponiveis.forEach(nome => {
        const selecionado = selecionadas.includes(nome);

        const cartao = criarCartaoPericia(
          nome,
          selecionado,
          () => aoEscolher(nome, selecionado)
        );

        lista.appendChild(cartao);
      });

      grupo.append(cabecalho, lista);

      grupo.addEventListener("toggle", () => {
        if (grupo.open) {
          categoriasAbertas.add(categoria);
        } else {
          categoriasAbertas.delete(categoria);
        }
      });

      container.appendChild(grupo);
    }
  );

  return container;
}

// ==========================================
// 24. PERÍCIAS DO ARQUÉTIPO
// ==========================================

function renderizarPericiasArquetipo() {
  const regras = obterPericiasArquetipo();

  const fixas = $("pericias-fixas");
  const escolhas = $("pericias-escolhas");
  const instrucoes = $("pericias-instrucoes");

  fixas.replaceChildren();
  escolhas.replaceChildren();

  const quantidadeEscolhas = regras.filter(
    opcoes => opcoes.length > 1
  ).length;

  instrucoes.textContent =
    quantidadeEscolhas === 0
      ? "Seu Arquétipo concede perícias fixas."
      : `Escolha ${quantidadeEscolhas} ${
          quantidadeEscolhas === 1
            ? "perícia"
            : "perícias"
        } adicional${
          quantidadeEscolhas === 1 ? "" : "is"
        }.`;

  const fixasObrigatorias = regras
    .filter(opcoes => opcoes.length === 1)
    .map(opcoes => opcoes[0]);

  const anteriores = [...escolhasPericiasArquetipo];
  const novas = [];
  const usadas = new Set(fixasObrigatorias);

  regras.forEach((opcoes, indice) => {
    if (opcoes.length === 1) {
      novas[indice] = opcoes[0];
      return;
    }

    const anterior = anteriores[indice];

    if (
      opcoes.includes(anterior) &&
      !usadas.has(anterior)
    ) {
      novas[indice] = anterior;
      usadas.add(anterior);
    }
  });

  escolhasPericiasArquetipo = novas;

  escolhasPericiasTipo = escolhasPericiasTipo.filter(
    nome => !usadas.has(nome)
  );

  let numeroEscolha = 0;

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

    numeroEscolha++;

    const grupo = document.createElement("div");
    grupo.className = "grupo-escolha-pericia";

    const titulo = document.createElement("h4");
    titulo.textContent =
      `Perícia adicional ${numeroEscolha}`;

    const disponiveis = opcoes.filter(nome => {
      return !escolhasPericiasArquetipo.some(
        (escolha, outroIndice) =>
          outroIndice !== indice && escolha === nome
      );
    });

    const lista = criarGruposPericias(
      disponiveis,
      [escolhasPericiasArquetipo[indice]],
      (nome, selecionado) => {
        escolhasPericiasArquetipo[indice] =
          selecionado ? undefined : nome;

        renderizarPericiasArquetipo();
        renderizarPericiasTipo();
        atualizarResumoPericias();
        renderizarExpertise();
        validarEscolhasPericias();
      }
    );

    grupo.append(titulo, lista);
    escolhas.appendChild(grupo);
  });

  atualizarResumoPericias();
}

// ==========================================
// 25. PERÍCIAS DO TIPO
// ==========================================

function obterOpcoesPericiasTipo() {
  const regras = REGRAS_TIPOS[tipoSelecionado];

  if (!regras) {
    return [];
  }

  const jaTreinadas =
    escolhasPericiasArquetipo.filter(Boolean);

  return regras.opcoes.filter(
    nome => !jaTreinadas.includes(nome)
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

function renderizarPericiasTipo() {
  const regras = REGRAS_TIPOS[tipoSelecionado];

  if (!regras) {
    return;
  }

  const opcoes = obterOpcoesPericiasTipo();

  escolhasPericiasTipo = [
    ...new Set(escolhasPericiasTipo)
  ]
    .filter(nome => opcoes.includes(nome))
    .slice(0, regras.quantidade);

  $("grupo-pericias-tipo")?.remove();

  const secao = document.createElement("section");
  secao.id = "grupo-pericias-tipo";
  secao.className = "pericias-secao";

  const titulo = document.createElement("h3");
  titulo.textContent = "Perícias do Tipo";

  const instrucoes = document.createElement("p");
  instrucoes.className = "pericias-explicacao";

  instrucoes.textContent =
    `Escolha ${regras.quantidade} ${
      regras.quantidade === 1
        ? "perícia"
        : "perícias"
    } do Tipo ${tipoSelecionado}. ` +
    `Selecionadas: ${escolhasPericiasTipo.length}/${regras.quantidade}`;

  const lista = criarGruposPericias(
    opcoes,
    escolhasPericiasTipo,
    (nome, selecionado) => {
      if (selecionado) {
        escolhasPericiasTipo =
          escolhasPericiasTipo.filter(
            pericia => pericia !== nome
          );
      } else if (
        escolhasPericiasTipo.length < regras.quantidade
      ) {
        escolhasPericiasTipo.push(nome);
      }

      renderizarPericiasTipo();
      atualizarResumoPericias();
      renderizarExpertise();
      validarEscolhasPericias();
    }
  );

  secao.append(titulo, instrucoes, lista);

  const secaoEscolhas =
    $("pericias-escolhas").closest(".pericias-secao");

  secaoEscolhas.after(secao);
}

// ==========================================
// 26. RESUMO DOS TREINAMENTOS
// ==========================================

function atualizarResumoPericias() {
  const resumoPericias = $("pericias-resumo");

  resumoPericias.replaceChildren();

  obterTreinamentosAtuais().forEach(nome => {
    const cartao = document.createElement("div");
    cartao.className = "cartao-pericia";

    const texto = document.createElement("span");
    texto.className = "pericia-nome";
    texto.textContent = nome;

    const grau = document.createElement("span");
    grau.className = "pericia-grau";

    grau.textContent =
      periciaExpertise === nome
        ? "Expert"
        : "Treinado";

    cartao.append(texto, grau);
    resumoPericias.appendChild(cartao);
  });
}

// ==========================================
// 27. SELEÇÃO DE EXPERTISE
// ==========================================

function renderizarExpertise() {
  const treinadas = obterTreinamentosAtuais();

  // Remover Expertise inválida quando
  // uma perícia treinada for desmarcada

  if (
    periciaExpertise &&
    !treinadas.includes(periciaExpertise)
  ) {
    periciaExpertise = null;
  }

  let secao = $("grupo-expertise");

  if (!secao) {
    secao = document.createElement("section");
    secao.id = "grupo-expertise";
    secao.className = "pericias-secao";

    const resumoPericias = $("pericias-resumo");

    // Posicionar após o resumo das perícias
    resumoPericias.after(secao);
  }

  secao.replaceChildren();

  const titulo = document.createElement("h3");
  titulo.textContent = "Escolha sua Expertise";

  const descricao = document.createElement("p");
  descricao.className = "pericias-explicacao";
  descricao.textContent =
    "Escolha uma perícia treinada para elevar seu grau a Expert.";

  const contador = document.createElement("p");
  contador.className = "expertise-contador";
  contador.textContent =
    `Expertise selecionada: ${periciaExpertise ? "1/1" : "0/1"}`;

  const lista = document.createElement("div");
  lista.className = "pericias-lista";

  treinadas.forEach(nome => {
    const selecionado = periciaExpertise === nome;

    const cartao = criarCartaoPericia(
      nome,
      selecionado,
      () => {
        periciaExpertise =
          selecionado ? null : nome;

        atualizarResumoPericias();
        renderizarExpertise();
        validarEscolhasPericias();
      }
    );

    const indicador = cartao.querySelector(
      ".pericia-grau"
    );

    indicador.textContent =
      selecionado ? "Expert" : "Tornar Expert";

    lista.appendChild(cartao);
  });

  if (treinadas.length === 0) {
    const aviso = document.createElement("p");
    aviso.textContent =
      "Selecione suas perícias treinadas primeiro.";
    lista.appendChild(aviso);
  }

  secao.append(titulo, descricao, contador, lista);
}

// ==========================================
// 28. VALIDAÇÃO DAS PERÍCIAS
// ==========================================

function validarEscolhasPericias() {
  const regrasArquetipo = obterPericiasArquetipo();
  const regrasTipo = REGRAS_TIPOS[tipoSelecionado];

  if (!regrasTipo || regrasArquetipo.length === 0) {
    botaoContinuarPericias.disabled = true;
    return false;
  }

  const escolhasArquetipoValidas =
    regrasArquetipo.every((opcoes, indice) => {
      const nome = escolhasPericiasArquetipo[indice];
      return opcoes.includes(nome);
    });

  const nomesArquetipo =
    escolhasPericiasArquetipo.filter(Boolean);

  const arquetipoSemDuplicatas =
    new Set(nomesArquetipo).size ===
    nomesArquetipo.length;

  const opcoesTipo = obterOpcoesPericiasTipo();

  const escolhasTipoValidas =
    escolhasPericiasTipo.length === regrasTipo.quantidade &&
    escolhasPericiasTipo.every(nome =>
      opcoesTipo.includes(nome)
    );

  const tipoSemDuplicatas =
    new Set(escolhasPericiasTipo).size ===
    escolhasPericiasTipo.length;

  // Expertise obrigatória

  const expertiseValida =
    periciaExpertise !== null &&
    obterTreinamentosAtuais().includes(periciaExpertise);

  const valido =
    escolhasArquetipoValidas &&
    arquetipoSemDuplicatas &&
    escolhasTipoValidas &&
    tipoSemDuplicatas &&
    expertiseValida;

  botaoContinuarPericias.disabled = !valido;

  return valido;
}

// ==========================================
// FIM DA PARTE 5 - V0.5
// ==========================================


 // ==========================================
 // PARTE 6 - FINALIZAÇÃO E SALVAMENTO
 // ==========================================

// ==========================================
// 26. FINALIZAR CRIAÇÃO
// ==========================================

botaoContinuarPericias.addEventListener("click", () => {
  if (
    personagemAtualId ||
    !validarAtributos(atributos) ||
    !validarEscolhasPericias()
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
// 27. SALVAR NOVO SOBREVIVENTE
// ==========================================

botaoSalvar.addEventListener("click", () => {
  if (
    personagemAtualId ||
    !rascunhoConcluido ||
    !tipoSelecionado ||
    !arquetipoSelecionado ||
    !validarAtributos(atributos) ||
    !validarEscolhasPericias()
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
// 28. INICIALIZAÇÃO
// ==========================================

carregarBiblioteca();
atualizarAtributos();
mostrarBiblioteca();

// ==========================================
// FIM DA PARTE 6
// FIM DO SCRIPT.JS - V0.4
// ==========================================
