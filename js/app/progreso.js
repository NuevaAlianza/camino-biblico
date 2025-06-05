document.addEventListener("DOMContentLoaded", () => {
  const tarjetasQuiz = document.getElementById("tarjetas-quiz");
  const tarjetasCitas = document.getElementById("tarjetas-citas");

  const temasQuiz = [
    { categoria: "Personajes", tema: "David", porcentaje: 75 },
    { categoria: "Profetas", tema: "Elías", porcentaje: 92 },
    { categoria: "Apóstoles", tema: "Pedro", porcentaje: 50 },
  ];

  const bloquesCitas = [
    { bloque: "bloque-1-basico", porcentaje: 100 },
    { bloque: "bloque-2-avanzado", porcentaje: 68 },
  ];

  function calcularNota(pct) {
    if (pct >= 90) return "A";
    if (pct >= 75) return "B";
    if (pct >= 60) return "C";
    if (pct >= 40) return "D";
    return "F";
  }

  temasQuiz.forEach(t => {
    const nota = calcularNota(t.porcentaje);
    const div = document.createElement("div");
    div.className = "tarjeta";
    div.innerHTML = `
      <div class="nota nota-${nota}">${nota}</div>
      <h3>${t.tema}</h3>
      <p><strong>Categoría:</strong> ${t.categoria}</p>
      <p><strong>Aciertos:</strong> ${t.porcentaje}%</p>
    `;
    tarjetasQuiz.appendChild(div);
  });

  bloquesCitas.forEach(b => {
    const nota = calcularNota(b.porcentaje);
    const div = document.createElement("div");
    div.className = "tarjeta";
    div.innerHTML = `
      <div class="nota nota-${nota}">${nota}</div>
      <h3>${b.bloque.replace(/-/g, " ")}</h3>
      <p><strong>Aciertos:</strong> ${b.porcentaje}%</p>
    `;
    tarjetasCitas.appendChild(div);
  });
});

