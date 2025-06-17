// js/app/coleccionables-v2.js

document.addEventListener("DOMContentLoaded", () => {
  const resumen = document.getElementById("resumen-categorias");

  // Datos ficticios (luego vendrán de progreso + quiz.json)
  const categorias = [
    { nombre: "Apóstoles", total: 4, desbloqueados: 2, nota: "B" },
    { nombre: "Mujeres de la Biblia", total: 6, desbloqueados: 3, nota: "A" },
    { nombre: "Patriarcas", total: 3, desbloqueados: 1, nota: "C" },
  ];

  categorias.forEach(cat => {
    const porcentaje = Math.round((cat.desbloqueados / cat.total) * 100);

    const card = document.createElement("div");
    card.className = "card-categoria";
    card.innerHTML = `
      <h2>${cat.nombre} (${cat.desbloqueados}/${cat.total})</h2>
      <p>Nota promedio: ${cat.nota}</p>
      <div class="progreso">
        <div class="progreso-barra" style="width: ${porcentaje}%;"></div>
      </div>
    `;

    card.addEventListener("click", () => {
      // Aquí conectaremos al carrusel más adelante
      alert(`Entrar a ${cat.nombre}`);
    });

    resumen.appendChild(card);
  });
});
