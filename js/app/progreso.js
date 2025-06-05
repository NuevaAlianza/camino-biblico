const progresoBase = {
  version: 1,
  categorias: {},
  bloques: {}
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
    if (!progreso.categorias) progreso.categorias = {};
    if (!progreso.categorias["Resumen"]) progreso.categorias["Resumen"] = {};
    progreso.categorias["Resumen"][clave] = { porcentaje, nota, estado };
  }

  if (tipo === "citas") {
    if (!progreso.bloques) progreso.bloques = {};
    progreso.bloques[clave] = { porcentaje, nota, estado };
  }

  localStorage.setItem("progreso", JSON.stringify(progreso));
}
