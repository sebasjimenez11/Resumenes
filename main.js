import dotenv from 'dotenv';
import {GoogleGenerativeAI}  from '@google/generative-ai';

dotenv.config();

document.addEventListener('submit', (event)=> generarResumen(event));

function generarResumen (event) {
    console.log(event);
}

// Accede a tu API key como una variable de entorno
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {
  // Usamos el modelo "gemini-1.5-flash"
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Definir el prompt y los parámetros de ajuste
  const prompt = "Escribe una historia breve sobre una mochila mágica en un tono amigable y entretenido. de forma breve en la que no se extienda";

  // Configurar parámetros como temperatura, longitud y estilo
  const options = {
    max_tokens: 50,        // Limitar la longitud de la respuesta
    temperature: 0.6,       // Ajustar la creatividad de la respuesta
    top_p: 1.0,             // Diversidad de respuestas
    n: 1,                   // Número de respuestas generadas
    stop: ["\n"],           // Finalizar la respuesta con un salto de línea (si es necesario)
  };

  try {
    // Generar la respuesta utilizando el modelo con las opciones definidas
    const result = await model.generateContent(prompt, options);
    
    // Acceder a la respuesta generada
    const response = await result.response;
    const text = response.text(); // Obtener el texto de la respuesta
    
    // Mostrar la respuesta generada en la consola
    console.log(text);
  } catch (error) {
    console.error('Error al generar contenido:', error);
  }
}

// run();
