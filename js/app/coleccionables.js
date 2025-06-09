async function cargarColeccionables() {
  try {
    const respuesta = await fetch('./datos/coleccionables.json');
    const data = await respuesta.json();

    const progreso = JSON.parse(localStorage.getItem('progreso')) || { version: 2, categorias: {} };
    const progresoCategorias = progreso.categorias || {};

    const galeria = document.getElementById("galeria");

    for (const categoria in data) {
      for (const tema in data[categoria]) {
        const coleccionable = data[categoria][tema];

        // Comparación sin importar mayúsculas
        const progresoCategoria = Object.keys(progresoCategorias).find(
          cat => cat.toLowerCase() === categoria.toLowerCase()
        );
        const progresoTema = progresoCategoria ? progresoCategorias[progresoCategoria]?.[tema] : null;
        const nota = progresoTema?.nota;

        console.log(`🧩 [${categoria} > ${tema}] → Nota: ${nota}`);

      
let imagen, claseExtra = "";

if (nota === "A") {
  imagen = coleccionable.img_a;
} else if (nota === "B") {
  imagen = coleccionable.img_b;
} else if (nota === "C") {
  imagen = coleccionable.img_c;
} else {
  imagen = "assets/img/coleccionables/bloqueado.png";
}

        const tarjeta = document.createElement("div");
        tarjeta.className = `tarjeta-coleccionable ${claseExtra}`;

        if (nota === "A" || nota === "B") {
  tarjeta.innerHTML = `
    <div class="contenedor-descarga">
      <a href="${imagen}" download="${coleccionable.nombre}.png">
        <img src="${imagen}" alt="${coleccionable.nombre}">
        <span class="icono-descarga">⬇</span>
      </a>
    </div>
    <h3>${coleccionable.nombre}</h3>
  `;
} else {
  tarjeta.innerHTML = `
    <img src="${imagen}" alt="${coleccionable.nombre}">
    <h3>${coleccionable.nombre}</h3>
  `;
}


        galeria.appendChild(tarjeta);
      }
    }
  } catch (error) {
    console.error('Error al cargar los coleccionables:', error);
  }
}

cargarColeccionables();
