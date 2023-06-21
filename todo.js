// let li = document.createElement("li");

// // Asignar atributos de otra manera
// li.setAttribute("class", "list_item");

// // Devuelve el atributo
// let atributo = li.getAttribute("class");

// console.log(li);
// console.log("Atributo: ", atributo);

function createTask(text) {
  // Identificar elemento padre
  let ul = document.querySelector("ul");

  // Crear elementos
  let li = window.document.createElement("li");
  let input = document.createElement("input");
  let div = document.createElement("div");
  let texto = document.createTextNode(text);

  // Anidar elementos
  li.appendChild(input);
  li.appendChild(div);
  div.appendChild(texto);
  ul.appendChild(li);

  // Asignar propiedades
  li.className = "list__item";
  input.type = "checkbox";
  div.className = "list__text";

  return li;
}

// Crear nuevas tareas
createTask("Tarea 5");
createTask("Tarea 6");

// Seleccionar todos los elementos dentro de li
let elements = document.getElementsByClassName("list__item");

for (let i = 0; i < elements.length; i++) {
  let item = elements[i];
  // Números aleatorio: 1 or 0
  let num = Math.round(Math.random());

  if (num == 1) {
    item.style.color = "red";
  } else {
    item.style.color = "black";
  }
  console.log(num);
}
