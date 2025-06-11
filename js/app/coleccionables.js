async function cargarColeccionables() {
  try {
    const [coleccionablesRes, temporadasRes] = await Promise.all([
      fetch('./datos/coleccionables.json'),
      fetch('./datos/temporadas.json')
    ]);

    const data = await coleccionablesRes.json();
    const temporadas = await temporadasRes.json();

    const progreso = JSON.parse(localStorage.getItem('progreso')) || { version: 2, categorias: {}, temporadas: {} };
    const progresoCategorias = progreso.categorias || {};

    const galeriaCategorias = document.getElementById("galeria-categorias");
    const galeriaTemporadas = document.getElementById("galeria-temporadas");

    // 🧩 Coleccionables por categoría y tema
    for (const categoria in data) {
      for (const tema in data[categoria]) {
        const coleccionable = data[categoria][tema];

        const progresoCategoria = Object.keys(progresoCategorias).find(
          cat => cat.toLowerCase() === categoria.toLowerCase()
        );
        const progresoTema = progresoCategoria ? progresoCategorias[progresoCategoria]?.[tema] : null;
        const nota = progresoTema?.nota;

        let imagen;
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
        tarjeta.className = `tarjeta-coleccionable`;

        if (nota === "A" || nota === "B") {
          tarjeta.innerHTML = `
            <div class="contenedor-descarga">
              <a href="${imagen}" download="${coleccionable.nombre}.png">
                <img src="${imagen}" alt="${coleccionable.nombre}">
                <span class="icono-descarga">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#333">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.92v4h4.5v-4h3.92L12 2z"/>
                  </svg>
                </span>
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

        galeriaCategorias.appendChild(tarjeta);
      }
    }

    // 🗓️ Coleccionables por temporada
    for (const temporada of temporadas) {
      const progresoTemp = progreso.temporadas?.[temporada.id];
      const nota = progresoTemp?.nota;
      const coleccionable = temporada.coleccionable;

      console.log("🗓️ Mostrando temporada:", temporada.id, "con nota", nota);

      let imagen;
      if (nota === "A") {
        imagen = coleccionable.imagen_a;
      } else if (nota === "B") {
        imagen = coleccionable.imagen_b;
      } else if (nota === "C") {
        imagen = coleccionable.imagen_c;
      } else {
        imagen = "assets/img/coleccionables/bloqueado.png";
      }

      const tarjeta = document.createElement("div");
      tarjeta.className = `tarjeta-coleccionable`;

      if (nota === "A" || nota === "B") {
        tarjeta.innerHTML = `
          <div class="contenedor-descarga">
            <a href="${imagen}" download="${coleccionable.nombre}.png">
              <img src="${imagen}" alt="${coleccionable.nombre}">
              <span class="icono-descarga">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#333">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.92v4h4.5v-4h3.92L12 2z"/>
                </svg>
              </span>
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

      galeriaTemporadas.appendChild(tarjeta);
    }
  } catch (error) {
    console.error('Error al cargar los coleccionables:', error);
  }
}

cargarColeccionables();
