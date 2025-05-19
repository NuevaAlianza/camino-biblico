let bloqueSeleccionado = "";
let datos = {};
let preguntas = [];
let indiceActual = 0;
let aciertosLibro = 0;
let aciertosCapitulo = 0;

const inicioContainer = document.getElementById("inicio");
const cuestionarioContainer = document.getElementById("cuestionario");
const finalContainer = document.getElementById("final");

const bloqueSelect = document.getElementById("bloque");
const iniciarBtn = document.getElementById("iniciarBtn");
const preguntaTexto = document.getElementById("pregunta");
const opcionesLibro = document.getElementById("opciones-libro");
const opcionesCapitulo = document.getElementById("opciones-capitulo");
const siguienteBtn = document.getElementById("siguienteBtn");
const resultadoTexto = document.getElementById("resultado");
const reiniciarBtn = document.getElementById("reiniciarBtn");
const volverBtn = document.getElementById("volverBtn");

const correctoSound = new Audio("assets/sonidos/correcto.mp3");
const incorrectoSound = new Audio("assets/sonidos/incorrecto.mp3");

fetch("datos/citas.json")
  .then((res) => res.json())
  .then((data) => {
    datos = data;
    Object.keys(datos).forEach((bloque) => {
      const option = document.createElement("option");
      option.value = bloque;
      option.textContent = bloque;
      bloqueSelect.appendChild(option);
    });
  });

iniciarBtn.addEventListener("click", () => {
  bloqueSeleccionado = bloqueSelect.value;
  if (!bloqueSeleccionado) return;
  preguntas = [...datos[bloqueSeleccionado]];
  preguntas = preguntas.sort(() => Math.random() - 0.5).slice(0, 10); // o 15
  indiceActual = 0;
  aciertosLibro = 0;
  aciertosCapitulo = 0;
  inicioContainer.classList.add("hidden");
  cuestionarioContainer.classList.remove("hidden");
  mostrarPregunta();
});

function mostrarPregunta() {
  if (indiceActual >= preguntas.length) {
    mostrarPantallaFinal();
    return;
  }

  const actual = preguntas[indiceActual];
  preguntaTexto.textContent = actual.cita;

  opcionesLibro.innerHTML = "";
  opcionesCapitulo.innerHTML = "";

  [...actual.opciones_libro].forEach((libro) => {
    const btn = document.createElement("button");
    btn.textContent = libro;
    btn.className = "opcion";
    btn.addEventListener("click", () =>
      seleccionarLibro(btn, libro === actual.libro)
    );
    opcionesLibro.appendChild(btn);
  });

  [...actual.opciones_capitulo].forEach((cap) => {
    const btn = document.createElement("button");
    btn.textContent = cap;
    btn.className = "opcion";
    btn.addEventListener("click", () =>
      seleccionarCapitulo(btn, parseInt(cap) === actual.capitulo)
    );
    opcionesCapitulo.appendChild(btn);
  });

  siguienteBtn.disabled = true;
  siguienteBtn.classList.add("opacity-50", "cursor-not-allowed");
}

let libroSeleccionado = false;
let capituloSeleccionado = false;

function seleccionarLibro(btn, esCorrecto) {
  if (libroSeleccionado) return;
  libroSeleccionado = true;

  if (esCorrecto) {
    btn.classList.add("bg-green-500", "text-white");
    correctoSound.play();
    aciertosLibro++;
  } else {
    btn.classList.add("bg-red-500", "text-white");
    incorrectoSound.play();
    marcarCorrecto(opcionesLibro, preguntas[indiceActual].libro);
  }

  verificarAmbasSeleccionadas();
}

function seleccionarCapitulo(btn, esCorrecto) {
  if (capituloSeleccionado) return;
  capituloSeleccionado = true;

  if (esCorrecto) {
    btn.classList.add("bg-green-500", "text-white");
    correctoSound.play();
    aciertosCapitulo++;
  } else {
    btn.classList.add("bg-red-500", "text-white");
    incorrectoSound.play();
    marcarCorrecto(
      opcionesCapitulo,
      preguntas[indiceActual].capitulo.toString()
    );
  }

  verificarAmbasSeleccionadas();
}

function marcarCorrecto(contenedor, valorCorrecto) {
  Array.from(contenedor.children).forEach((btn) => {
    if (btn.textContent === valorCorrecto) {
      btn.classList.add("bg-green-500", "text-white");
    }
  });
}

function verificarAmbasSeleccionadas() {
  if (libroSeleccionado && capituloSeleccionado) {
    siguienteBtn.disabled = false;
    siguienteBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

siguienteBtn.addEventListener("click", mostrarSiguientePregunta);
reiniciarBtn.addEventListener("click", reiniciarCuestionario);
volverBtn.addEventListener("click", () => {
  finalContainer.classList.add("hidden");
  inicioContainer.classList.remove("hidden");
});

function mostrarSiguientePregunta() {
  libroSeleccionado = false;
  capituloSeleccionado = false;
  indiceActual++;
  mostrarPregunta();
}

function reiniciarCuestionario() {
  finalContainer.classList.add("hidden");
  inicioContainer.classList.remove("hidden");
}

function mostrarPantallaFinal() {
  cuestionarioContainer.classList.add("hidden");
  finalContainer.classList.remove("hidden");

  const porcentajeLibro = Math.round((aciertosLibro / preguntas.length) * 100);
  const porcentajeCapitulo = Math.round(
    (aciertosCapitulo / preguntas.length) * 100
  );

  let mensaje = "";
  const promedio = (porcentajeLibro + porcentajeCapitulo) / 2;

  if (promedio === 100) {
    mensaje = "¡Perfecto! Has acertado todas las citas. Excelente conocimiento bíblico.";
  } else if (promedio >= 80) {
    mensaje = "¡Muy bien! Tienes un gran conocimiento de la Biblia.";
  } else if (promedio >= 60) {
    mensaje = "¡Bien hecho! Aunque podrías repasar algunas citas.";
  } else {
    mensaje = "Sigue practicando. ¡La Palabra de Dios siempre tiene algo nuevo para ti!";
  }

  resultadoTexto.innerHTML = `
    <p>Aciertos en <strong>libros</strong>: ${porcentajeLibro}%</p>
    <p>Aciertos en <strong>capítulos</strong>: ${porcentajeCapitulo}%</p>
    <p class="mt-4 font-semibold">${mensaje}</p>
  `;
}

