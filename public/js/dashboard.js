const select = document.getElementById("nivel");

// salvar nível
select.addEventListener("change", () => {
  localStorage.setItem("nivel", select.value);
});

// carregar nível
window.onload = () => {
  const nivel = localStorage.getItem("nivel");
  if (nivel) select.value = nivel;
};

// carregar aulas
fetch("data/aulas.json")
  .then(res => res.json())
  .then(aulas => {
    const container = document.querySelector(".grid");
    const progresso = getProgresso();

    aulas.forEach(aula => {
      const concluido = progresso.aulas[aula.id]?.concluido;

      const div = document.createElement("div");
      div.classList.add("card");

      div.innerHTML = `
        <h3>${aula.titulo}</h3>
        <p>${aula.materia}</p>
        <p>${concluido ? "✔️ Concluído" : "Pendente"}</p>
      `;

      div.onclick = () => {
        window.location.href = `aula.html?id=${aula.id}`;
      };

      container.appendChild(div);
    });
  });

function continuarAula() {
  const progresso = getProgresso();

  const aula = Object.keys(progresso.aulas).find(
    id => !progresso.aulas[id].concluido
  );

  if (aula) {
    window.location.href = `aula.html?id=${aula}`;
  } else {
    alert("Nenhuma aula pendente");
  }
}