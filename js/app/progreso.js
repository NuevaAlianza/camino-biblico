// js/app/progreso.js
const progresoBase = {
  version: 1,
  categorias: {
    "Personajes Bíblicos": {
      "David": { porcentaje: 0, nota: "F", estado: "no iniciado" },
      "Salomón": { porcentaje: 0, nota: "F", estado: "no iniciado" },
      "Pablo": { porcentaje: 0, nota: "F", estado: "no iniciado" },
      "Pedro": { porcentaje: 0, nota: "F", estado: "no iniciado" },
      "Elías": { porcentaje: 0, nota: "F", estado: "no iniciado" },
      "José – Hijo de Jacob": { porcentaje: 0, nota: "F", estado: "no iniciado" }
    }
  },
  bloques: {
    "bloque-1-basico": { porcentaje: 0, nota: "F", estado: "no iniciado" },
    "bloque-2-basico": { porcentaje: 0, nota: "F", estado: "no iniciado" },
    "bloque-1-avanzado": { porcentaje: 0, nota: "F", estado: "no iniciado" },
    "bloque-2-avanzado": { porcentaje: 0, nota: "F", estado: "no iniciado" }
  }
};

function cargarProgreso() {
  let progreso = JSON.parse(localStorage.getItem("progreso")) || structuredClone(progresoBase);

  // Quiz comentado: sumar totales de temas
  let totalQuiz = 0;
  let correctasQuiz = 0;
  for (const categoria of Object.values(progreso.categorias || {})) {
    for (const tema of Object.values(categoria)) {
      totalQuiz += 1;
      correctasQuiz += Math.round((tema.porcentaje || 0) / 100);
    }
  }
  document.getElementById('quiz-total').textContent = `Total preguntas respondidas: ${totalQuiz}`;
  document.getElementById('quiz-correctas').textContent = `Respuestas correctas: ${correctasQuiz}`;
  const pctQuiz = totalQuiz > 0 ? Math.round((correctasQuiz / totalQuiz) * 100) : 0;
  document.getElementById('quiz-porcentaje').textContent = `Porcentaje de aciertos: ${pctQuiz}%`;

  // Citas: sumar bloques
  let totalCitas = 0;
  let correctasCitas = 0;
  for (const bloque of Object.values(progreso.bloques || {})) {
    totalCitas += 1;
    correctasCitas += Math.round((bloque.porcentaje || 0) / 100);
  }
  document.getElementById('citas-total').textContent = `Total preguntas respondidas: ${totalCitas}`;
  document.getElementById('citas-correctas').textContent = `Respuestas correctas: ${correctasCitas}`;
  const pctCitas = totalCitas > 0 ? Math.round((correctasCitas / totalCitas) * 100) : 0;
  document.getElementById('citas-porcentaje').textContent = `Porcentaje de aciertos: ${pctCitas}%`;
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

