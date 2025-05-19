let preguntas = [];
let preguntasFiltradas = [];
let indice = 0;
let tiempo = 58;
let timer;
let respuestasCorrectas = 0;

// Cargar sonidos con rutas correctas
const sonidoCorrecto = new Audio('assets/sonidos/correcto.mp3');
const sonidoIncorrecto = new Audio('assets/sonidos/incorrecto.mp3');
const sonidoClick = new Audio('assets/sonidos/click.mp3');

async function cargarDatos() {
  const version = Date.now();
  const res = await fetch(`datos/quiz.json?v=${version}`);
  preguntas = await res.json();

  const temasUnicos = [...new Set(preguntas.map(p => p.tema))];
  const listaTemas = document.getElementById("listaTemas");
  listaTemas.innerHTML = "";

  temasUnicos.forEach(tema => {
    const btn = document.createElement("button");
    btn.textContent = tema;
    btn.onclick = () => {
      sonidoClick.play();
      seleccionarTema(tema);
    };
    listaTemas.appendChild(btn);
  });

  document.getElementById("inicioBtn").classList.add("oculto");
}

function seleccionarTema(tema) {
  preguntasFiltradas = preguntas.filter(p => p.tema === tema);
  indice = 0;
  respuestasCorrectas = 0;
  document.getElementById("temas").classList.add("oculto");
  document.getElementById("resultadoFinal").classList.add("oculto");
  document.getElementById("quiz").classList.remove("oculto");
  mostrarPregunta();
}

function mostrarPregunta() {
  clearInterval(timer);
  tiempo = 58;
  actualizarBarra();

  const p = preguntasFiltradas[indice];
  document.getElementById("textoPregunta").textContent = p.pregunta;
  document.getElementById("contador").textContent = `Pregunta ${indice + 1} de ${preguntasFiltradas.length}`;

  const opciones = [p.respuesta, p.opcion_1, p.opcion_2, p.opcion_3];
  const mezcladas = opciones.sort(() => Math.random() - 0.5);

  const contenedor = document.getElementById("opciones");
  contenedor.innerHTML = "";
  document.getElementById("comentario").classList.add("oculto");
  document.getElementById("siguienteBtn").classList.add("oculto");
  document.getElementById("resultadoFinal").classList.add("oculto");

  mezcladas.forEach(opcion => {
    const btn = document.createElement("button");
    btn.className = "opcion";
    btn.textContent = opcion;
    btn.onclick = () => evaluarRespuesta(btn, opcion === p.respuesta, p.cita_biblica);
    contenedor.appendChild(btn);
  });

  timer = setInterval(() => {
    tiempo--;
    actualizarBarra();
    if (tiempo <= 0) {
      clearInterval(timer);
      mostrarComentario(p.cita_biblica);
      document.querySelectorAll(".opcion").forEach(btn => {
        if (btn.textContent === p.respuesta) btn.classList.add("correcta");
        else btn.classList.add("incorrecta");
        btn.disabled = true;
      });
      document.getElementById("siguienteBtn").classList.remove("oculto");
    }
  }, 1000);
}

function actualizarBarra() {
  const barra = document.getElementById("barra");
  barra.style.width = (tiempo / 58 * 100) + "%";
  if (tiempo > 20) barra.style.backgroundColor = "#22c55e";
  else if (tiempo > 10) barra.style.backgroundColor = "#facc15";
  else barra.style.backgroundColor = "#ef4444";
}

function evaluarRespuesta(btn, esCorrecta, comentario) {
  clearInterval(timer);
  document.querySelectorAll(".opcion").forEach(b => {
    b.disabled = true;
    if (b.textContent === preguntasFiltradas[indice].respuesta) {
      b.classList.add("correcta");
    } else if (b === btn && !esCorrecta) {
      b.classList.add("incorrecta");
    }
  });

  if (esCorrecta) {
    respuestasCorrectas++;
    sonidoCorrecto.play();
  } else {
    sonidoIncorrecto.play();
  }

  mostrarComentario(comentario);
  document.getElementById("siguienteBtn").classList.remove("oculto");
}

function mostrarComentario(texto) {
  const comentario = document.getElementById("comentario");
  comentario.textContent = texto;
  comentario.classList.remove("oculto");
}

document.getElementById("siguienteBtn").onclick = () => {
  sonidoClick.play();
  indice++;
  if (indice < preguntasFiltradas.length) {
    mostrarPregunta();
  } else {
    mostrarResultadoFinal();
  }
};

function mostrarResultadoFinal() {
  document.getElementById("quiz").classList.add("oculto");
  const resultados = document.getElementById("resultadoFinal");
  const porcentaje = Math.round((respuestasCorrectas / preguntasFiltradas.length) * 100);

  let mensaje = "";
  if (porcentaje === 100) mensaje = "¡Perfecto! Conoces muy bien el tema.";
  else if (porcentaje >= 80) mensaje = "¡Muy bien! Tienes buen conocimiento.";
  else if (porcentaje >= 50) mensaje = "Está bien, pero puedes mejorar.";
  else mensaje = "Te recomendamos repasar este tema.";

  resultados.textContent = `Tu resultado: ${porcentaje}% - ${mensaje}`;
  resultados.classList.remove("oculto");
  document.getElementById("temas").classList.remove("oculto");
  document.getElementById("inicioBtn").classList.remove("oculto");
}

document.getElementById("volverBtn").onclick = () => {
  sonidoClick.play();
  document.getElementById("quiz").classList.add("oculto");
  document.getElementById("temas").classList.remove("oculto");
  document.getElementById("comentario").classList.add("oculto");
  document.getElementById("siguienteBtn").classList.add("oculto");
  clearInterval(timer);
};

document.getElementById("inicioBtn").onclick = () => {
  sonidoClick.play();
  document.getElementById("resultadoFinal").classList.add("oculto");
  document.getElementById("temas").classList.remove("oculto");
  document.getElementById("inicioBtn").classList.add("oculto");
};

cargarDatos();

