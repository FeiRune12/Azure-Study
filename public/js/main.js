function getProgresso() {
  return JSON.parse(localStorage.getItem("progresso")) || { aulas: {} };
}

function salvarProgresso(progresso) {
  localStorage.setItem("progresso", JSON.stringify(progresso));
}