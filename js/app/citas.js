// js/app/citas.js

let citas = [];
let bloqueActual = null;
let preguntasBloque = [];
let preguntaIndex = 0;
let correctasLibro = 0;
let correctasCapitulo = 0;
let modo = null; // 'basico' o 'avanzado'

const selectorModo = document.getElementById('selector-modo');
const modoBasicoBtn = document.getElementById('modo-basico-btn');
const modoAvanzadoBtn = document.getElementById('modo-avanzado-btn');

const selectorBloque = document.getElementById('selector-bloque');
const bloqueSelect = document.getElementById('bloque-select');
const iniciarBtn = document.getElementById('iniciar-btn');

const quizContainer = document.getElementById('quiz-container');
const citaCard = document.getElementById('cita-card');
const opcionesLibroDiv = document.getElementById('opciones-libro');
const opcionesCapituloDiv = document.getElementById('opciones-capitulo');
const barraProgreso = document.getElementById('barra-progreso');

const resultadoFinal = document.getElementById('resultado-final');
const mensajeResultado = document.getElementById('mensaje-resultado');
const reiniciarBtn = document.getElementById('reiniciar-btn');
const volverInicioBtn = document.getElementById('volver-inicio-btn');

// Cargar datos JSON
async function cargarDatos() {
  try {
    const resp = await fetch('datos/citas.json');
    citas = await resp.json();

    // Obtener bloques únicos
    const bloques = [...new Set(citas.map(c => c.bloque))];
    bloques.forEach(b => {
      const option = document.createElement('option');
      option.value = b;
      option.textContent = `Bloque ${b}`;
      bloqueSelect.appendChild(option);
    });
  } catch (error) {
    alert('Error cargando datos: ' + error);
  }
}

// Iniciar el quiz después de seleccionar modo y bloque
function iniciarQuiz() {
  bloqueActual = parseInt(bloqueSelect.value);
  preguntasBloque = citas.filter(c => c.bloque === bloqueActual);
  preguntaIndex = 0;
  correctasLibro = 0;
  correctasCapitulo = 0;

  selectorModo.classList.add('oculto');
  selectorBloque.classList.add('oculto');
  quizContainer.classList.remove('oculto');
  resultadoFinal.classList.add('oculto');

  mostrarPregunta();
  actualizarBarra();
}

// Mostrar pregunta según el modo
function mostrarPregunta() {
  const pregunta = preguntasBloque[preguntaIndex];
  citaCard.textContent = `"${pregunta.cita}"`;

  // Limpiar opciones previas
  opcionesLibroDiv.innerHTML = '';
  opcionesCapituloDiv.innerHTML = '';

  // Mostrar opciones libro
  pregunta.opciones_libro.forEach(libro => {
    const btn = document.createElement('button');
    btn.textContent = libro;
    btn.onclick = () => manejarRespuestaLibro(libro, pregunta.libro);
    opcionesLibroDiv.appendChild(btn);
  });

  // Mostrar opciones capitulo solo si modo avanzado
  if (modo === 'avanzado') {
    opcionesCapituloDiv.classList.remove('oculto');
    pregunta.opciones_capitulo.forEach(cap => {
      const btn = document.createElement('button');
      btn.textContent = cap;
      btn.onclick = () => manejarRespuestaCapitulo(cap, pregunta.capitulo);
      opcionesCapituloDiv.appendChild(btn);
    });
  } else {
    opcionesCapituloDiv.classList.add('oculto');
  }
}

function manejarRespuestaLibro(seleccion, correcta) {
  if (seleccion === correcta) correctasLibro++;
  siguientePregunta();
}

function manejarRespuestaCapitulo(seleccion, correcta) {
  if (seleccion === correcta) correctasCapitulo++;
  // No avanzar la pregunta aquí para que se sincronice con libro
}

function siguientePregunta() {
  preguntaIndex++;
  actualizarBarra();

  if (preguntaIndex < preguntasBloque.length) {
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
}

function actualizarBarra() {
  const progreso = ((preguntaIndex) / preguntasBloque.length) * 100;
  barraProgreso.innerHTML = `<div style="width: ${progreso}%;"></div>`;
}

function mostrarResultado() {
  quizContainer.classList.add('oculto');
  resultadoFinal.classList.remove('oculto');

  const totalPreguntas = preguntasBloque.length;
  let mensaje = '';

  if (modo === 'basico') {
    const porcentaje = Math.round((correctasLibro / totalPreguntas) * 100);
    mensaje = `Terminaste el modo básico con un ${porcentaje}% de aciertos.`;
  } else {
    const porcentajeLibro = Math.round((correctasLibro / totalPreguntas) * 100);
    const porcentajeCapitulo = Math.round((correctasCapitulo / totalPreguntas) * 100);
    mensaje = `Terminaste el modo avanzado. Aciertos en libro: ${porcentajeLibro}%. Aciertos en capítulo: ${porcentajeCapitulo}%.`;
  }

  mensajeResultado.textContent = mensaje;
}

// Botones
modoBasicoBtn.onclick = () => {
  modo = 'basico';
  selectorModo.classList.add('oculto');
  selectorBloque.classList.remove('oculto');
};

modoAvanzadoBtn.onclick = () => {
  modo = 'avanzado';
  selectorModo.classList.add('oculto');
  selectorBloque.classList.remove('oculto');
};

iniciarBtn.onclick = iniciarQuiz;
reiniciarBtn.onclick = () => {
  resultadoFinal.classList.add('oculto');
  selectorBloque.classList.remove('oculto');
  preguntaIndex = 0;
  correctasLibro = 0;
  correctasCapitulo = 0;
};
volverInicioBtn.onclick = () => {
  resultadoFinal.classList.add('oculto');
  selectorModo.classList.remove('oculto');
  preguntaIndex = 0;
  correctasLibro = 0;
  correctasCapitulo = 0;
};

window.onload = cargarDatos;
