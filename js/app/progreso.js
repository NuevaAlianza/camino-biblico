document.addEventListener("DOMContentLoaded", () => {
  mostrarResumenGeneral();
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

      const imagenNombre = `${tema.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      const rutaImagen = `assets/img/coleccionables/${imagenNombre}`;

      colIzq.innerHTML += `
        <div class="tema">
          <h3>${tema}</h3>
          <div class="contenedor-imagen">
            <img src="${rutaImagen}" alt="${tema}" />
          </div>
          <p>Nota: <span class="etiqueta-nota nota-${nota.toLowerCase()}">${nota}</span></p>
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
      <div class="nota-contenedor">
        <div class="bloque-nota">
          <div class="etiqueta">Mejor nota por tema</div>
          <div class="etiqueta-nota nota-${notaAlcanzada.toLowerCase()}">${notaAlcanzada}</div>
        </div>
        <div class="bloque-nota">
          <div class="etiqueta">Rendimiento total</div>
          <div class="etiqueta-nota nota-${notaProm.toLowerCase()}">${notaProm}</div>
          <div class="bloque-rendimiento">${todasNotas.length} intento(s) • ${promedioReal}% de aciertos</div>
        </div>
      </div>
    `;

    resumen.appendChild(colIzq);
    resumen.appendChild(colDer);
    contenedor.appendChild(resumen);
  });
}
