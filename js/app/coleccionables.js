async function cargarColeccionables() {
  try {
    const respuesta = await fetch('datos/coleccionables.json');
    const data = await respuesta.json();

    for (const categoria in data) {
      for (const tema in data[categoria]) {
        const coleccionable = data[categoria][tema];
        console.log(`Tema: ${tema}, Categoría: ${categoria}`);
        console.log(`Imagen A: ${coleccionable.img_a}`);
        console.log(`Imagen B: ${coleccionable.img_b}`);
      }
    }
  } catch (error) {
    console.error('Error al cargar los coleccionables:', error);
  }
}

// Ejecutar al cargar la página
cargarColeccionables();

