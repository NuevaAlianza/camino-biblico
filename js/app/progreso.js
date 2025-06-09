// Genera tarjetas resumen por categoría desde localStorage
function generarResumenCategorias() {
  const progreso = JSON.parse(localStorage.getItem("progreso"));
  const historial = JSON.parse(localStorage.getItem("historial")) || [];

  if (!progreso?.categorias) return;

  const notaValor = { A: 5, B: 4, C: 3, D: 2, F: 1 };
  const valorNota = { 5: "A", 4: "B", 3: "C", 2: "D", 1: "F" };

  const contenedor = document.getElementById("resumen-categorias");
  contenedor.innerHTML = "";

  for (const categoria in progreso.categorias) {
    const temas = progreso.categorias[categoria];
    const resumenTemas = [];

    for (const tema in temas) {
      const datos = temas[tema];
      const intentos = historial.filter(h => h.tema === tema).length;
      resumenTemas.push({
        tema,
        nota_max: datos.nota,
        nota_min: datos.nota, // se puede extender si se almacenan más datos
        intentos,
        valor: notaValor[datos.nota] || 1
      });
    }

    const valores = resumenTemas.map(t => t.valor);
    const peorMejorNota = Math.min(...valores);
    const promedioNotas = Math.round(valores.reduce((a, b) => a + b, 0) / valores.length);

    const nivelAlcanzado = valorNota[peorMejorNota];
    const promedioGeneral = valorNota[promedioNotas];

    // Crear HTML
    const tarjeta = document.createElement("div");
    tarjeta.className = "resumen-categoria";

    let htmlTemas = `<h2>${categoria}</h2>`;
    resumenTemas.forEach(t => {
      htmlTemas += `
        <div class="tema">
          <h3>${t.tema}</h3>
          <p>Nota más alta: ${t.nota_max}</p>
          <p>Nota más baja: ${t.nota_min}</p>
          <p>Intentos: ${t.intentos}</p>
        </div>`;
    });

    tarjeta.innerHTML = `
      <div class="columna-izquierda">${htmlTemas}</div>
      <div class="columna-derecha">
        <div class="etiqueta">Nivel alcanzado</div>
        <div class="nota-final ${nivelAlcanzado}">${nivelAlcanzado}</div>
        <div class="nota-promedio">Promedio general: ${promedioGeneral}</div>
      </div>`;

    contenedor.appendChild(tarjeta);
  }
}

generarResumenCategorias();
