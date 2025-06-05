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
    for (let cat in progreso.categorias) {
      if (progreso.categorias[cat][clave]) {
        progreso.categorias[cat][clave] = { porcentaje, nota, estado };
        break;
      }
    }
  }

  if (tipo === "citas") {
    progreso.bloques[clave] = { porcentaje, nota, estado };
  }

  localStorage.setItem("progreso", JSON.stringify(progreso));
}

function mostrarTarjetasDesdeProgreso() {
  const contenedor = document.getElementById("tarjetas-progreso");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  let progreso = JSON.parse(localStorage.getItem("progreso"));

  if (!progreso || typeof progreso !== "object" || !progreso.version) {
    console.warn("Progreso vacío o inválido. Cargando base.");
    progreso = structuredClone(progresoBase);
  }

  if (progreso.categorias) {
    for (const [categoria, temas] of Object.entries(progreso.categorias)) {
      for (const [tema, datos] of Object.entries(temas)) {
        contenedor.appendChild(crearTarjeta({
          titulo: tema,
          subtitulo: categoria,
          ...datos
        }));
      }
    }
  }

  if (progreso.bloques) {
    for (const [bloque, datos] of Object.entries(progreso.bloques)) {
      contenedor.appendChild(crearTarjeta({
        titulo: bloque.replaceAll("-", " "),
        subtitulo: "Citas Bíblicas",
        ...datos
      }));
    }
  }
}

function crearTarjeta({ titulo, subtitulo, porcentaje, nota, estado }) {
  const div = document.createElement("div");
  const clase = nota === "A+" ? "Amas" : nota === "B+" ? "Bmas" : nota;
  div.className = `tarjeta ${clase}`;
  div.innerHTML = `
    <h3>${titulo}</h3>
    <p><strong>${subtitulo}</strong></p>
    <p><strong>${porcentaje}%</strong> — Nota: ${nota}</p>
    <p>${estado.charAt(0).toUpperCase() + estado.slice(1)}</p>
  `;
  return div;
}
