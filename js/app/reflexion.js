document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.querySelector('#contenedor');
  const titulo = document.querySelector('h2');

  try {
    const res = await fetch('datos/reflexion.json');
    const datos = await res.json();

    // Mostrar los temas disponibles
    const temas = Object.keys(datos);
    titulo.textContent = 'Elige un tema de reflexión:';

    const listaTemas = document.createElement('ul');
    listaTemas.classList.add('lista-temas');

    temas.forEach(tema => {
      const btn = document.createElement('button');
      btn.textContent = tema;
      btn.classList.add('tema-btn');
      btn.onclick = () => mostrarPreguntas(tema, datos[tema]);
      listaTemas.appendChild(btn);
    });

    contenedor.innerHTML = '';
    contenedor.appendChild(listaTemas);
  } catch (error) {
    contenedor.innerHTML = '<p>Error al cargar las preguntas.</p>';
    console.error('Error cargando reflexión.json:', error);
  }
});

function mostrarPreguntas(tema, preguntas) {
  const contenedor = document.querySelector('#contenedor');
  const titulo = document.querySelector('h2');
  titulo.textContent = `Reflexión: ${tema}`;

  const lista = document.createElement('ul');
  lista.classList.add('preguntas-lista');

  preguntas.forEach((item, i) => {
    const li = document.createElement('li');
    const pregunta = document.createElement('p');
    pregunta.textContent = `${i + 1}. ${item.pregunta}`;
    li.appendChild(pregunta);

    if (item.cita) {
      const cita = document.createElement('blockquote');
      cita.textContent = item.cita;
      cita.classList.add('cita-biblica');
      li.appendChild(cita);
    }

    lista.appendChild(li);
  });

  const volverBtn = document.createElement('button');
  volverBtn.textContent = '⬅ Volver a los temas';
  volverBtn.onclick = () => location.reload();

  contenedor.innerHTML = '';
  contenedor.appendChild(lista);
  contenedor.appendChild(volverBtn);
}
