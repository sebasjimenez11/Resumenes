import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import {GoogleGenerativeAI}  from '@google/generative-ai';


dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Permitir solicitudes desde el frontend

// Instanciar la API con tu clave
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function generarResumen(texto) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
    const text = response.text();
    return text; // Retornar el resumen generado
  } catch (error) {
    console.error('Error al generar contenido:', error);
    throw error;
  }
}

// Ruta para generar resúmenes
app.post('/Resumenes', async (req, res) => {
  try {
    const { texto } = req.body; // Obtener el texto del cuerpo de la solicitud
    if (!texto) {
      return res.status(400).json({ error: 'El texto es obligatorio.' });
    }

    const resumen = await generarResumen(texto);
    return res.json({ resumen }); // Enviar el resumen al cliente
  } catch (error) {
    return res.status(500).json({ error: 'Error al generar el resumen.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
