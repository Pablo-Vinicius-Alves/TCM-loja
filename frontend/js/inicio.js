document.addEventListener('DOMContentLoaded', () => {
  // Lista completa com todas as peças da loja e seus textos editoriais
  const listaSlides = [
    {
      imagem: "../imag/images.jpg",
      selo: "✦ EDIÇÃO RARA",
      colecao: "CREPÚSCULO DOURADO · COLEÇÃO DE INVERNO",
      titulo: "Vestido de Seda Imperial",
      italico: "seda pura e corte nobre",
      descricao: "Seda pura em tom profundo, caimento fluido e acabamento artesanal com detalhes dourados exclusivos da grife.",
      preco: "R$ 1.899,00"
    },
    {
      imagem: "../imag/purple-open-back-cape-dress-rhinestone-detail-hotel.webp",
      selo: "✦ ALTA COSTURA",
      colecao: "CREPÚSCULO DOURADO · COLEÇÃO DE INVERNO",
      titulo: "Vestido Cravejado",
      italico: "bordado a mão",
      descricao: "Modelagem estruturada com capa fluida e aplicações brilhantes aplicadas artesanalmente para noites de gala.",
      preco: "R$ 2.450,00"
    },
    {
      imagem: "../imag/images (1).jpg",
      selo: "✦ ATEMPORAL",
      colecao: "ESTILO PARA O ANO TODO · ALFAIATARIA",
      titulo: "Sobretudo Casual Urbano",
      italico: "corte contemporâneo",
      descricao: "Tecido encorpado de toque macio, ideal para compor visuais sofisticados em qualquer estação do ano.",
      preco: "R$ 749,00"
    },
    {
      imagem: "../imag/cf304a7455fe18cfe8936889e975e63e.jpg",
      selo: "✦ CONFORTO NOBRE",
      colecao: "ESTILO PARA O ANO TODO · TRICÔ FINO",
      titulo: "Blusa de Lã Premium",
      italico: "fios selecionados",
      descricao: "Trama delicada de lã selecionada que une leveza térmica e caimento impecável para o dia a dia.",
      preco: "R$ 780,00"
    },
    {
      imagem: "../imag/images (2).jpg",
      selo: "✦ SOB MEDIDA",
      colecao: "ESTILO PARA O ANO TODO · CLÁSSICO",
      titulo: "Terno Slim Fit Casual",
      italico: "alfaiataria precisa",
      descricao: "Corte ajustado com acabamento refinado, oferecendo elegância discreta e conforto prolongado.",
      preco: "R$ 599,00"
    }
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

  // Atualiza todos os elementos do carrossel e reinicia a animação suave
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

    // Reinicia a animação de entrada suave do texto a cada troca
    if (blocoTexto) {
      blocoTexto.style.animation = 'none';
      blocoTexto.offsetHeight; // Força o navegador a reiniciar a animação
      blocoTexto.style.animation = 'surgirSuave 0.7s ease-out';
    }
  }

  // Avança para a próxima peça
  function proximoSlide() {
    indiceAtual = (indiceAtual + 1) % listaSlides.length;
    mostrarSlide(indiceAtual);
  }

  // Volta para a peça anterior
  function slideAnterior() {
    indiceAtual = (indiceAtual - 1 + listaSlides.length) % listaSlides.length;
    mostrarSlide(indiceAtual);
  }

  if (botaoAvancar) botaoAvancar.addEventListener('click', proximoSlide);
  if (botaoVoltar) botaoVoltar.addEventListener('click', slideAnterior);

  // Carrega a primeira peça ao abrir
  mostrarSlide(0);

  // Troca automaticamente a cada 6 segundos
  setInterval(proximoSlide, 6000);
});