try {
  const datos = localStorage.getItem("progreso");
  if (datos) {
    JSON.parse(datos); // Si es inválido, lanza error
  }
} catch (e) {
  console.warn("Progreso corrupto. Limpiando localStorage...");
  localStorage.removeItem("progreso");
  location.reload(); // Recarga limpia
}



// js/app/progreso.js

async function cargarDatosQuiz() {
  const respuesta = await fetch("datos/quiz.json");
  return await respuesta.json();
}

function calcularRango(porcentaje) {
  if (porcentaje >= 97) return "A+";
  if (porcentaje >= 90) return "A";
  if (porcentaje >= 85) return "A−";
  if (porcentaje >= 80) return "B+";
  if (porcentaje >= 75) return "B";
  if (porcentaje >= 70) return "B−";
  if (porcentaje >= 60) return "C";
  if (porcentaje >= 50) return "D";
  return "F";
}

function agruparTemasPorCategoria(preguntas) {
  const categorias = {};
  preguntas.forEach(({ categoria, tema }) => {
    if (!categorias[categoria]) categorias[categoria] = new Set();
    categorias[categoria].add(tema);
  });
  return Object.fromEntries(
    Object.entries(categorias).map(([cat, temas]) => [cat, Array.from(temas)])
  );
}

function obtenerResumenPorCategoria(categorias, progreso) {
  const resumen = {};
  for (const categoria in categorias) {
    const temas = categorias[categoria];
    let jugados = 0;
    let aciertos = 0;
    let totalPreguntas = 0;

    temas.forEach((tema) => {
      const entrada = progreso.find(
  (p) =>
    p.categoria.toLowerCase() === categoria.toLowerCase() &&
    p.tema.toLowerCase() === tema.toLowerCase()
);

      if (entrada) {
        jugados++;
        aciertos += entrada.puntaje;
        totalPreguntas += entrada.total;
      }
    });

    const avance = temas.length ? (jugados / temas.length) * 100 : 0;
    const desempeño = totalPreguntas ? (aciertos / totalPreguntas) * 100 : 0;

    resumen[categoria] = {
      totalTemas: temas.length,
      jugados,
      avance: Math.round(avance),
      desempeño: Math.round(desempeño),
      rangoAvance: calcularRango(avance),
      rangoDesempeño: calcularRango(desempeño),
    };
  }
  return resumen;
}

function mostrarTarjetas(resumen) {
  console.log("Mostrando tarjetas de progreso...", resumen); // NUEVO
  const contenedor = document.getElementById("contenedorProgreso");
  const sinProgreso = document.getElementById("sinProgreso");
  contenedor.innerHTML = "";

  const categorias = Object.keys(resumen);
  const hayProgreso = categorias.some((c) => resumen[c].jugados > 0);

  if (!hayProgreso) {
    sinProgreso.style.display = "block";
    return;
  } else {
    sinProgreso.style.display = "none";
  }

categorias.forEach((categoria) => {
  const datos = resumen[categoria];
  console.log("Creando tarjeta para:", categoria, datos);
  const div = document.createElement("div");
  div.className = "tarjeta-progreso";
  div.innerHTML = `
    <div class="titulo-categoria">${categoria}</div>
    <div class="info-progreso">Temas jugados: ${datos.jugados} / ${datos.totalTemas}</div>
    <div class="info-progreso">Avance: ${datos.avance}% (<span class="rango">${datos.rangoAvance}</span>)</div>
    <div class="info-progreso">Desempeño: ${datos.desempeño}% (<span class="rango">${datos.rangoDesempeño}</span>)</div>
  `;
  contenedor.appendChild(div);
  console.log("Tarjeta agregada para:", categoria);
});
}

// Inicialización

document.addEventListener("DOMContentLoaded", async () => {
  const preguntas = await cargarDatosQuiz();
  const progreso = JSON.parse(localStorage.getItem("progreso")) || [];
  const categorias = agruparTemasPorCategoria(preguntas);
  const resumen = obtenerResumenPorCategoria(categorias, progreso);
  mostrarTarjetas(resumen);
});


