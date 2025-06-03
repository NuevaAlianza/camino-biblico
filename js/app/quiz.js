let datos = [];
let preguntas = [];
let preguntaActual = 0;
let puntaje = 0;
let tiempo = 58;
let intervalo;

const temaSelect = document.getElementById("tema");
const iniciarBtn = document.getElementById("iniciar");
const juego = document.getElementById("juego");
const preguntaEl = document.getElementById("pregunta");
const opcionesEl = document.getElementById("opciones");
const comentarioEl = document.getElementById("comentario");
const resultadoEl = document.getElementById("resultado");
const detalleResultado = document.getElementById("detalle-resultado");
const reiniciarBtn = document.getElementById("reiniciar");
const volverBtn = document.getElementById("volver");
const contadorEl = document.getElementById("contador");
const conteoPreguntaEl = document.getElementById("conteo-pregunta");
const barraProgreso = document.getElementById("progreso");

fetch("datos/quiz.json")
  .then((res) => res.json())
  .then((json) => {
    datos = json.filter((item) => item.tipo === "quiz comentado");
    const temas = [...new Set(datos.map((item) => item.tema))];
    temas.forEach((tema) => {
      const option = document.createElement("option");
      option.value = tema;
      option.textContent = tema;
      temaSelect.appendChild(option);
    });
  });

iniciarBtn.addEventListener("click", () => {
  const tema = temaSelect.value;
  if (!tema) return alert("Selecciona un tema");

  preguntas = datos.filter((item) => item.tema === tema);
  preguntas = preguntas.sort(() => 0.5 - Math.random()).slice(0, 15);
  preguntaActual = 0;
  puntaje = 0;
  document.querySelector(".seleccion-tema").classList.add("oculto");
  resultadoEl.classList.add("oculto");
  juego.classList.remove("oculto");
  mostrarPregunta();
});

function mostrarPregunta() {
  resetearEstado();

  const actual = preguntas[preguntaActual];
  preguntaEl.textContent = actual.pregunta;

  const opciones = [actual.respuesta, actual.opcion_1, actual.opcion_2, actual.opcion_3].sort(() => 0.5 - Math.random());

  opciones.forEach((op) => {
    const btn = document.createElement("button");
    btn.textContent = op;
    btn.classList.add("opcion");
    btn.addEventListener("click", () => seleccionarOpcion(op, actual));
    opcionesEl.appendChild(btn);
  });

  conteoPreguntaEl.textContent = `Pregunta ${preguntaActual + 1} de ${preguntas.length}`;
  iniciarTemporizador();
}

function seleccionarOpcion(opcion, actual) {
  detenerTemporizador();

  const botones = opcionesEl.querySelectorAll("button");
  botones.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === actual.respuesta) {
      btn.classList.add("correcta");
    } else if (btn.textContent === opcion) {
      btn.classList.add("incorrecta");
    }
  });

  if (opcion === actual.respuesta) {
    puntaje++;
  }

  comentarioEl.textContent = actual["cita biblica"];
  comentarioEl.classList.remove("oculto");

  setTimeout(() => {
    preguntaActual++;
    if (preguntaActual < preguntas.length) {
      mostrarPregunta();
    } else {
      mostrarResultado();
    }
  }, 6000);
}

function mostrarResultado() {
  juego.classList.add("oculto");
  resultadoEl.classList.remove("oculto");
  detalleResultado.textContent = `Respondiste correctamente ${puntaje} de ${preguntas.length} preguntas.`;
}

function resetearEstado() {
  opcionesEl.innerHTML = "";
  comentarioEl.classList.add("oculto");
  contadorEl.textContent = "Tiempo: 58s";
  barraProgreso.style.width = "100%";
  barraProgreso.style.backgroundColor = "green";
}

function iniciarTemporizador() {
  tiempo = 58;
  contadorEl.textContent = `Tiempo: ${tiempo}s`;
  barraProgreso.style.width = "100%";
  barraProgreso.style.backgroundColor = "green";

  intervalo = setInterval(() => {
    tiempo--;
    contadorEl.textContent = `Tiempo: ${tiempo}s`;
    const porcentaje = (tiempo / 58) * 100;
    barraProgreso.style.width = `${porcentaje}%`;

    if (tiempo <= 20 && tiempo > 10) {
      barraProgreso.style.backgroundColor = "orange";
    } else if (tiempo <= 10) {
      barraProgreso.style.backgroundColor = "red";
    }

    if (tiempo <= 0) {
      clearInterval(intervalo);
      seleccionarOpcion("tiempo agotado", preguntas[preguntaActual]);
    }
  }, 1000);
}

function detenerTemporizador() {
  clearInterval(intervalo);
}

reiniciarBtn.addEventListener("click", () => {
  document.querySelector(".seleccion-tema").classList.remove("oculto");
  resultadoEl.classList.add("oculto");
});

volverBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});
