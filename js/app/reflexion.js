console.log('reflexion.js cargado');

const temas = {
  amor: [
    "¿Qué significa el amor según la Biblia?",
    "¿Cómo podemos demostrar amor en la vida diaria?"
  ],
  fe: [
    "¿Qué es la fe para ti?",
    "¿Por qué es importante mantener la fe en tiempos difíciles?"
  ],
  esperanza: [
    "¿Qué te inspira esperanza en la vida?",
    "¿Cómo puedes compartir esperanza con los demás?"
  ]
};

const temaSelect = document.getElementById('tema-select');
const preguntaContainer = document.getElementById('pregunta-container');
const preguntaTexto = document.getElementById('pregunta-texto');
const btnSiguiente = document.getElementById('btn-siguiente');

let preguntasActuales = [];
let indicePregunta = 0;

temaSelect.addEventListener('change', () => {
  const tema = temaSelect.value;
  if (!tema || !temas[tema]) {
    preguntaContainer.style.display = 'none';
    return;
  }
  preguntasActuales = temas[tema];
  indicePregunta = 0;
  mostrarPregunta();
  preguntaContainer.style.display = 'block';
});

btnSiguiente.addEventListener('click', () => {
  indicePregunta++;
  if (indicePregunta >= preguntasActuales.length) {
    alert('Has terminado las preguntas de este tema.');
    preguntaContainer.style.display = 'none';
    temaSelect.value = '';
  } else {
    mostrarPregunta();
  }
});

function mostrarPregunta() {
  preguntaTexto.textContent = preguntasActuales[indicePregunta];
}


