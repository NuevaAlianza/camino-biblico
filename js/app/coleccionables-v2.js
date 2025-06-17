document.addEventListener("DOMContentLoaded", () => {
  const resumen = document.getElementById("resumen-categorias");

  const progreso = JSON.parse(localStorage.getItem("progreso")) || { categorias: {} };
  const categorias = progreso.categorias;

  for (const categoria in categorias) {
    const temas = categorias[categoria];
    const total = Object.keys(temas).length;
    const desbloqueados = Object.values(temas).filter(t => t.estado === "completado").length;

    // Calcular nota promedio
    const notas = Object.values(temas)
      .map(t => t.nota)
      .filter(nota => ["A", "B", "C"].includes(nota));

    let promedio = "-";
    if (notas.length > 0) {
      const sumaNotas = notas.reduce((acc, nota) => {
        if (nota === "A") return acc + 3;
        if (nota === "B") return acc + 2;
        if (nota === "C") return acc + 1;
        return acc;
      }, 0);
      const valor = Math.round(sumaNotas / notas.length);
      promedio = valor === 3 ? "A" : valor === 2 ? "B" : "C";
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

    card.addEventListener("click", () => {
      mostrarPersonajes(categoria, temas);
    });

    resumen.appendChild(card);
  }
});

function mostrarPersonajes(categoriaNombre, temas) {
  document.getElementById("resumen-categorias").classList.add("oculto");
  document.getElementById("vista-personajes").classList.remove("oculto");
  document.getElementById("titulo-categoria").textContent = categoriaNombre;

  const contenedor = document.getElementById("personajes-categoria");
  contenedor.innerHTML = "";

  for (const tema in temas) {
    const datos = temas[tema];
    const nota = datos.nota || "F";
    const imagenNombre = nota === "A"
      ? `${tema.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`
      : nota === "B"
      ? "generica_b.png"
      : nota === "C"
      ? "generica_c.png"
      : "bloqueado.png";

    const ruta = `assets/img/coleccionables/${imagenNombre}`;

    const card = document.createElement("div");
    card.className = "card-personaje";
    card.innerHTML = `
      <img src="${ruta}" alt="${tema}" />
      <h3>${tema}</h3>
      <p class="nota">Nota: ${nota}</p>
    `;

    card.addEventListener("click", () => {
      mostrarModal({ tema, nota, rutaImagen: ruta });
    });

    contenedor.appendChild(card);
  }
}

document.getElementById("volver-resumen").addEventListener("click", () => {
  document.getElementById("vista-personajes").classList.add("oculto");
  document.getElementById("resumen-categorias").classList.remove("oculto");
});

function mostrarModal({ tema, nota, rutaImagen }) {
  document.getElementById("modal-imagen").src = rutaImagen;
  document.getElementById("modal-nombre").textContent = tema;
  document.getElementById("modal-nota").textContent = `Nota obtenida: ${nota}`;
  document.getElementById("modal-info").textContent = ""; // opcional: texto explicativo

  const descargarBtn = document.getElementById("descargar-img");
  if (nota === "A") {
    descargarBtn.style.display = "inline-block";
    descargarBtn.href = rutaImagen;
  } else {
    descargarBtn.style.display = "none";
  }

  document.getElementById("modal-detalle").classList.remove("oculto");
}

document.getElementById("cerrar-modal").addEventListener("click", () => {
  document.getElementById("modal-detalle").classList.add("oculto");
});
