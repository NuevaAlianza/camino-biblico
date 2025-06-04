// Función para cargar y mostrar progreso desde localStorage
function cargarProgreso() {
  // Quiz Comentado
  const progresoQuiz = JSON.parse(localStorage.getItem('progresoQuiz')) || {
    total: 0,
    correctas: 0
  };
  document.getElementById('quiz-total').textContent = 
    `Total preguntas respondidas: ${progresoQuiz.total}`;
  document.getElementById('quiz-correctas').textContent = 
    `Respuestas correctas: ${progresoQuiz.correctas}`;
  const porcentajeQuiz = progresoQuiz.total > 0 ? 
    Math.round((progresoQuiz.correctas / progresoQuiz.total) * 100) : 0;
  document.getElementById('quiz-porcentaje').textContent = 
    `Porcentaje de aciertos: ${porcentajeQuiz}%`;

  // Citas Bíblicas
  const progresoCitas = JSON.parse(localStorage.getItem('progresoCitas')) || {
    total: 0,
    correctas: 0
  };
  document.getElementById('citas-total').textContent = 
    `Total preguntas respondidas: ${progresoCitas.total}`;
  document.getElementById('citas-correctas').textContent = 
    `Respuestas correctas: ${progresoCitas.correctas}`;
  const porcentajeCitas = progresoCitas.total > 0 ? 
    Math.round((progresoCitas.correctas / progresoCitas.total) * 100) : 0;
  document.getElementById('citas-porcentaje').textContent = 
    `Porcentaje de aciertos: ${porcentajeCitas}%`;
}

// Función para borrar progreso
function borrarProgreso() {
  if(confirm('¿Seguro que quieres borrar todo el progreso?')) {
    localStorage.removeItem('progresoQuiz');
    localStorage.removeItem('progresoCitas');
    cargarProgreso();
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarProgreso();
  document.getElementById('borrarProgreso').addEventListener('click', borrarProgreso);
});


