// js/componentes/ampliar-img.js

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".imagen-ampliable").forEach(img => {
    img.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.background = "rgba(0,0,0,0.8)";
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.zIndex = "1000";

      const imgClon = document.createElement("img");
      imgClon.src = img.src;
      imgClon.style.maxWidth = "90%";
      imgClon.style.maxHeight = "90%";
      imgClon.style.boxShadow = "0 0 20px #fff";
      imgClon.style.borderRadius = "12px";

      overlay.appendChild(imgClon);
      overlay.addEventListener("click", () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });
});
 
