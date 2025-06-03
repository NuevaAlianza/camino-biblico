document.addEventListener("DOMContentLoaded", () => {
  const progreso = JSON.parse(localStorage.getItem("progreso")) || [];

  // Mostrar resumen
  document.getElementById("total-quizzes").textContent = progreso.length;

  if (progreso.length === 0) {
    document.getElementById("promedio").textContent = "0%";
    return;
  }

  const promedio = progreso.reduce((acc, item) => acc + (item.puntaje / item.total), 0) / progreso.length;
  document.getElementById("promedio").textContent = `${Math.round(promedio * 100)}%`;

  // Estadísticas por tema
  const porTema = {};
  progreso.forEach(({ tema, puntaje, total }) => {
    if (!porTema[tema]) porTema[tema] = { total: 0, aciertos: 0 };
    porTema[tema].total += total;
    porTema[tema].aciertos += puntaje;
  });

  const temas = Object.keys(porTema);
  const aciertos = temas.map(t => Math.round((porTema[t].aciertos / porTema[t].total) * 100));

  new Chart(document.getElementById("grafico-temas"), {
    type: 'bar',
    data: {
      labels: temas,
      datasets: [{
        label: '% Aciertos por tema',
        data: aciertos,
        backgroundColor: 'rgba(102, 0, 153, 0.6)',
        borderColor: 'rgba(102, 0, 153, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });

  // Mostrar historial
  const lista = document.getElementById("lista-historial");
  progreso.reverse().forEach(({ categoria, tema, puntaje, total, fecha }) => {
    const li = document.createElement("li");
    li.textContent = `${tema} (${categoria}) – ${puntaje}/${total} el ${new Date(fecha).toLocaleDateString()}`;
    lista.appendChild(li);
  });
});


