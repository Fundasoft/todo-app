// Clase de 2023-08-02
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// app todo.html
app.use('/app', (req, res) => {
    res.sendFile(__dirname + '/public/todo.html')
});


app.use(function (err, req, res, next) { // middleware de error
  console.log(err);
  res.send('Algo salió mal');
});

app.listen(3001, function() {
  console.log('¡El servidor web está en servicio!');
});