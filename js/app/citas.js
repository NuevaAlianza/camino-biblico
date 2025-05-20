let todasLasCitas = [];
let citasDelBloque = [];
let indiceActual = 0;
let modo = "basico";
let bloqueSeleccionado = 1;
let aciertosLibro = 0;
let aciertosCapitulo = 0;

// Variables para modo avanzado
let respondioLibro = false;
let respondioCapitulo = false;

// Cargar sonidos con volumen bajo para evitar molestia
const sonidoClick = new Audio("assets/sonidos/click.mp3");
const sonidoCorrecto = new Audio("assets/sonidos/correcto.mp3");
const sonidoIncorrecto = new Audio("assets/sonidos/incorrecto.mp3");
const sonidoInicio = new Audio("assets/sonidos/inicio.mp3");
const sonidoFin = new Audio("assets/sonidos/fin.mp3");

// Ajustamos volumen inicial
[sonidoClick, sonidoCorrecto, sonidoIncorrecto, sonidoInicio, sonidoFin].forEach(sonido => {
  sonido.volume = 0.3; // Volumen moderado para todos
});

// Control para que no se solapen sonidos importantes
function reproducirSonido(sonido) {
  // Pausar otros sonidos importantes antes de reproducir este
  [sonidoClick, sonidoCorrecto, sonidoIncorrecto, sonidoInicio, sonidoFin].forEach(s => {
    if (s !== sonido) s.pause();
  });
  sonido.currentTime = 0;
  sonido.play();
}

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
  });

iniciarBtn.addEventListener("click", () => {
  modo = nivelSelect.value;
  bloqueSeleccionado = parseInt(bloqueSelect.value);

  // Validar selección de bloque y modo
  if (!modo) {
    alert("Por favor, selecciona un modo de juego.");
    return;
  }
  if (!bloqueSeleccionado || isNaN(bloqueSeleccionado)) {
    alert("Por favor, selecciona un bloque válido.");
    return;
  }

  citasDelBloque = todasLasCitas.filter(c => c.bloque === bloqueSeleccionado);
  if (citasDelBloque.length === 0) {
    alert("No hay citas disponibles para el bloque seleccionado.");
    return;
  }

  indiceActual = 0;
  aciertosLibro = 0;
  aciertosCapitulo = 0;

  seccionInicio.classList.add("oculto");
  seccionJuego.classList.remove("oculto");
  seccionFinal.classList.add("oculto");

  reproducirSonido(sonidoInicio); // Sonido de inicio
  mostrarPregunta();
});

function mostrarPregunta() {
  respondioLibro = false;
  respondioCapitulo = false;

  const cita = citasDelBloque[indiceActual];
  pregunta.textContent = cita.cita;

  // Mostrar opciones libro
  opcionesLibro.innerHTML = "";
  mezclarArray([...cita.opciones_libro]).forEach(libro => {
    const btn = document.createElement("button");
    btn.textContent = libro;
    btn.disabled = false;
    btn.className = "";
    btn.addEventListener("click", () => {
      if (respondioLibro) return; // evitar doble click
      validarLibro(btn, libro, cita);
    });
    opcionesLibro.appendChild(btn);
  });

  // Mostrar opciones capítulo solo en avanzado
  opcionesCapitulo.innerHTML = "";
  if (modo === "avanzado") {
    mezclarArray([...cita.opciones_capitulo]).forEach(cap => {
      const btn = document.createElement("button");
      btn.textContent = cap;
      btn.disabled = false;
      btn.className = "";
      btn.addEventListener("click", () => {
        if (respondioCapitulo) return; // evitar doble click
        validarCapitulo(btn, cap, cita);
      });
      opcionesCapitulo.appendChild(btn);
    });
  }
}

function validarLibro(boton, libroSeleccionado, cita) {
  reproducirSonido(sonidoClick);
  respondioLibro = true;

  const esCorrecto = libroSeleccionado === cita.libro;
  if (esCorrecto) {
    aciertosLibro++;
    reproducirSonido(sonidoCorrecto);
    boton.classList.add("correcto");
  } else {
    reproducirSonido(sonidoIncorrecto);
    boton.classList.add("incorrecto");
  }

  bloquearBotones(opcionesLibro, cita.libro);

  if (modo === "basico" || respondioCapitulo) {
    setTimeout(pasarSiguiente, 1000);
  }
}

function validarCapitulo(boton, capSeleccionado, cita) {
  reproducirSonido(sonidoClick);
  respondioCapitulo = true;

  const esCorrecto = parseInt(capSeleccionado) === parseInt(cita.capitulo);
  if (esCorrecto) {
    aciertosCapitulo++;
    reproducirSonido(sonidoCorrecto);
    boton.classList.add("correcto");
  } else {
    reproducirSonido(sonidoIncorrecto);
    boton.classList.add("incorrecto");
  }

  bloquearBotones(opcionesCapitulo, cita.capitulo);

  if (respondioLibro) {
    setTimeout(pasarSiguiente, 1000);
  }
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

  reproducirSonido(sonidoFin); // Sonido de fin

  const total = citasDelBloque.length;
  let mensaje = `✔️ Aciertos en libros: ${aciertosLibro} / ${total}`;
  if (modo === "avanzado") {
    mensaje += `\n✔️ Aciertos en capítulos: ${aciertosCapitulo} / ${total}`;
  }
  mensajeFinal.textContent = mensaje;
}

function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
