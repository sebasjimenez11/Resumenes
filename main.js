document.addEventListener("DOMContentLoaded", () => {
  const textArea = document.getElementById("resumen");
  const btnSubmit = document.querySelector("button");
  const resumenContainer = document.querySelector(".resumen p");
  const loader = document.querySelector(".loader");

  // Evento al hacer clic en el botón
  btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    await handleResumen();
  });

  // Evento para detectar Enter en el textarea
  textArea.addEventListener("keypress", async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleResumen();
    }
  });

  async function handleResumen() {
    const texto = textArea.value.trim();
    if (!texto) {
      alert("Debes escribir algo para generar un resumen.");
      return;
    }

    // Mostrar el loader mientras se genera el resumen
    loader.style.display = "block";
    resumenContainer.textContent = "";

    try {
      const resumen = await generarResumen(texto);
      resumenContainer.textContent = resumen;
      textArea.value = ""; // Limpia el textarea después de generar el resumen
    } catch (error) {
      console.error("Error al generar el resumen:", error);
      alert("Hubo un error al generar el resumen. Intenta de nuevo.");
    } finally {
      // Ocultar el loader
      loader.style.display = "none";
    }
  }

  async function generarResumen(texto) {
    // Prompt ajustado para IA
    const prompt =
      "Genera un resumen claro, conciso y relevante para el siguiente texto. Asegúrate de mantener la profundidad y el significado del contenido original:";
    const response = await fetch("http://localhost:3000/Resumenes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ texto: `${prompt} ${texto}` }),
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud al servidor.");
    }

    const data = await response.json();
    return data.resumen; // Retorna el resumen del servidor
  }
});
