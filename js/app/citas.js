let citasData = [];
let citasSeleccionadas = [];
let citaActual = 0;
let aciertosLibro = 0;
let aciertosCapitulo = 0;

const contenedor = document.getElementById("contenedor");
const titulo = document.getElementById("titulo");

async function cargarCitas() {
  try {
    const respuesta = await fetch("datos/citas.json");
    const data = await respuesta.json();
    citasData = data;
    mostrarMenuDeBloques();
  } catch (error) {
    contenedor.innerHTML = "<p>Error al cargar las citas.</p>";
  }
}

function obtenerBloquesDisponibles() {
  const bloques = new Set(citasData.map(c => c.bloque));
  return Array.from(bloques).sort((a, b) => a - b);
}

function mostrarMenuDeBloques() {
  titulo.textContent = "elige un bloque";
  const bloques = obtenerBloquesDisponibles();
  contenedor.innerHTML = bloques.map(b =>
    `<button class="btn-bloque" onclick="iniciarQuiz(${b})">Bloque ${b}</button>`
  ).join("");
}

function iniciarQuiz(bloque) {
  const citasDelBloque = citasData.filter(c => c.bloque === bloque);
  citasSeleccionadas = mezclarArray(citasDelBloque).slice(0, 10);
  citaActual = 0;
  aciertosLibro = 0;
  aciertosCapitulo = 0;
  mostrarCita();
}

function mostrarCita() {
  const cita = citasSeleccionadas[citaActual];
  titulo.textContent = `Cita ${citaActual + 1} de ${citasSeleccionadas.length}`;
  contenedor.innerHTML = `
    <p class="cita">"${cita.cita}"</p>
    <div class="grupo">
      <p>¿De qué libro es?</p>
      ${mezclarArray(cita.opciones_libro).map((libro, i) =>
        `<button onclick="responderLibro('${libro}')">${libro}</button>`).join("")}
    </div>
    <div class="grupo">
      <p>¿Qué capítulo?</p>
      ${mezclarArray(cita.opciones_capitulo).map((cap, i) =>
        `<button onclick="responderCapitulo(${cap})">${cap}</button>`).join("")}
    </div>
  `;
}

let respuestaLibro = null;
let respuestaCapitulo = null;

function responderLibro(libro) {
  respuestaLibro = libro;
  verificarRespuestas();
}

function responderCapitulo(capitulo) {
  respuestaCapitulo = capitulo;
  verificarRespuestas();
}

function verificarRespuestas() {
  if (respuestaLibro !== null && respuestaCapitulo !== null) {
    const cita = citasSeleccionadas[citaActual];
    if (respuestaLibro === cita.libro) aciertosLibro++;
    if (respuestaCapitulo === cita.capitulo) aciertosCapitulo++;
    respuestaLibro = null;
    respuestaCapitulo = null;
    citaActual++;
    setTimeout(() => {
      if (citaActual < citasSeleccionadas.length) {
        mostrarCita();
      } else {
        mostrarResultados();
      }
    }, 300);
  }
}

function mostrarResultados() {
  const total = citasSeleccionadas.length;
  const porcentajeLibro = Math.round((aciertosLibro / total) * 100);
  const porcentajeCapitulo = Math.round((aciertosCapitulo / total) * 100);
  let mensaje = "";

  if (porcentajeLibro >= 90 && porcentajeCapitulo >= 90) {
    mensaje = "¡Excelente memoria bíblica!";
  } else if (porcentajeLibro >= 70 || porcentajeCapitulo >= 70) {
    mensaje = "¡Muy bien! Sigue practicando.";
  } else {
    mensaje = "Buen intento. Puedes mejorar.";
  }

  titulo.textContent = "resultados";
  contenedor.innerHTML = `
    <p>Aciertos en libros: ${aciertosLibro} de ${total} (${porcentajeLibro}%)</p>
    <p>Aciertos en capítulos: ${aciertosCapitulo} de ${total} (${porcentajeCapitulo}%)</p>
    <p class="mensaje">${mensaje}</p>
    <div class="botones-final">
      <button onclick="mostrarMenuDeBloques()">Volver al inicio</button>
      <button onclick="iniciarQuiz(${citasSeleccionadas[0].bloque})">Reintentar bloque</button>
    </div>
  `;
}

function mezclarArray(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

cargarCitas();


