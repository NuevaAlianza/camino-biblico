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

  for (const categoria in coleccionablesData) {
    const temas = coleccionablesData[categoria];
    const total = Object.keys(temas).length;

    const progresoCategoriaKey = Object.keys(progresoCategorias).find(
      cat => cat.toLowerCase() === categoria.toLowerCase()
    );
    const progresoTemas = progresoCategoriaKey ? progresoCategorias[progresoCategoriaKey] : {};

    const notas = Object.entries(temas)
      .map(([tema]) => {
        const temaProgresoKey = Object.keys(progresoTemas).find(
          t => t.toLowerCase() === tema.toLowerCase()
        );
        const nota = temaProgresoKey ? progresoTemas[temaProgresoKey]?.nota : "";
        return (nota || "").toUpperCase();
      })
      .filter(n => ["A", "B", "C"].includes(n));

    const desbloqueados = notas.length;

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

  // Tarjeta de temporadas
  const card = document.createElement("div");
  card.className = "card-categoria";
  card.innerHTML = `
    <h2>Temporadas</h2>
    <p>Coleccionables especiales por evento</p>
    <div class="progreso"><div class="progreso-barra" style="width:100%"></div></div>
  `;
  card.addEventListener("click", () => mostrarPersonajes("Temporadas"));
  resumen.appendChild(card);
  // ✅ Llama a los logros después de renderizar las categorías
  mostrarResumenLogros();
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
          if (nota === "A") {
            mostrarModal({
              tema: col.nombre,
              nota,
              rutaImagen: ruta,
              descripcion: temp.descripcion || ""
            });
          } else {
            let mensaje = `¡Aún no has comenzado "${col.nombre}"! ¿Te animas a intentarlo?`;
            if (nota === "B") mensaje = `¡Buen intento en "${col.nombre}", pero puedes hacerlo aún mejor! ¿Repetimos?`;
            else if (nota === "C") mensaje = `Vamos a superar esa nota en "${col.nombre}". ¿Listo para mejorar?`;
            else if (nota === "F") mensaje = `Todavía puedes mejorar tu resultado en "${col.nombre}". ¿Quieres intentarlo ahora?`;

            if (confirm(mensaje)) {
              const bloqueURL = encodeURIComponent(temp.id);
              window.location.href = `citas.html?bloque=${bloqueURL}`;
            }
          }
        });

        contenedor.appendChild(card);
      });

    } else {
      const temas = coleccionablesData[categoriaActual] || {};
      const progresoCategorias = JSON.parse(localStorage.getItem("progreso"))?.categorias || {};
      const progresoCategoriaKey = Object.keys(progresoCategorias).find(
        cat => cat.toLowerCase() === categoriaActual.toLowerCase()
      );
      const progresoTemas = progresoCategoriaKey ? progresoCategorias[progresoCategoriaKey] : {};

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
          if (nota === "A") {
            mostrarModal({
              tema,
              nota,
              rutaImagen: ruta,
              descripcion: info.descripcion || ""
            });
          } else {
            let mensaje = `¡Aún no has comenzado "${tema}"! ¿Te animas a intentarlo?`;
            if (nota === "B") mensaje = `¡Buen intento en "${tema}", pero puedes hacerlo aún mejor! ¿Repetimos?`;
            else if (nota === "C") mensaje = `Vamos a superar esa nota en "${tema}". ¿Listo para mejorar?`;
            else if (nota === "F") mensaje = `Todavía puedes mejorar tu resultado en "${tema}". ¿Quieres intentarlo ahora?`;

            if (confirm(mensaje)) {
              const temaURL = encodeURIComponent(tema);
              const categoriaURL = encodeURIComponent(categoriaActual);
              window.location.href = `quiz.html?categoria=${categoriaURL}&tema=${temaURL}`;
            }
          }
        });

        contenedor.appendChild(card);
      }
    }

    contenedor.classList.remove("fade-out");
    contenedor.classList.add("fade-in");

  }, 150);

  // Scroll entre categorías
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

function mostrarResumenLogros() {
  const resumen = document.getElementById("resumen-categorias");

  const progreso = JSON.parse(localStorage.getItem("progreso")) || { categorias: {} };
  const progresoCategorias = progreso.categorias || {};

  const logros = coleccionablesData.logros || {};
  const completosPorCategoria = logros.completos_por_categoria || {};
  const totalesPorA = logros.totales_por_a || {};

  let totalA = 0;
  let completados = [];

  // Calcular total de A y categorías completas
  for (const categoria in coleccionablesData) {
    if (!completosPorCategoria[categoria]) continue;
    const temas = coleccionablesData[categoria];
    const progresoTemas = progresoCategorias[categoria] || {};

    const todosA = Object.keys(temas).every(t => (progresoTemas[t]?.nota || "") === "A");
    if (todosA) completados.push(categoria);

    totalA += Object.values(progresoTemas).filter(p => p.nota === "A").length;
  }

  // Crear tarjeta "Logros especiales" siempre visible
  const card = document.createElement("div");
  card.className = "card-categoria";
  card.innerHTML = `
    <h2>🏅 Logros especiales (${completados.length + Object.keys(totalesPorA).filter(k => totalA >= parseInt(k)).length})</h2>
    <p>Coleccionables por rendimiento destacado</p>
    <div class="progreso"><div class="progreso-barra" style="width:100%"></div></div>
  `;
  card.addEventListener("click", () => mostrarPersonajes("Logros"));
  resumen.appendChild(card);

  // Preparar "coleccionablesData['Logros']" con todos los posibles logros
  coleccionablesData["Logros"] = {};

  for (const categoria in completosPorCategoria) {
    const logrado = completados.includes(categoria);
    coleccionablesData["Logros"][categoria] = {
      img_a: logrado ? completosPorCategoria[categoria] : "assets/img/coleccionables/bloqueado.png",
      img_b: "assets/img/coleccionables/generica_b.png",
      img_c: "assets/img/coleccionables/generica_c.png",
      descripcion: logrado
        ? `Completaste todos los temas de "${categoria}" con nota A.`
        : `Logro bloqueado. Completa todos los temas de "${categoria}" con nota A para desbloquearlo.`,
      nota: logrado ? "A" : "F"
    };
  }

  for (const nStr in totalesPorA) {
    const n = parseInt(nStr);
    const logrado = totalA >= n;
    const nombre = `Logro ${n} A`;
    coleccionablesData["Logros"][nombre] = {
      img_a: logrado ? totalesPorA[nStr] : "assets/img/coleccionables/bloqueado.png",
      img_b: "assets/img/coleccionables/generica_b.png",
      img_c: "assets/img/coleccionables/generica_c.png",
      descripcion: logrado
        ? `¡Has alcanzado ${n} temas con nota A!`
        : `Logro bloqueado. Alcanzar ${n} temas con nota A para desbloquearlo.`,
      nota: logrado ? "A" : "F"
    };
  }
}
