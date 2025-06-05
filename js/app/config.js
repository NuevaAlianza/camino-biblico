
// config.js
console.log("Página de configuración cargada.");

<script>
  document.getElementById("actualizarApp").addEventListener("click", async () => {
    const estado = document.getElementById("estadoActualizacion");
    estado.textContent = "🔍 Buscando nueva versión...";

    if ('serviceWorker' in navigator) {
      const registro = await navigator.serviceWorker.getRegistration();
      if (registro) {
        await registro.update();
        estado.textContent = "✅ Se verificó una nueva versión. Reinicia la app si fue actualizada.";
      } else {
        estado.textContent = "⚠️ No se encontró un Service Worker.";
      }
    } else {
      estado.textContent = "❌ Tu navegador no soporta Service Workers.";
    }
  });
</script>
