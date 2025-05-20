// js/app/citas.js

// Variables globales
let citas = [];
let preguntasFiltradas = [];
let indiceActual = 0;
let nivelSeleccionado = 'basico';
let bloqueSeleccionado = '1';
let puntaje = 0;

// Sonidos
const sonidoClick = new Audio('assets/sonidos/click.mp3');
const sonidoCorrecto = new Audio('assets/sonidos/correcto.mp3');

const pantallaInicio = document.getElementById('pantalla-inicio');
const pantallaQuiz = document.getElementById('pantalla-quiz');
const contenedorPregunta = document.getElementById('contenedor-pregunta');
const contenedorOpciones = document.getElementById('contenedor-opciones');
const contenedorBotonesFinal = document.getElementById('contenedor-botones-final');
const btnIniciar = document.getElementById('btn-iniciar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnVolver = document.getElementById('btn-volver');
const mensajeFinal = document.getElementById('mensaje-final');

const selectNivel = document.getElementById('nivel');
const selectBloque = document.getElementById('bloque');

// Cargar datos desde JSON
fetch('datos/citas.json')
  .then(response => response.json())
  .then(data => {
    citas = data;
  })
  .catch(err => console.error('Error cargando citas:', err));

// Función para iniciar quiz
function iniciarQuiz() {
  sonidoClick.play();

  nivelSeleccionado = selectNivel.value;
  bloqueSeleccionado = selectBloque.value;
  puntaje = 0;
  indiceActual = 0;

  // Filtrar preguntas por bloque
  preguntasFiltradas = citas.filter(c => c.bloque.toString() === bloqueSeleccionado);

  // Mostrar solo preguntas que correspondan al nivel:
  // Para nivel básico solo usaremos preguntas con opciones de libro (ignorando capítulo)
  // Para avanzado usamos libro y capítulo
  if (nivelSeleccionado === 'basico') {
    // No modificamos las preguntas, pero en el render se ocultan opciones de capítulo
  }

  // Ocultar pantalla inicio, mostrar quiz
  pantallaInicio.style.display = 'none';
  pantallaQuiz.style.display = 'flex';
  contenedorBotonesFinal.style.display = 'none';

  mostrarPregunta();
}

// Función para mostrar pregunta actual
function mostrarPregunta() {
  contenedorPregunta.textContent = '';
  contenedorOpciones.innerHTML = '';

  if (indiceActual >= preguntasFiltradas.length) {
    // Quiz terminado
    finalizarQuiz();
    return;
  }

  const pregunta = preguntasFiltradas[indiceActual];

  contenedorPregunta.textContent = `"${pregunta.cita}"`;

  // Mostrar opciones según nivel
  if (nivelSeleccionado === 'basico') {
    // Solo opciones de libro
    pregunta.opciones_libro.forEach(opcion => {
      const btn = document.createElement('button');
      btn.textContent = opcion;
      btn.addEventListener('click', () => manejarRespuesta(opcion, pregunta.libro));
      contenedorOpciones.appendChild(btn);
    });
  } else {
    // Avanzado: mostrar opciones libro y luego opciones capítulo (dos etapas)
    if (!pregunta._fase || pregunta._fase === 1) {
      // Mostrar opciones libro
      pregunta._fase = 1;
      pregunta._respuestaCorrecta = pregunta.libro;

      pregunta.opciones_libro.forEach(opcion => {
        const btn = document.createElement('button');
        btn.textContent = opcion;
        btn.addEventListener('click', () => manejarRespuestaAvanzado(opcion, pregunta.libro, pregunta));
        contenedorOpciones.appendChild(btn);
      });
    } else if (pregunta._fase === 2) {
      // Mostrar opciones capítulo
      contenedorPregunta.textContent = `¿Cuál es el capítulo correcto de esta cita? "${pregunta.cita}"`;
      pregunta.opciones_capitulo.forEach(opcion => {
        const btn = document.createElement('button');
        btn.textContent = opcion;
        btn.addEventListener('click', () => manejarRespuestaAvanzado(opcion, pregunta.capitulo, pregunta));
        contenedorOpciones.appendChild(btn);
      });
    }
  }
}

// Manejar respuesta nivel básico
function manejarRespuesta(respuesta, correcta) {
  sonidoClick.play();

  if (respuesta === correcta) {
    puntaje++;
    sonidoCorrecto.play();
  }

  indiceActual++;
  mostrarPregunta();
}

// Manejar respuesta nivel avanzado (dos fases por pregunta)
function manejarRespuestaAvanzado(respuesta, correcta, pregunta) {
  sonidoClick.play();

  if (!pregunta._fase) pregunta._fase = 1;

  if (respuesta == correcta) {
    puntaje++;
    sonidoCorrecto.play();
  }

  if (pregunta._fase === 1) {
    // Pasar a fase capítulo
    pregunta._fase = 2;
    mostrarPregunta();
  } else {
    // Siguiente pregunta
    indiceActual++;
    mostrarPregunta();
  }
}

// Función para finalizar quiz
function finalizarQuiz() {
  contenedorPregunta.textContent = '';
  contenedorOpciones.innerHTML = '';
  contenedorBotonesFinal.style.display = 'block';

  // Mostrar mensaje final
  let totalPreguntas = preguntasFiltradas.length;
  if (nivelSeleccionado === 'avanzado') {
    totalPreguntas = totalPreguntas * 2; // dos fases por pregunta
  }
  const porcentaje = Math.round((puntaje / totalPreguntas) * 100);

  let mensaje = '';
  if (porcentaje === 100) {
    mensaje = `¡Perfecto! Obtuviste ${porcentaje}% de respuestas correctas.`;
  } else if (porcentaje >= 70) {
    mensaje = `Muy bien, obtuviste ${porcentaje}%. Sigue practicando.`;
  } else {
    mensaje = `Obtuviste ${porcentaje}%. Te recomendamos seguir estudiando.`;
  }

  mensajeFinal.textContent = mensaje;
}

// Botones reiniciar y volver
btnReiniciar.addEventListener('click', () => {
  sonidoClick.play();
  // Reiniciar quiz con mismos nivel y bloque
  preguntasFiltradas.forEach(p => delete p._fase); // reset fases
  puntaje = 0;
  indiceActual = 0;
  contenedorBotonesFinal.style.display = 'none';
  mostrarPregunta();
});

btnVolver.addEventListener('click', () => {
  sonidoClick.play();
  // Mostrar pantalla inicio y ocultar quiz
  pantallaQuiz.style.display = 'none';
  pantallaInicio.style.display = 'block';
  contenedorBotonesFinal.style.display = 'none';

  // Reset
  preguntasFiltradas.forEach(p => delete p._fase);
  puntaje = 0;
  indiceActual = 0;
});

// Botón iniciar
btnIniciar.addEventListener('click', iniciarQuiz);
