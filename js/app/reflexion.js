let datos = {};
let preguntasActuales = [];
let indiceActual = 0;

document.addEventListener('DOMContentLoaded', async () => {
  const select = document.getElementById('tema-select');
  const contenedor = document.getElementById('pregunta-container');
  const preguntaTexto = document.getElementById('pregunta-texto');
  const btnSiguiente = document.getElementById('btn-siguiente');

  try {
    const res = await fetch('datos/reflexion.json');
    datos = await res.json();

    // Rellenar opciones del <select>
    select.innerHTML = '<option value="">-- Elige un tema --</option>';
    for (const tema in datos) {
      const option = document.createElement('option');
      option.value = tema;
      option.textContent = tema.charAt(0).toUpperCase() + tema.slice(1);
      select.appendChild(option);
    }

    select.addEventListener('change', () => {
      const temaSeleccionado = select.value;
      if (temaSeleccionado && datos[temaSeleccionado]) {
        preguntasActuales = datos[temaSeleccionado];
        indiceActual = 0;
        mostrarPregunta(preguntaTexto, contenedor);
      } else {
        contenedor.style.display = 'none';
      }
    });

    btnSiguiente.addEventListener('click', () => {
      indiceActual++;
      mostrarPregunta(preguntaTexto, contenedor);
    });

  } catch (error) {
    console.error('Error cargando reflexion.json:', error);
  }
});

function mostrarPregunta(preguntaTexto, contenedor) {
  if (indiceActual < preguntasActuales.length) {
    const pregunta = preguntasActuales[indiceActual];
    preguntaTexto.textContent = `${indiceActual + 1}. ${pregunta.pregunta}`;
    contenedor.style.display = 'block';
  } else {
    preguntaTexto.textContent = '¡Has terminado todas las preguntas!';
  }
}
