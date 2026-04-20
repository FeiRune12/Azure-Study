// PEGAR ID DA URL
const params = new URLSearchParams(window.location.search);
const aulaId = params.get("id");

let aulaAtual = null;

// BUSCAR AULA NO JSON
fetch("data/aulas.json")
  .then(res => res.json())
  .then(aulas => {
    aulaAtual = aulas.find(a => a.id == aulaId);

    if (!aulaAtual) {
      alert("Aula não encontrada!");
      return;
    }

    const nivel = localStorage.getItem("nivel") || "fundamental";
    const busca = aulaAtual.busca[nivel];

    buscarVideo(busca);
    carregarNotas();
    carregarVideoSalvo();
  });


// 🔎 BUSCAR VÍDEOS (AGORA PELO BACKEND)
async function buscarVideo(termo) {
  try {
    const res = await fetch(`/api/videos?q=${encodeURIComponent(termo)}`);
    const data = await res.json();

    if (!data.items) {
      console.error("Erro na resposta da API", data);
      return;
    }

    mostrarVideos(data.items);
  } catch (erro) {
    console.error("Erro ao buscar vídeos:", erro);
  }
}


// 🎥 MOSTRAR VÍDEOS
function mostrarVideos(videos) {
  const container = document.getElementById("videoOptions");
  container.innerHTML = "";

  videos.forEach(v => {
    const id = v.id.videoId;

    const div = document.createElement("div");
    div.classList.add("video-card");

    div.innerHTML = `
      <img src="${v.snippet.thumbnails.medium.url}">
      <p>${v.snippet.title}</p>
      <button onclick="carregarVideo('${id}')">Assistir</button>
    `;

    container.appendChild(div);
  });
}


// ▶️ CARREGAR VÍDEO
function carregarVideo(id) {
  document.querySelector("iframe").src =
    `https://www.youtube.com/embed/${id}`;

  const progresso = getProgresso();

  if (!progresso.aulas[aulaId]) {
    progresso.aulas[aulaId] = {};
  }

  progresso.aulas[aulaId].videoId = id;

  salvarProgresso(progresso);
}


// 🔁 CARREGAR VÍDEO SALVO
function carregarVideoSalvo() {
  const progresso = getProgresso();

  const videoId = progresso.aulas[aulaId]?.videoId;

  if (videoId) {
    document.querySelector("iframe").src =
      `https://www.youtube.com/embed/${videoId}`;
  }
}


// 🧪 CONCLUIR AULA
function concluirAula() {
  const progresso = getProgresso();

  if (!progresso.aulas[aulaId]) {
    progresso.aulas[aulaId] = {};
  }

  progresso.aulas[aulaId].concluido = true;

  salvarProgresso(progresso);

  alert("Aula concluída! 🎉");
}


// 📝 SALVAR NOTAS
function salvarNotas() {
  const texto = document.getElementById("noteArea").value;
  localStorage.setItem("notas_" + aulaId, texto);
}


// 📖 CARREGAR NOTAS
function carregarNotas() {
  const notas = localStorage.getItem("notas_" + aulaId);

  if (notas) {
    document.getElementById("noteArea").value = notas;
  }
}