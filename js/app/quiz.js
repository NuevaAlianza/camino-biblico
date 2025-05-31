let datos = []; // Cargados desde el JSON completo
let preguntasFiltradas = [];
let indicePregunta = 0;
let score = 0;

fetch('datos/quiz.json')
  .then(res => res.json())
  .then(json => {
    datos = json;
    mostrarMenu();
  });

function mostrarMenu() {
  const categorias = [...new Set(datos.map(d => d.categoria))];
  const menu = document.getElementById("menu");
  menu.innerHTML = "<h2>Selecciona una categoría:</h2>";
  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => mostrarTemas(cat);
    menu.appendChild(btn);
  });
}

function mostrarTemas(categoria) {
  const temas = [...new Set(datos.filter(d => d.categoria === categoria).map(d => d.tema))];
  const menu = document.getElementById("menu");
  menu.innerHTML = `<h2>Tema de ${categoria}:</h2>`;
  temas.forEach(tema => {
    const btn = document.createElement("button");
    btn.textContent = tema;
    btn.onclick = () => iniciarQuiz(categoria, tema);
    menu.appendChild(btn);
  });
}

function iniciarQuiz(categoria, tema) {
  preguntasFiltradas = datos.filter(d => d.categoria === categoria && d.tema === tema);
  indicePregunta = 0;
  score = 0;
  document.getElementById("menu").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  mostrarPregunta();
}

function mostrarPregunta() {
  const preguntaActual = preguntasFiltradas[indicePregunta];
  document.getElementById("pregunta").textContent = preguntaActual.pregunta;

  const opciones = [preguntaActual.respuesta, preguntaActual.opcion_1, preguntaActual.opcion_2, preguntaActual.opcion_3];
  const opcionesMezcladas = opciones.sort(() => Math.random() - 0.5);

  const contenedor = document.getElementById("opciones");
  contenedor.innerHTML = "";
  opcionesMezcladas.forEach(op => {
    const btn = document.createElement("button");
    btn.textContent = op;
    btn.onclick = () => verificarRespuesta(op, preguntaActual);
    contenedor.appendChild(btn);
  });

  document.getElementById("retroalimentacion").textContent = "";
  document.getElementById("siguiente").style.display = "none";
}

function verificarRespuesta(seleccion, pregunta) {
  const correcta = seleccion === pregunta.respuesta;
  if (correcta) score++;
  const retro = document.getElementById("retroalimentacion");
  retro.innerHTML = `
    <strong>${correcta ? "¡Correcto!" : "Incorrecto."}</strong><br>
    <em>${pregunta['cita biblica']}</em>
  `;
  // Desactivar botones
  document.querySelectorAll("#opciones button").forEach(b => b.disabled = true);
  document.getElementById("siguiente").style.display = "inline-block";
  document.getElementById("siguiente").onclick = siguientePregunta;
}

function siguientePregunta() {
  indicePregunta++;
  if (indicePregunta < preguntasFiltradas.length) {
    mostrarPregunta();
  } else {
    mostrarResultados();
  }
}

function mostrarResultados() {
  const total = preguntasFiltradas.length;
  document.getElementById("quiz-container").innerHTML = `
    <h2>¡Fin del quiz!</h2>
    <p>Respondiste correctamente ${score} de ${total} preguntas.</p>
    <button onclick="location.reload()">Volver al inicio</button>
  `;
}
