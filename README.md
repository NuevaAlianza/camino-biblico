# Camino Bíblico

Esta es una aplicación web progresiva (PWA) que unifica múltiples experiencias de interacción con la Biblia, diseñada para funcionar tanto en línea como fuera de línea.

## Modalidades disponibles

- 🧘 **Reflexión por temas**: Contenido bíblico para meditar por temáticas.
- 🧠 **Quiz comentado**: Preguntas con retroalimentación basada en la Biblia.
- 📖 **Citas bíblicas**: Identifica libro y capítulo de pasajes bíblicos. Versión básica y avanzada.
- 📊 **Revisión de progreso**: Visualiza el avance del usuario.
- ⚙️ **Configuración / Acerca de**: Ajustes generales y créditos.

## Estructura del proyecto

```
/
├── index.html
├── manifest.json
├── sw.js
├── css/
│   └── estilos.css
├── js/
│   └── app.js
├── datos/
│   ├── datos.json
│   └── citas.json
├── assets/
│   ├── sonidos/
│   └── img/
├── reflexion.html
├── quiz-comentado.html
├── citas.html
├── progreso.html
└── config.html
```

## Cómo usar

1. Clona o descarga este repositorio.
2. Carga los archivos en un servidor o en GitHub Pages.
3. Asegúrate de que `https` esté habilitado para permitir el funcionamiento del Service Worker.
4. Puedes instalarla como app desde el navegador.

## Próximas mejoras

- Animaciones suaves y diseño responsive.
- Sonidos de interacción.
- Registro de progreso local.
- Carga dinámica de contenido desde archivos JSON.
- Estadísticas personalizadas por bloque.

---

Desarrollado con ❤️ para fortalecer el estudio y reflexión bíblica.
