import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Función para generar el resumen
const generarResumen = async (texto) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const options = {
    max_tokens: 50,
    temperature: 0.6,
    top_p: 1.0,
    n: 1,
    stop: ["\n"],
  };

  try {
    const result = await model.generateContent(texto, options);
    const response = await result.response;
    return response.text(); // Retorna el texto generado
  } catch (error) {
    console.error("Error al generar contenido:", error);
    throw new Error("No se pudo generar el resumen.");
  }
};

// Ruta para generar resúmenes
app.post("/Resumenes", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({ error: "El texto es obligatorio." });
    }

    const resumen = await generarResumen(texto);
    return res.status(200).json({ resumen });
  } catch (error) {
    console.error("Error en /Resumenes:", error.message);
    return res
      .status(500)
      .json({ error: "Error al generar el resumen. Intenta más tarde." });
  }
});

// Configuración del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
