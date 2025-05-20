let todasLasCitas = [];
let citasDelBloque = [];
let indiceActual = 0;
let modo = "basico";
let bloqueSeleccionado = 1;
let aciertosLibro = 0;
let aciertosCapitulo = 0;

// Cargar sonidos
const sonidoClick = new Audio("assets/sonidos/click.mp3");
const sonidoCorrecto = new Audio("assets/sonidos/correcto.mp3");

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

  opcionesLibro.innerHTML = "";
  mezclarArray([...cita.opciones_libro]).forEach(libro => {
  const btn = document.createElement("button");
  btn.textContent = libro;
  btn.addEventListener("click", () => validarLibro(btn, libro, cita));
  opcionesLibro.appendChild(btn);
});

    const btn = document.createElement("button");
    btn.textContent = libro;
    btn.addEventListener("click", () => validarLibro(btn, libro, cita));
    opcionesLibro.appendChild(btn);
  });

  opcionesCapitulo.innerHTML = "";
  if (modo === "avanzado") {
    mezclarArray([...cita.opciones_capitulo]).forEach(cap => {
  const btn = document.createElement("button");
  btn.textContent = cap;
  btn.addEventListener("click", () => validarCapitulo(btn, cap, cita));
  opcionesCapitulo.appendChild(btn);
});

      const btn = document.createElement("button");
      btn.textContent = cap;
      btn.addEventListener("click", () => validarCapitulo(btn, cap, cita));
      opcionesCapitulo.appendChild(btn);
    });
  }
}

function validarLibro(boton, libroSeleccionado, cita) {
  sonidoClick.play();
  const esCorrecto = libroSeleccionado === cita.libro;
  if (esCorrecto) {
    aciertosLibro++;
    sonidoCorrecto.play();
    boton.classList.add("correcto");
  } else {
    boton.classList.add("incorrecto");
  }

  bloquearBotones(opcionesLibro, cita.libro);

  if (modo === "basico") {
    setTimeout(pasarSiguiente, 1000);
  }
}

function validarCapitulo(boton, capSeleccionado, cita) {
  sonidoClick.play();
  const esCorrecto = parseInt(capSeleccionado) === parseInt(cita.capitulo);
  if (esCorrecto) {
    aciertosCapitulo++;
    sonidoCorrecto.play();
    boton.classList.add("correcto");
  } else {
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
}
function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
