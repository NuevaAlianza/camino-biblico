// js/app/progreso.js

document.addEventListener("DOMContentLoaded", () => {
  const historial = JSON.parse(localStorage.getItem("historial")) || [];

  const totalQuizzes = historial.length;
  const promedio = totalQuizzes > 0
    ? Math.round(historial.reduce((acc, cur) => acc + (cur.puntaje / cur.total) * 100, 0) / totalQuizzes)
    : 0;

  document.getElementById("total-quizzes").textContent = totalQuizzes;
  document.getElementById("promedio").textContent = `${promedio}%`;

  // Generar gráfico
  const temas = {};
  historial.forEach(entry => {
    if (!temas[entry.tema]) temas[entry.tema] = [];
    temas[entry.tema].push((entry.puntaje / entry.total) * 100);
  });

  const labels = Object.keys(temas);
  const datos = labels.map(t => {
    const arr = temas[t];
    return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  });

  new Chart(document.getElementById("grafico"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "% Aciertos por tema",
        data: datos,
        backgroundColor: "#ab47bc"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });

  // Mostrar historial
  const ul = document.getElementById("historial");
  historial.slice().reverse().forEach(item => {
    const li = document.createElement("li");
    const fecha = new Date(item.fecha).toLocaleDateString();
    li.textContent = `${item.tema} (${item.tipo}) – ${item.puntaje}/${item.total} el ${fecha}`;
    ul.appendChild(li);
  });
});
