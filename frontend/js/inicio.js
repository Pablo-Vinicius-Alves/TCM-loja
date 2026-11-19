document.addEventListener('DOMContentLoaded', () => {
  const listaSlides = [
    {
      imagem: "../imgs/vestido_amarelos.jpg",
      selo: "✦ EDIÇÃO RARA",
      colecao: "CREPÚSCULO DOURADO · COLEÇÃO DE INVERNO",
      titulo: "Vestido de Seda Imperial",
      italico: "seda pura e corte nobre",
      descricao: "Seda pura em tom profundo, caimento fluido e acabamento artesanal, feito com Lã Vicunha obtida de um raro camélido sul-americano dos Andes",
      preco: "R$ 25.600"
    },
    {
      imagem: "../imgs/vestido_brilho.jpg",
      selo: "✦ ALTA COSTURA",
      colecao: "CREPÚSCULO DOURADO · COLEÇÃO DE INVERNO",
      titulo: "Vestido Cravejado",
      italico: "bordado a mão",
      descricao: "Modelagem estruturada com brilho intenso e aplicações feitas artesanalmente para noites de gala.",
      preco: "R$ 50.900"
    },
    {
      imagem: "../imgs/vestido_ind.jpg",
      selo: "✦ CONFORTO NOBRE",
      colecao: "ESTILO PARA O ANO TODO · EDIÇÃO LIMITADA",
      titulo: "Vestido Flores Ouro",
      italico: "estampa exclusiva",
      descricao: "Tecido encorpado com estampa floral de ouro alto relevo, feito com Seda de Lótus",
      preco: "R$ 2.890,00"
    },
    {
      imagem: "../imgs/look.jpg",
      selo: "✦ SOB MEDIDA",
      colecao: "ESTILO PARA O ANO TODO · ALFAIATARIA",
      titulo: "Blazer Preto Cravejado",
      italico: "alfaiataria precisa",
      descricao: "Corte ajustado com acabamento refinado e detalhes brilhantes, oferecendo elegância marcante.",
      preco: "R$ 4.600,00"
    },
    {
      imagem: "../imgs/vestido_grande.jpg",
      selo: "✦ COLEÇÃO MÍSTICA",
      colecao: "CREPÚSCULO DOURADO · GALA",
      titulo: "Vestido Teias Violetas",
      italico: "capa fluida",
      descricao: "Vestido longo em tom violeta profundo com capa transparente, feito com a parente selvagem da vicunha e da lhama que também vive nos Andes a Lã de Guanaco.",
      preco: "R$ 1.200,00"
    },
  ];

  let indiceAtual = 0;

  const elementoImagem = document.getElementById('imagem-slide');
  const elementoSelo = document.getElementById('selo-slide');
  const elementoColecao = document.getElementById('colecao-slide');
  const elementoTitulo = document.getElementById('titulo-slide');
  const elementoItalico = document.getElementById('italico-slide');
  const elementoDescricao = document.getElementById('descricao-slide');
  const elementoPreco = document.getElementById('preco-slide');
  const blocoTexto = document.getElementById('bloco-texto-slide');
  const botaoVoltar = document.getElementById('botao-voltar-slide');
  const botaoAvancar = document.getElementById('botao-avancar-slide');

  if (!elementoImagem) return;

  function mostrarSlide(indice) {
    const slide = listaSlides[indice];

    elementoImagem.src = slide.imagem;
    elementoImagem.alt = slide.titulo;
    if (elementoSelo) elementoSelo.innerText = slide.selo;
    if (elementoColecao) elementoColecao.innerText = slide.colecao;
    if (elementoTitulo) elementoTitulo.innerText = slide.titulo;
    if (elementoItalico) elementoItalico.innerText = slide.italico;
    if (elementoDescricao) elementoDescricao.innerText = slide.descricao;
    if (elementoPreco) elementoPreco.innerText = slide.preco;

    if (blocoTexto) {
      blocoTexto.style.animation = 'none';
      blocoTexto.offsetHeight; 
      blocoTexto.style.animation = 'surgirSuave 0.7s ease-out';
    }
  }

  function proximoSlide() {
    indiceAtual = (indiceAtual + 1) % listaSlides.length;
    mostrarSlide(indiceAtual);
  }

  function slideAnterior() {
    indiceAtual = (indiceAtual - 1 + listaSlides.length) % listaSlides.length;
    mostrarSlide(indiceAtual);
  }

  if (botaoAvancar) botaoAvancar.addEventListener('click', proximoSlide);
  if (botaoVoltar) botaoVoltar.addEventListener('click', slideAnterior);

  mostrarSlide(0);

  setInterval(proximoSlide, 6000);
});