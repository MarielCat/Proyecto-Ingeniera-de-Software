const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend/public')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Servidor backend escuchando en http://localhost:' + PORT);
});
