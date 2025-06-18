 let coleccionablesData = {};
 let temporadasData = [];

Promise.all([
  fetch('./datos/coleccionables.json').then(res => res.json()),
  fetch('./datos/temporadas.json').then(res => res.json())
]).then(([coleccionables, temporadas]) => {
  coleccionablesData = coleccionables;
  temporadasData = temporadas;
  mostrarResumenCategorias();
});

function mostrarResumenCategorias() {
  const resumen = document.getElementById("resumen-categorias");
  resumen.innerHTML = "";

  const progreso = JSON.parse(localStorage.getItem("progreso")) || { categorias: {}, temporadas: {} };
  const progresoCategorias = progreso.categorias || {};

  // Mostrar todas las categorías presentes en coleccionablesData
  for (const categoria in coleccionablesData) {
    const temas = coleccionablesData[categoria];
    const total = Object.keys(temas).length;

    const completados = Object.entries(temas).filter(([tema]) => {
      return progresoCategorias[categoria]?.[tema]?.estado === "completado";
    });

    const desbloqueados = completados.length;

    const notas = completados
      .map(([tema]) => progresoCategorias[categoria][tema]?.nota)
      .filter(n => ["A", "B", "C"].includes(n));

    let promedio = "-";
    if (notas.length > 0) {
      const suma = notas.reduce((acc, n) => acc + (n === "A" ? 3 : n === "B" ? 2 : 1), 0);
      const media = Math.round(suma / notas.length);
      promedio = media === 3 ? "A" : media === 2 ? "B" : "C";
    }

    const porcentaje = Math.round((desbloqueados / total) * 100);

    const card = document.createElement("div");
    card.className = "card-categoria";
    card.innerHTML = `
      <h2>${categoria} (${desbloqueados}/${total})</h2>
      <p>Nota promedio: ${promedio}</p>
      <div class="progreso">
        <div class="progreso-barra" style="width: ${porcentaje}%;"></div>
      </div>
    `;
    card.addEventListener("click", () => mostrarPersonajes(categoria));
    resumen.appendChild(card);
  }

  // Agregar la tarjeta de Temporadas
  const card = document.createElement("div");
  card.className = "card-categoria";
  card.innerHTML = `
    <h2>Temporadas</h2>
    <p>Coleccionables especiales por evento</p>
    <div class="progreso"><div class="progreso-barra" style="width:100%"></div></div>
  `;
  card.addEventListener("click", () => mostrarPersonajes("Temporadas"));
  resumen.appendChild(card);
}

function mostrarPersonajes(categoriaActual) {
  const vistaPersonajes = document.getElementById("vista-personajes");
  const resumenCategorias = document.getElementById("resumen-categorias");
  const titulo = document.getElementById("titulo-categoria");
  const contenedor = document.getElementById("personajes-categoria");

  resumenCategorias.classList.add("oculto");
  vistaPersonajes.classList.remove("oculto");

  contenedor.classList.remove("fade-in");
  contenedor.classList.add("fade-out");

  setTimeout(() => {
    contenedor.innerHTML = "";
    titulo.textContent = categoriaActual;

    if (categoriaActual === "Temporadas") {
      const progreso = JSON.parse(localStorage.getItem("progreso")) || {};
      const progresoTemporadas = progreso.temporadas || {};

      temporadasData.forEach(temp => {
        const nota = progresoTemporadas[temp.id]?.nota || "F";
        const col = temp.coleccionable;

        let ruta = "assets/img/coleccionables/bloqueado.png";
        if (nota === "A") ruta = col.imagen_a;
        else if (nota === "B") ruta = col.imagen_b;
        else if (nota === "C") ruta = col.imagen_c;

        const card = document.createElement("div");
        card.className = "card-personaje";
        card.innerHTML = `
          <img src="${ruta}" alt="${col.nombre}" />
          <h3>${col.nombre}</h3>
          <p class="nota">Nota: ${nota}</p>
        `;

        card.addEventListener("click", () => {
          mostrarModal({
            tema: col.nombre,
            nota,
            rutaImagen: ruta,
            descripcion: temp.descripcion || ""
          });
        });

        contenedor.appendChild(card);
      });

    } else {
  const temas = coleccionablesData[categoriaActual] || {};
  const progresoCategorias = JSON.parse(localStorage.getItem("progreso"))?.categorias || {};
  const progresoTemas = progresoCategorias[categoriaActual] || {};

  for (const tema in temas) {
    const info = temas[tema];
    const nota = progresoTemas[tema]?.nota || "F";

    let ruta = "assets/img/coleccionables/bloqueado.png";
    if (nota === "A") ruta = info.img_a;
    else if (nota === "B") ruta = info.img_b;
    else if (nota === "C") ruta = info.img_c;

    const card = document.createElement("div");
    card.className = "card-personaje";
    card.innerHTML = `
      <img src="${ruta}" alt="${tema}" />
      <h3>${tema}</h3>
      <p class="nota">Nota: ${nota}</p>
    `;

    card.addEventListener("click", () => {
      mostrarModal({
        tema,
        nota,
        rutaImagen: ruta,
        descripcion: info.descripcion || ""
      });
    });

    contenedor.appendChild(card);
  }
}



    contenedor.classList.remove("fade-out");
    contenedor.classList.add("fade-in");

  }, 150);

  // Navegación entre categorías con scroll
  const todas = [...Object.keys(coleccionablesData), "Temporadas"];
  const i = todas.indexOf(categoriaActual);

  vistaPersonajes.onwheel = (e) => {
    if (e.deltaY > 30 && i < todas.length - 1) {
      mostrarPersonajes(todas[i + 1]);
    } else if (e.deltaY < -30 && i > 0) {
      mostrarPersonajes(todas[i - 1]);
    }
  };
}

document.getElementById("volver-resumen").addEventListener("click", () => {
  document.getElementById("vista-personajes").classList.add("oculto");
  document.getElementById("resumen-categorias").classList.remove("oculto");
});

function mostrarModal({ tema, nota, rutaImagen, descripcion = "" }) {
  document.getElementById("modal-imagen").src = rutaImagen;
  document.getElementById("modal-nombre").textContent = tema;
  document.getElementById("modal-nota").textContent = `Nota obtenida: ${nota}`;
  document.getElementById("modal-info").textContent = descripcion;

  const btn = document.getElementById("descargar-img");
  if (nota === "A") {
    btn.style.display = "inline-block";
    btn.href = rutaImagen;
  } else {
    btn.style.display = "none";
  }

  document.getElementById("modal-detalle").classList.remove("oculto");
}

document.getElementById("cerrar-modal").addEventListener("click", () => {
  document.getElementById("modal-detalle").classList.add("oculto");
});
