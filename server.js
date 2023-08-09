// Clase de 2023-08-02
// $ npm i express
const express = require('express');
const app = express();

app.use(express.json());

// app todo.html
app.use('/app', (req, res) => {
    res.sendFile(__dirname + '/todo.html')
});

// Styles
app.use('/styles', (req, res) => {
    res.sendFile(__dirname + '/todo.css')
});

app.use(function (err, req, res, next) { // middleware de error
  console.log(err);
  res.send('Algo salió mal');
});

app.listen(4000, function() {
  console.log('¡El servidor web está en servicio!');
});