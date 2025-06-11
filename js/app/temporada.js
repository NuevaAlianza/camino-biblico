let datosTemporada = null;
let preguntas = [];
let preguntaActual = 0;
let puntaje = 0;
let tiempo = 58;
let intervalo;
let idTemporada = "";

// Elementos DOM
const tituloTemporada = document.getElementById("titulo-temporada");
const descripcionTemporada = document.getElementById("descripcion-temporada");
const btnComenzar = document.getElementById("btn-comenzar");
const juego = document.getElementById("juego");
const inicio = document.getElementById("inicio");
const final = document.getElementById("final");
const preguntaEl = document.getElementById("pregunta");
const opcionesEl = document.getElementById("opciones");
const progresoBarra = document.getElementById("progreso");
const contador = document.getElementById("contador");
const conteoPreguntaEl = document.getElementById("conteo-pregunta");
const puntajeFinal = document.getElementById("puntaje-final");
const imagenColeccionable = document.getElementById("imagen-coleccionable");

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  idTemporada = urlParams.get("id");

  if (!idTemporada) {
    tituloTemporada.textContent = "Temporada no encontrada (sin parámetro)";
    btnComenzar.disabled = true;
    return;
  }

  try {
    const res = await fetch("./datos/temporadas.json");
    const temporadas = await res.json();

    console.log("Parámetro recibido:", idTemporada);
    console.log("Temporadas cargadas:", temporadas);

    datosTemporada = temporadas.find(t =>
      t.id.toLowerCase().trim() === idTemporada.toLowerCase().trim()
    );

    console.log("Resultado de búsqueda:", datosTemporada);

    if (!datosTemporada) {
      tituloTemporada.textContent = `Temporada no válida: ${idTemporada}`;
      btnComenzar.disabled = true;
      return;
    }

    tituloTemporada.textContent = datosTemporada.titulo;
    descripcionTemporada.textContent = datosTemporada.descripcion;
    preguntas = datosTemporada.preguntas;

    btnComenzar.addEventListener("click", comenzarJuego);
  } catch (error) {
    console.error("Error cargando temporadas.json:", error);
    tituloTemporada.textContent = "Error al cargar la temporada.";
    btnComenzar.disabled = true;
  }
});

function comenzarJuego() {
  inicio.classList.add("oculto");
  juego.classList.remove("oculto");
  mostrarPregunta();
  iniciarTemporizador();
}

function mostrarPregunta() {
  const actual = preguntas[preguntaActual];
  preguntaEl.textContent = actual.pregunta;
  conteoPreguntaEl.textContent = `Pregunta ${preguntaActual + 1} de ${preguntas.length}`;

  const opciones = [actual.respuesta, actual.opcion_1, actual.opcion_2, actual.opcion_3];
  const mezcladas = opciones.sort(() => Math.random() - 0.5);

  opcionesEl.innerHTML = "";
  mezcladas.forEach(opcion => {
    const btn = document.createElement("button");
    btn.textContent = opcion;
    btn.onclick = () => {
      verificarRespuesta(opcion, actual.respuesta);
    };
    opcionesEl.appendChild(btn);
  });
}

function verificarRespuesta(seleccionada, correcta) {
  if (seleccionada === correcta) puntaje++;
  siguientePregunta();
}

function siguientePregunta() {
  clearInterval(intervalo);
  tiempo = 58;
  progresoBarra.style.width = "0%";

  preguntaActual++;
  if (preguntaActual < preguntas.length) {
    mostrarPregunta();
    iniciarTemporizador();
  } else {
    finalizarJuego();
  }
}

function iniciarTemporizador() {
  intervalo = setInterval(() => {
    tiempo--;
    contador.textContent = `Tiempo: ${tiempo}s`;
    progresoBarra.style.width = `${(58 - tiempo) / 58 * 100}%`;

    if (tiempo <= 0) {
      clearInterval(intervalo);
      siguientePregunta();
    }
  }, 1000);
}

function finalizarJuego() {
  juego.classList.add("oculto");
  final.classList.remove("oculto");

  const max = datosTemporada.puntaje_maximo;
  const umbral = datosTemporada.umbral_coleccionable;
  const nota = puntaje >= umbral ? "A" : puntaje >= umbral - 2 ? "B" : "C";
  let imgSrc;
  let mensajeExtra = "";
  let botonDescarga = "";

  if (nota === "A") {
    imgSrc = datosTemporada.coleccionable.imagen_a;
    mensajeExtra = `<p style="color:#2a9d8f; font-weight:600; margin-top:1rem;">🏆 ¡Excelente! Has desbloqueado el coleccionable especial.</p>`;
    botonDescarga = `<a href="${imgSrc}" download style="display:inline-block; margin-top:1rem; background:#e9c46a; padding:0.5rem 1rem; border-radius:0.5rem; color:#333; text-decoration:none; font-weight:bold; font-size:0.9rem;">📥 Descargar</a>`;
  } else if (nota === "B") {
    imgSrc = datosTemporada.coleccionable.imagen_b;
  } else {
    imgSrc = datosTemporada.coleccionable.imagen_c;
  }

  imagenColeccionable.innerHTML = `
    <img src="${imgSrc}" alt="Coleccionable desbloqueado" style="max-width:100%; border-radius:1rem;">
    ${mensajeExtra}
    ${botonDescarga}
  `;

  puntajeFinal.textContent = `Puntaje: ${puntaje} de ${max}`;

  guardarProgreso();
}


function guardarProgreso() {
  let progreso = JSON.parse(localStorage.getItem("progreso")) || { version: 2, categorias: {}, temporadas: {} };

  if (progreso.version !== 2) {
    // Si por alguna razón es la versión antigua, migramos
    progreso = { version: 2, categorias: {}, temporadas: {} };
  }

  if (!progreso.temporadas) progreso.temporadas = {};

  progreso.temporadas[idTemporada] = {
    titulo: datosTemporada.titulo,
    puntaje,
    nota: puntaje >= datosTemporada.umbral_coleccionable ? "A" :
          puntaje >= datosTemporada.umbral_coleccionable - 2 ? "B" : "C",
    coleccionable: puntaje >= datosTemporada.umbral_coleccionable
  };

  localStorage.setItem("progreso", JSON.stringify(progreso));
}
