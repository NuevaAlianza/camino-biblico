// js/app/progreso.js

const progresoBase = {
  version: 2,
  categorias: {},
  bloques: {}
};

async function cargarDatos() {
  const [quizResp, citasResp] = await Promise.all([
    fetch("datos/quiz.json").then(r => r.json()),
    fetch("datos/citas.json").then(r => r.json())
  ]);
  return { quiz: quizResp, citas: citasResp };
}

function calcularNota(porcentaje) {
  if (porcentaje >= 90) return "A";
  if (porcentaje >= 75) return "B";
  if (porcentaje >= 60) return "C";
  if (porcentaje >= 40) return "D";
  return "F";
}

function generarTarjetas(datos, progreso) {
  const quizCont = document.getElementById("tarjetas-quiz");
  const citasCont = document.getElementById("tarjetas-citas");
  quizCont.innerHTML = "";
  citasCont.innerHTML = "";

  // Quiz comentado
  const categorias = {};
  datos.quiz.filter(p => p.tipo === "quiz comentado").forEach(p => {
    if (!categorias[p.categoria]) categorias[p.categoria] = new Set();
    categorias[p.categoria].add(p.tema);
  });

  for (const [cat, temas] of Object.entries(categorias)) {
    for (const tema of temas) {
      const registro = (progreso.categorias?.[cat]?.[tema]) || { porcentaje: 0 };
      const nota = calcularNota(registro.porcentaje);

      const card = document.createElement("div");
      card.className = "tarjeta";
      card.innerHTML = `
        <div class="nota-grande nota-${nota}">${nota}</div>
        <h3>${tema}</h3>
        <p><strong>Categoría:</strong> ${cat}</p>
        <p><strong>Aciertos:</strong> ${registro.porcentaje || 0}%</p>
      `;
      quizCont.appendChild(card);
    }
  }

  // Citas bíblicas
  const bloques = new Set(datos.citas.map(c => `bloque-${c.bloque}-${c.modo || "basico"}`));

  for (const bloque of bloques) {
    const registro = progreso.bloques?.[bloque] || { porcentaje: 0 };
    const nota = calcularNota(registro.porcentaje);

    const card = document.createElement("div");
    card.className = "tarjeta";
    card.innerHTML = `
      <div class="nota-grande nota-${nota}">${nota}</div>
      <h3>${bloque.replace(/-/g, " ")}</h3>
      <p><strong>Aciertos:</strong> ${registro.porcentaje || 0}%</p>
    `;
    citasCont.appendChild(card);
  }
}

function borrarProgreso() {
  if (confirm("¿Seguro que quieres borrar todo el progreso?")) {
    localStorage.setItem("progreso", JSON.stringify(structuredClone(progresoBase)));
    location.reload();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const datos = await cargarDatos();
  const progreso = JSON.parse(localStorage.getItem("progreso")) || structuredClone(progresoBase);

  generarTarjetas(datos, progreso);
  document.getElementById("borrarProgreso").addEventListener("click", borrarProgreso);
});
