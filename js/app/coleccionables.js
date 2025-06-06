async function cargarColeccionables() {
  try {
    const respuesta = await fetch('datos/coleccionables.json');
    const data = await respuesta.json();

    const progreso = JSON.parse(localStorage.getItem('progreso')) || {};
    const progresoCategorias = progreso.categorias || {};

    for (const categoria in data) {
      for (const tema in data[categoria]) {
        const coleccionable = data[categoria][tema];

        const progresoTema = progresoCategorias[categoria]?.[tema];
        const nota = progresoTema?.nota || "F";
        const imagen = nota === "A" ? coleccionable.img_a : coleccionable.img_b;

        console.log(`Mostrar: ${tema} (${categoria}) - Nota: ${nota} → Imagen: ${imagen}`);
      }
    }
  } catch (error) {
    console.error('Error al cargar los coleccionables:', error);
  }
}
