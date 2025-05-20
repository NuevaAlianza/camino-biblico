let todasLasCitas = [];
let citasDelBloque = [];
let indiceActual = 0;
let modo = "basico";
let bloqueSeleccionado = 1;
let aciertosLibro = 0;
let aciertosCapitulo = 0;

const nivelSelect = document.getElementById("nivel");
const bloqueSelect = document.getElementById("bloque");
const iniciarBtn = document.getElementById("iniciarBtn");

const seccionInicio = document.getElementById("inicio");
const seccionJuego = document.getElementById("juego");
const seccionFinal = document.getElementById("final");

const pregunta = document.getElementById("pregunta");
const opcionesLibro = document.getElementById("opcionesLibro");
const opcionesCapitulo = document.getElementById("opcionesCapitulo");
const mensajeFinal = document.getElementById("mensajeFinal");

// Cargar citas desde el archivo
fetch("datos/citas.json")
  .then(res => res.json())
  .then(data => {
    todasLasCitas = data;

    // Detectar bloques únicos
    const bloquesUnicos = [...new Set(todasLasCitas.map(c => c.bloque))];
    bloquesUnicos.sort((a, b) => a - b);

    bloquesUnicos.forEach(bloque => {
      const option = document.createElement("option");
      option.value = bloque;
      option.textContent = `Bloque ${bloque}`;
      bloqueSelect.appendChild(option);
    });
  });

// Al iniciar el quiz
iniciarBtn.addEventListener("click", () => {
  modo = nivelSelect.value;
  bloqueSeleccionado = parseInt(bloqueSelect.value);

  citasDelBloque = todasLasCitas.filter(c => c.bloque === bloqueSeleccionado);
  indiceActual = 0;
  aciertosLibro = 0;
  aciertosCapitulo = 0;

  seccionInicio.classList.add("oculto");
  seccionJuego.classList.remove("oculto");

  mostrarPregunta();
});

function mostrarPregunta() {
  const cita = citasDelBloque[indiceActual];
  pregunta.textContent = cita.cita;

  // Mostrar opciones de libro
  opcionesLibro.innerHTML = "";
  cita.opciones_libro.forEach((libro, i) => {
    const btn = document.createElement("button");
    btn.textContent = libro;
    btn.addEventListener("click", () => validarLibro(libro, cita));
    opcionesLibro.appendChild(btn);
  });

  // Mostrar opciones de capítulo solo si es modo avanzado
  opcionesCapitulo.innerHTML = "";
  if (modo === "avanzado") {
    cita.opciones_capitulo.forEach((cap, i) => {
      const btn = document.createElement("button");
      btn.textContent = cap;
      btn.addEventListener("click", () => validarCapitulo(cap, cita));
      opcionesCapitulo.appendChild(btn);
    });
  }
}

function validarLibro(libroSeleccionado, cita) {
  if (libroSeleccionado === cita.libro) {
    aciertosLibro++;
  }

  if (modo === "basico") {
    pasarSiguiente();
  } else {
    opcionesLibro.querySelectorAll("button").forEach(b => b.disabled = true);
  }
}

function validarCapitulo(capSeleccionado, cita) {
  if (parseInt(capSeleccionado) === parseInt(cita.capitulo)) {
    aciertosCapitulo++;
  }

  pasarSiguiente();
}

function pasarSiguiente() {
  indiceActual++;
  if (indiceActual >= citasDelBloque.length) {
    finalizarQuiz();
  } else {
    mostrarPregunta();
  }
}

function finalizarQuiz() {
  seccionJuego.classList.add("oculto");
  seccionFinal.classList.remove("oculto");

  const total = citasDelBloque.length;
  let mensaje = `Acertaste ${aciertosLibro} libros de ${total}.`;

  if (modo === "avanzado") {
    mensaje += ` Y ${aciertosCapitulo} capítulos de ${total}.`;
  }

  mensajeFinal.textContent = mensaje;
}
