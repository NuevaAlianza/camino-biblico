async function cargarDatos() {
  const [quizRes, citasRes] = await Promise.all([
    fetch("datos/quiz.json").then(r => r.json()),
    fetch("datos/citas.json").then(r => r.json())
  ]);
  return { quiz: quizRes, citas: citasRes };
}

function generarEstructuraInicial(quiz, citas) {
  const categorias = {};
  const bloques = {};

  for (const item of quiz) {
    if (item.tipo !== "quiz comentado") continue;
    if (!categorias[item.categoria]) categorias[item.categoria] = {};
    categorias[item.categoria][item.tema] = {
      porcentaje: 0, nota: "F", estado: "no iniciado"
    };
  }

  for (const cita of citas) {
    const clave = `bloque-${cita.bloque}-${cita.modo || "basico"}`;
    if (!bloques[clave]) {
      bloques[clave] = { porcentaje: 0, nota: "F", estado: "no iniciado" };
    }
  }

  return { version: 1, categorias, bloques };
}

function obtenerNota(pct) {
  if (pct >= 90) return "A";
  if (pct >= 80) return "B";
  if (pct >= 70) return "C";
  if (pct >= 60) return "D";
  return "F";
}

function mostrarTarjetas(progreso, quiz, citas) {
  const contenedor = document.getElementById("tarjetas");
  contenedor.innerHTML = "";

  // Tarjetas de quiz
  for (const [categoria, temas] of Object.entries(progreso.categorias)) {
    for (const [tema, datos] of Object.entries(temas)) {
      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta";
      tarjeta.innerHTML = `
        <h3>${tema}</h3>
        <p><strong>Categoría:</strong> ${categoria}</p>
        <p><strong>Estado:</strong> ${datos.estado || "no iniciado"}</p>
        <p><strong>Aciertos:</strong> ${datos.porcentaje || 0}%</p>
        <p><strong>Nota:</strong> ${datos.nota || "F"}</p>
      `;
      contenedor.appendChild(tarjeta);
    }
  }

  // Tarjetas de citas
  for (const [bloque, datos] of Object.entries(progreso.bloques)) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML = `
      <h3>${bloque}</h3>
      <p><strong>Estado:</strong> ${datos.estado || "no iniciado"}</p>
      <p><strong>Aciertos:</strong> ${datos.porcentaje || 0}%</p>
      <p><strong>Nota:</strong> ${datos.nota || "F"}</p>
    `;
    contenedor.appendChild(tarjeta);
  }
}

function borrarProgreso(base) {
  if (confirm("¿Seguro que quieres borrar todo el progreso?")) {
    localStorage.setItem("progreso", JSON.stringify(base));
    location.reload();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const { quiz, citas } = await cargarDatos();
  const base = generarEstructuraInicial(quiz, citas);

  // Cargar o inicializar
  let progreso = JSON.parse(localStorage.getItem("progreso"));
  if (!progreso || !progreso.version) {
    progreso = structuredClone(base);
    localStorage.setItem("progreso", JSON.stringify(progreso));
  }

  mostrarTarjetas(progreso, quiz, citas);

  document.getElementById("borrarProgreso").addEventListener("click", () => borrarProgreso(base));
});
