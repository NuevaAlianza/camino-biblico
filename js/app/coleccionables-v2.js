// js/app/coleccionables-v2.js

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
    alert(`Entrar a categoría: ${categoria}`);
  });

  resumen.appendChild(card);
}
