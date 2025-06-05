const progresoBase = {
  version: 1,
  categorias: {}, // se llenará dinámicamente según los temas del quiz
  bloques: {}     // se llenará según bloques de citas jugados
};

function calcularNota(p) {
  if (p >= 95) return "A+";
  if (p >= 90) return "A";
  if (p >= 80) return "B+";
  if (p >= 70) return "B";
  if (p >= 60) return "C";
  if (p >= 40) return "D";
  return "F";
}

function guardarProgreso(tipo, clave, correctas, total) {
  const porcentaje = Math.round((correctas / total) * 100);
  const nota = calcularNota(porcentaje);
  const estado = porcentaje === 100 ? "completado" : porcentaje >= 40 ? "en progreso" : "no iniciado";

  let progreso = JSON.parse(localStorage.getItem("progreso")) || structuredClone(progresoBase);

  if (tipo === "quiz comentado") {
    for (const cat in progreso.categorias) {
      if (progreso.categorias[cat][clave]) {
        progreso.categorias[cat][clave] = { porcentaje, nota, estado };
        localStorage.setItem("progreso", JSON.stringify(progreso));
        return;
      }
    }
    // si no existe, crear nueva categoría/tema
    progreso.categorias["Otros"] ??= {};
    progreso.categorias["Otros"][clave] = { porcentaje, nota, estado };
  }

  if (tipo === "citas") {
    progreso.bloques[clave] = { porcentaje, nota, estado };
  }

  localStorage.setItem("progreso", JSON.stringify(progreso));
}

function cargarProgreso() {
  let progreso = JSON.parse(localStorage.getItem("progreso")) || structuredClone(progresoBase);

  // Quiz comentado: contar temas
  let totalQuiz = 0;
  let correctasQuiz = 0;
  for (const categoria of Object.values(progreso.categorias || {})) {
    for (const tema of Object.values(categoria)) {
      totalQuiz += 1;
      correctasQuiz += Math.round((tema.porcentaje || 0) / 100);
    }
  }

  document.getElementById("quiz-total").textContent = `Total preguntas respondidas: ${totalQuiz}`;
  document.getElementById("quiz-correctas").textContent = `Respuestas correctas: ${correctasQuiz}`;
  const pctQuiz = totalQuiz > 0 ? Math.round((correctasQuiz / totalQuiz) * 100) : 0;
  document.getElementById("quiz-porcentaje").textContent = `Porcentaje de aciertos: ${pctQuiz}%`;

  // Citas
  let totalCitas = 0;
  let correctasCitas = 0;
  for (const bloque of Object.values(progreso.bloques || {})) {
    totalCitas += 1;
    correctasCitas += Math.round((bloque.porcentaje || 0) / 100);
  }

  document.getElementById("citas-total").textContent = `Total preguntas respondidas: ${totalCitas}`;
  document.getElementById("citas-correctas").textContent = `Respuestas correctas: ${correctasCitas}`;
  const pctCitas = totalCitas > 0 ? Math.round((correctasCitas / totalCitas) * 100) : 0;
  document.getElementById("citas-porcentaje").textContent = `Porcentaje de aciertos: ${pctCitas}%`;
}

function borrarProgreso() {
  if (confirm("¿Seguro que quieres borrar todo el progreso?")) {
    localStorage.setItem("progreso", JSON.stringify(structuredClone(progresoBase)));
    cargarProgreso();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarProgreso();
  document.getElementById("borrarProgreso").addEventListener("click", borrarProgreso);
});
