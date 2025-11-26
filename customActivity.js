const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Soporte CORS básico
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// ENDPOINT: sirve el archivo de configuración en /
app.get('/', (req, res) => {
  // Lee y envía el JSON de configuración para la custom activity
  const configPath = path.join(__dirname, 'public-activity-meta.json');
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    res.json(config);
  } catch (e) {
    res.status(500).json({ error: "Cannot load configuration file." });
  }
});

// Endpoints requeridos por SFMC

app.post('/save', (req, res) => {
  // Guarda los settings de configuración
  res.json({ success: true });
});

app.post('/publish', (req, res) => {
  // Publica la actividad
  res.json({ success: true });
});

app.post('/validate', (req, res) => {
  // Puedes validar parámetros aquí
  res.json({ success: true });
});

// AQUÍ OCURRE LA MAGIA: consultar API precios externa
app.post('/execute', async (req, res) => {
  try {
    // Puedes obtener el ID de producto desde los 'inArguments'
    const inArgs = req.body.arguments?.execute?.inArguments;
    let productoId = null;
    if (inArgs && inArgs[0] && inArgs[0].productoId) productoId = inArgs[0].productoId;

    let url = 'https://api-de-precios2.onrender.com/products';
    if (productoId) url += `/${productoId}`; // Si quieres consultar solo uno

    const response = await axios.get(url);
    const precios = response.data;

    res.json({
      "arguments": {
        "execute": {
          "inArguments": inArgs,
          "outArguments": [
            { precios }
          ]
        }
      },
      "outcome": "branchResult"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Describir tus datos de salida (opcional pero recomendado)
app.post('/schema', (req, res) => {
  res.json({
    "inArguments": [
      { "productoId": { "type": "Text", "required": false } }
    ],
    "outArguments": [
      { "precios": { "type": "Text", "required": true } }
    ],
    "outSchema": {
      "precios": { "type": "array" }
    }
  });
});

const fs = require('fs');
const path = require('path');


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Custom Activity API en puerto ${PORT}`));
