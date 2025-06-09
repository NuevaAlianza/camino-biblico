// js/app/progreso.js

document.addEventListener("DOMContentLoaded", () => {
  mostrarResumenGeneral();
  mostrarHistorial();
  mostrarResumenPorCategoria();
});

function mostrarResumenGeneral() {
  const historial = JSON.parse(localStorage.getItem("historial")) || [];
  const total = historial.length;

  const aciertos = historial.reduce((acc, h) => acc + (h.puntaje || 0), 0);
  const posibles = historial.reduce((acc, h) => acc + (h.total || 0), 0);

  const promedio = posibles > 0 ? Math.round((aciertos / posibles) * 100) : 0;

  document.getElementById("total-quizzes").textContent = total;
  document.getElementById("promedio").textContent = `${promedio}%`;

  mostrarGrafico(historial);
}

function mostrarGrafico(historial) {
  const temas = {};
  historial.forEach(h => {
    if (!temas[h.tema]) temas[h.tema] = { aciertos: 0, total: 0 };
    temas[h.tema].aciertos += h.puntaje;
    temas[h.tema].total += h.total;
  });

  const etiquetas = Object.keys(temas);
  const datos = etiquetas.map(t => Math.round((temas[t].aciertos / temas[t].total) * 100));

  new Chart(document.getElementById("grafico"), {
    type: "bar",
    data: {
      labels: etiquetas,
      datasets: [{
        label: "% de aciertos",
        data: datos,
        backgroundColor: "#a56ef8"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
}

function mostrarHistorial() {
  const historial = JSON.parse(localStorage.getItem("historial")) || [];
  const lista = document.getElementById("historial");
  historial
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .forEach(h => {
      const li = document.createElement("li");
      li.textContent = `${h.tema} - ${h.puntaje}/${h.total} - ${new Date(h.fecha).toLocaleString()}`;
      lista.appendChild(li);
    });
}

function mostrarResumenPorCategoria() {
  const progreso = JSON.parse(localStorage.getItem("progreso")) || { categorias: {} };
  const historial = JSON.parse(localStorage.getItem("historial")) || [];

  const contenedor = document.getElementById("contenedor-resumen-categorias");
  contenedor.innerHTML = "";

  const categorias = progreso.categorias || {};

  Object.entries(categorias).forEach(([categoria, temas]) => {
    const resumen = document.createElement("section");
    resumen.className = "resumen-categoria";

    const colIzq = document.createElement("div");
    colIzq.className = "columna-izquierda";
    colIzq.innerHTML = `<h2>${categoria}</h2>`;

    let mejoresNotas = [];

    Object.entries(temas).forEach(([tema, info]) => {
      const nota = info.nota || "F";
      const intentos = historial.filter(i => i.tema === tema && i.tipo === "quiz comentado").length;
      mejoresNotas.push(nota);

      colIzq.innerHTML += `
        <div class="tema">
          <h3>${tema}</h3>
          <p>Nota: <strong>${nota}</strong></p>
          <p>Intentos: ${intentos}</p>
        </div>
      `;
    });

    const colDer = document.createElement("div");
    colDer.className = "columna-derecha";

    const notasOrden = ["A", "B", "C", "D", "F"];
    const notaAlcanzada = mejoresNotas.sort((a, b) => notasOrden.indexOf(a) - notasOrden.indexOf(b))[0] || "F";

    const todasNotas = historial
      .filter(h => Object.keys(temas).includes(h.tema))
      .map(h => h.puntaje / h.total);

    const promedioReal = todasNotas.length > 0
      ? Math.round((todasNotas.reduce((a, b) => a + b, 0) / todasNotas.length) * 100)
      : 0;

    let notaProm = "F";
    if (promedioReal >= 90) notaProm = "A";
    else if (promedioReal >= 80) notaProm = "B";
    else if (promedioReal >= 70) notaProm = "C";
    else if (promedioReal >= 60) notaProm = "D";

    colDer.innerHTML = `
      <div class="etiqueta">Nivel alcanzado</div>
      <div class="nota-final ${notaAlcanzada}">${notaAlcanzada}</div>
      <div class="nota-promedio">Promedio de intentos: ${promedioReal}% (${notaProm})</div>
    `;

    resumen.appendChild(colIzq);
    resumen.appendChild(colDer);
    contenedor.appendChild(resumen);
  });
}
