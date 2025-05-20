let todasLasCitas = [];
let citasDelBloque = [];
let indiceActual = 0;
let modo = "";
let bloqueSeleccionado = null;
let aciertosLibro = 0;
let aciertosCapitulo = 0;
let preguntaRespondida = false; // Para evitar múltiples respuestas

// Cargar sonidos
const sonidoClick = new Audio("assets/sonidos/click.mp3");
const sonidoCorrecto = new Audio("assets/sonidos/correcto.mp3");
const sonidoIncorrecto = new Audio("assets/sonidos/incorrecto.mp3");
const sonidoInicio = new Audio("assets/sonidos/inicio.mp3");
const sonidoFin = new Audio("assets/sonidos/fin.mp3");

// Controlar volumen (opcional, ajústalo)
[sonidoClick, sonidoCorrecto, sonidoIncorrecto, sonidoInicio, sonidoFin].forEach(s => s.volume = 0.4);

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

// Cargar JSON y llenar opciones de bloque
fetch("datos/citas.json")
  .then(res => res.json())
  .then(data => {
    todasLasCitas = data;
    const bloquesUnicos = [...new Set(todasLasCitas.map(c => c.bloque))];
    bloquesUnicos.sort((a, b) => a - b);
    bloquesUnicos.forEach(bloque => {
      const option = document.createElement("option");
      option.value = bloque;
      option.textContent = `Bloque ${bloque}`;
      bloqueSelect.appendChild(option);
    });

    // Restaurar progreso guardado si hay
    const modoGuardado = localStorage.getItem("modoQuiz");
    const bloqueGuardado = localStorage.getItem("bloqueQuiz");
    if (modoGuardado) nivelSelect.value = modoGuardado;
    if (bloqueGuardado) bloqueSelect.value = bloqueGuardado;
  });

iniciarBtn.addEventListener("click", () => {
  modo = nivelSelect.value;
  bloqueSeleccionado = bloqueSelect.value ? parseInt(bloqueSelect.value) : null;

  // Validaciones antes de empezar
  if (!modo) {
    alert("Por favor, selecciona un modo de juego.");
    return;
  }
  if (!bloqueSeleccionado) {
    alert("Por favor, selecciona un bloque.");
    return;
  }

  citasDelBloque = todasLasCitas.filter(c => c.bloque === bloqueSeleccionado);
  if (citasDelBloque.length === 0) {
    alert("No hay citas disponibles para el bloque seleccionado.");
    return;
  }

  // Guardar progreso en localStorage
  localStorage.setItem("modoQuiz", modo);
  localStorage.setItem("bloqueQuiz", bloqueSeleccionado);

  indiceActual = 0;
  aciertosLibro = 0;
  aciertosCapitulo = 0;

  seccionInicio.classList.add("oculto");
  seccionFinal.classList.add("oculto");
  seccionJuego.classList.remove("oculto");

  sonidoInicio.play();

  mostrarPregunta();
});

function mostrarPregunta() {
  preguntaRespondida = false;

  const cita = citasDelBloque[indiceActual];
  pregunta.textContent = cita.cita;

  // Mezclar y mostrar libros
  opcionesLibro.innerHTML = "";
  mezclarArray([...cita.opciones_libro]).forEach(libro => {
    const btn = document.createElement("button");
    btn.textContent = libro;
    btn.disabled = false;
    btn.className = "";
    btn.addEventListener("click", () => {
      if (preguntaRespondida) return;
      validarLibro(btn, libro, cita);
    });
    opcionesLibro.appendChild(btn);
  });

  // Mezclar y mostrar capítulos si es avanzado
  opcionesCapitulo.innerHTML = "";
  if (modo === "avanzado") {
    mezclarArray([...cita.opciones_capitulo]).forEach(cap => {
      const btn = document.createElement("button");
      btn.textContent = cap;
      btn.disabled = false;
      btn.className = "";
      btn.addEventListener("click", () => {
        if (preguntaRespondida) return;
        validarCapitulo(btn, cap, cita);
      });
      opcionesCapitulo.appendChild(btn);
    });
  }
}

function validarLibro(boton, libroSeleccionado, cita) {
  sonidoClick.play();
  preguntaRespondida = true;

  const esCorrecto = libroSeleccionado === cita.libro;
  if (esCorrecto) {
    aciertosLibro++;
    sonidoCorrecto.play();
    boton.classList.add("correcto");
  } else {
    sonidoIncorrecto.play();
    boton.classList.add("incorrecto");
  }

  bloquearBotones(opcionesLibro, cita.libro);

  if (modo === "basico") {
    setTimeout(pasarSiguiente, 1000);
  }
}

function validarCapitulo(boton, capSeleccionado, cita) {
  sonidoClick.play();
  preguntaRespondida = true;

  const esCorrecto = parseInt(capSeleccionado) === parseInt(cita.capitulo);
  if (esCorrecto) {
    aciertosCapitulo++;
    sonidoCorrecto.play();
    boton.classList.add("correcto");
  } else {
    sonidoIncorrecto.play();
    boton.classList.add("incorrecto");
  }

  bloquearBotones(opcionesCapitulo, cita.capitulo);

  setTimeout(pasarSiguiente, 1000);
}

function bloquearBotones(contenedor, respuestaCorrecta) {
  contenedor.querySelectorAll("button").forEach(btn => {
    btn.disabled = true;
    if (btn.textContent == respuestaCorrecta) {
      btn.classList.add("correcto");
    }
  });
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
  let mensaje = `✔️ Aciertos en libros: ${aciertosLibro} / ${total}`;
  if (modo === "avanzado") {
    mensaje += `\n✔️ Aciertos en capítulos: ${aciertosCapitulo} / ${total}`;
  }
  mensajeFinal.textContent = mensaje;

  sonidoFin.play();
}

function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
