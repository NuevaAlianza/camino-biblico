async function cargarColeccionables() {
  try {
    const respuesta = await fetch('datos/coleccionables.json');
    const data = await respuesta.json();

    const progreso = JSON.parse(localStorage.getItem('progreso')) || {};
    const progresoCategorias = progreso.categorias || {};

    const galeria = document.getElementById("galeria");

    for (const categoria in data) {
      // Crear contenedor de categoría
      const seccion = document.createElement("section");
      const titulo = document.createElement("h2");
      titulo.textContent = categoria;
      seccion.appendChild(titulo);

      const contenedorTemas = document.createElement("div");
      contenedorTemas.className = "lista-coleccionables";

      for (const tema in data[categoria]) {
        const coleccionable = data[categoria][tema];
        const progresoTema = progresoCategorias[categoria]?.[tema];
        const nota = progresoTema?.nota || "F";
        const imagen = nota === "A" ? coleccionable.img_a : coleccionable.img_b;

        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-coleccionable";
        tarjeta.innerHTML = `
          <img src="${imagen}" alt="${coleccionable.nombre}">
          <h3>${coleccionable.nombre}</h3>
        `;

        contenedorTemas.appendChild(tarjeta);
      }

      seccion.appendChild(contenedorTemas);
      galeria.appendChild(seccion);
    }
  } catch (error) {
    console.error('Error al cargar los coleccionables:', error);
  }
}

document.addEventListener("DOMContentLoaded", cargarColeccionables);
