let bloqueActual = null;
let citas = [];
let indiceActual = 0;
let respuestasCorrectasLibro = 0;
let respuestasCorrectasCapitulo = 0;
let totalPreguntas = 0;
let progreso = {};

function cargarCitas(nombreBloque) {
    fetch('datos/citas.json')
        .then(response => response.json())
        .then(data => {
            bloqueActual = nombreBloque;
            citas = data[bloqueActual];
            if (citas) {
                cargarProgreso(); // Cargar progreso guardado
                mostrarPregunta();
            }
        });
}

function mostrarPregunta() {
    if (indiceActual >= citas.length) {
        mostrarResultadoFinal();
        return;
    }

    const cita = citas[indiceActual];
    document.getElementById('cita').textContent = cita.cita;

    const opcionesLibro = [...cita.opciones_libro];
    const opcionesCapitulo = [...cita.opciones_capitulo];

    mostrarOpciones('libros', opcionesLibro, cita.libro, true);
    mostrarOpciones('capitulos', opcionesCapitulo, cita.capitulo, false);
}

function mostrarOpciones(idContenedor, opciones, correcta, esLibro) {
    const contenedor = document.getElementById(idContenedor);
    contenedor.innerHTML = '';
    opciones.forEach(opcion => {
        const btn = document.createElement('button');
        btn.textContent = opcion;
        btn.onclick = () => verificarRespuesta(opcion, correcta, esLibro, btn);
        contenedor.appendChild(btn);
    });
}

function verificarRespuesta(seleccionada, correcta, esLibro, boton) {
    const esCorrecta = seleccionada === correcta;
    boton.classList.add(esCorrecta ? 'correcta' : 'incorrecta');
    if (esCorrecta) {
        if (esLibro) {
            respuestasCorrectasLibro++;
        } else {
            respuestasCorrectasCapitulo++;
        }
    }

    setTimeout(() => {
        if (!esLibro) {
            indiceActual++;
            guardarProgreso();
            mostrarPregunta();
        }
    }, 500);
}

function mostrarResultadoFinal() {
    const porcentajeLibro = Math.round((respuestasCorrectasLibro / citas.length) * 100);
    const porcentajeCapitulo = Math.round((respuestasCorrectasCapitulo / citas.length) * 100);

    const mensaje = `¡Has terminado el bloque!\n\n
Aciertos en libros: ${porcentajeLibro}%\n
Aciertos en capítulos: ${porcentajeCapitulo}%\n\n
${mensajeSegunDesempeno((porcentajeLibro + porcentajeCapitulo) / 2)}`;

    alert(mensaje);
    limpiarProgreso();
}

function mensajeSegunDesempeno(porcentaje) {
    if (porcentaje === 100) return "¡Perfecto! Conoces muy bien las Escrituras.";
    if (porcentaje >= 80) return "¡Muy bien! Estás en el camino correcto.";
    if (porcentaje >= 60) return "¡Bien hecho! Puedes seguir mejorando.";
    return "Sigue practicando, ¡la Palabra de Dios te espera!";
}

function guardarProgreso() {
    progreso[bloqueActual] = {
        indice: indiceActual,
        correctasLibro: respuestasCorrectasLibro,
        correctasCapitulo: respuestasCorrectasCapitulo
    };
    localStorage.setItem('progresoCitas', JSON.stringify(progreso));
}

function cargarProgreso() {
    const guardado = JSON.parse(localStorage.getItem('progresoCitas'));
    if (guardado && guardado[bloqueActual]) {
        const datos = guardado[bloqueActual];
        if (confirm(`Tienes un progreso guardado en este bloque. ¿Deseas continuar desde la pregunta ${datos.indice + 1}?`)) {
            indiceActual = datos.indice;
            respuestasCorrectasLibro = datos.correctasLibro;
            respuestasCorrectasCapitulo = datos.correctasCapitulo;
            progreso = guardado;
        } else {
            limpiarProgreso(); // Si no desea continuar, limpiar
        }
    }
}

function limpiarProgreso() {
    const guardado = JSON.parse(localStorage.getItem('progresoCitas')) || {};
    delete guardado[bloqueActual];
    localStorage.setItem('progresoCitas', JSON.stringify(guardado));
}
