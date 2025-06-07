let datos = [];
let preguntas = [];
let preguntaActual = 0;
let puntaje = 0;
let tiempo = 58;
let intervalo;

const categoriaSelect = document.getElementById("categoria");
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

// Sonidos
const sonidoInicio = new Audio("assets/sonidos/inicio.mp3");
const sonidoAdvertencia = new Audio("assets/sonidos/warning.mp3");
const sonidoFin = new Audio("assets/sonidos/end.mp3");
const sonidoClick = new Audio("assets/sonidos/click.mp3");
const sonidoCorrecto = new Audio("assets/sonidos/correcto.mp3");
const sonidoIncorrecto = new Audio("assets/sonidos/incorrecto.mp3");

function reproducirSonido(audio) {
  audio.currentTime = 0;
  audio.play();
}

fetch("datos/quiz.json")
  .then((res) => res.json())
  .then((json) => {
    datos = json.filter((item) => item.tipo === "quiz comentado");

    // Obtener categorías únicas y llenar select categoría
    const categorias = [...new Set(datos.map((item) => item.categoria))];
    categorias.forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria;
      option.textContent = categoria;
      categoriaSelect.appendChild(option);
    });
  });

categoriaSelect.addEventListener("change", () => {
  const categoria = categoriaSelect.value;

  // Limpiar opciones de temas
  temaSelect.innerHTML = '<option value="">-- Elige un tema --</option>';

  if (!categoria) {
    temaSelect.disabled = true;
    iniciarBtn.disabled = true;
    return;
  }

  // Obtener temas asociados a la categoría
  const temas = [...new Set(datos.filter((item) => item.categoria === categoria).map(item => item.tema))];

  temas.forEach((tema) => {
    const option = document.createElement("option");
    option.value = tema;
    option.textContent = tema;
    temaSelect.appendChild(option);
  });

  temaSelect.disabled = false;
  iniciarBtn.disabled = true;
});

temaSelect.addEventListener("change", () => {
  iniciarBtn.disabled = temaSelect.value === "";
});

iniciarBtn.addEventListener("click", () => {
  reproducirSonido(sonidoClick);

  const categoria = categoriaSelect.value;
  const tema = temaSelect.value;

  if (!categoria) return alert("Selecciona una categoría");
  if (!tema) return alert("Selecciona un tema");

  preguntas = datos.filter(item => item.categoria === categoria && item.tema === tema);
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
  reproducirSonido(sonidoInicio);

  const actual = preguntas[preguntaActual];
  preguntaEl.textContent = actual.pregunta;

  const opciones = [actual.respuesta, actual.opcion_1, actual.opcion_2, actual.opcion_3].sort(() => 0.5 - Math.random());

  opciones.forEach((op) => {
    const btn = document.createElement("button");
    btn.textContent = op;
    btn.classList.add("opcion");
    btn.addEventListener("click", () => {
      reproducirSonido(sonidoClick);
      seleccionarOpcion(op, actual);
    });
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
      btn.classList.add("correcto");
    } else if (btn.textContent === opcion) {
      btn.classList.add("incorrecto");
    }
  });

  if (opcion === actual.respuesta) {
    puntaje++;
    reproducirSonido(sonidoCorrecto);
  } else {
    reproducirSonido(sonidoIncorrecto);
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
  guardarProgreso("quiz comentado", temaSelect.value, puntaje, preguntas.length);
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

    if (tiempo === 20 || tiempo === 10) {
      reproducirSonido(sonidoAdvertencia);
    }

    if (tiempo <= 20 && tiempo > 10) {
      barraProgreso.style.backgroundColor = "orange";
    } else if (tiempo <= 10) {
      barraProgreso.style.backgroundColor = "red";
    }

    if (tiempo <= 0) {
      clearInterval(intervalo);
      reproducirSonido(sonidoFin);
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

async function actualizarTarjetas() {
  const preguntas = await cargarDatosQuiz();
  const progreso = JSON.parse(localStorage.getItem("progreso")) || [];

  // Agrupar por categoría y tema
  const categorias = {};
  preguntas.forEach(p => {
    if (!categorias[p.tema]) categorias[p.tema] = { categoria: p.categoria, total: 0 };
    categorias[p.tema].total += 1;
  });

  // Crear resumen por tema con base en progreso
  const resumen = Object.entries(categorias).map(([tema, datos]) => {
    const intentos = progreso.filter(p => p.tema === tema);
    const mejor = intentos.reduce((acc, cur) => cur.puntaje > acc ? cur.puntaje : acc, 0);
    return {
      tema,
      categoria: datos.categoria,
      total: datos.total,
      intentos: intentos.length,
      mejorPuntaje: mejor
    };
  });

  mostrarTarjetas(resumen);
}
function mostrarTarjetas(resumen) {
  const contenedor = document.getElementById("tarjetas");
  contenedor.innerHTML = "";

  resumen.forEach(item => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML = `
      <h3>${item.tema}</h3>
      <p><strong>Categoría:</strong> ${item.categoria}</p>
      <p><strong>Preguntas:</strong> ${item.total}</p>
      <p><strong>Intentos:</strong> ${item.intentos}</p>
      <p><strong>Mejor Puntaje:</strong> ${item.mejorPuntaje || 0}</p>
    `;
    contenedor.appendChild(tarjeta);
  });
}
async function cargarDatosQuiz() {
  const res = await fetch("datos/quiz.json");
  const json = await res.json();
  return json.filter(item => item.tipo === "quiz comentado");
}
function guardarProgreso(tipo, tema, puntaje, total) {
  const fecha = new Date().toISOString();

  // Actualizar historial
  const historial = JSON.parse(localStorage.getItem("historial")) || [];
  historial.push({ tipo, tema, puntaje, total, fecha });
  localStorage.setItem("historial", JSON.stringify(historial));

  // Calcular nota
  const porcentaje = (puntaje / total) * 100;
  let nota = "F";
  if (porcentaje >= 90) nota = "A";
  else if (porcentaje >= 75) nota = "B";
  else if (porcentaje >= 60) nota = "C";
  else if (porcentaje >= 40) nota = "D";

  // Buscar la categoría real desde 'datos'
  const preguntaEjemplo = datos.find(p => p.tema === tema);
  const categoriaReal = preguntaEjemplo?.categoria || "Desconocido";

  // Actualizar progreso por tema en su categoría real
  const progreso = JSON.parse(localStorage.getItem("progreso")) || { version: 1, categorias: {} };
  if (!progreso.categorias[categoriaReal]) progreso.categorias[categoriaReal] = {};
  progreso.categorias[categoriaReal][tema] = {
    porcentaje: Math.round(porcentaje),
    nota,
    estado: "completado"
  };

  localStorage.setItem("progreso", JSON.stringify(progreso));
}

