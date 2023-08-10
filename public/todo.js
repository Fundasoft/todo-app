// Asignar atributos de otra manera: li.setAttribute("class", "list_item");
// Devuelve el atributo: let atributo = li.getAttribute("class");

// Tachar - Destachar
function onCheckboxClick(event) {
  // Valor del checked (false or true)
  let checked = event.target.checked;
  // Se accede al nodo padre y luego al nodo del texto
  let texto = event.target.parentNode.querySelector('.list__text');

  if (checked === true) {
    // Se tacha el texto de la tarea
    texto.style.textDecoration = 'line-through';
    texto.style.color = 'red';
  } else {
    texto.style.textDecoration = 'none';
    texto.style.color = 'black';
  }
}

// Borrar tarea seleccionada
function onDeleteButton(event) {
  // Se obtiene el nombre de la tarea
  let tarea = event.target.parentNode.querySelector('.list__text').innerText;
  let borrar = window.confirm("¿Está seguro de eliminar: "+tarea+"?");
  if (borrar) {
    event.target.parentNode.remove();
  }
}

// Crear nueva tarea
function createTask(text, done) {
  // Crear elementos
  let li = window.document.createElement("li");
  let checkbox = document.createElement("input");
  let div = document.createElement("div");
  let texto = document.createTextNode(text);
  let deleteButton = document.createElement("input");

  // Asignar propiedades
  li.className = "list__item";
  checkbox.type = "checkbox";
  checkbox.className = "item-checkbox";
  checkbox.addEventListener('click',onCheckboxClick);
  div.className = "list__text";
  div.contentEditable = true;
  deleteButton.className = "item-delete-button";
  deleteButton.type = "button";
  deleteButton.value = "🗑";
  deleteButton.addEventListener("click",onDeleteButton);

  // Marcar taras ya hechas
  if (done === 1){
    checkbox.checked = true;
    div.style.textDecoration = 'line-through'; // tachar texto
    div.style.color = 'red';
  }

  // Anidar elementos
  div.appendChild(texto);
  li.appendChild(checkbox);
  li.appendChild(div);
  li.appendChild(deleteButton);

  return li;
}


window.onload = () => {
  let url_TodoAPI = 'http://localhost:3000/todos/?user=1';
  let checkbox = document.querySelectorAll(".list__item > .item-checkbox");  // Selecciona todos los checkbox
  let deleteButtons = document.querySelectorAll(".list__item > .item-delete-button");  // Selecciona todos los botones de eliminar tarea
  let addTask = document.querySelector('.container__add-task');  // Agrega nueva tarea
  let list = document.querySelector(".list");  // Identificar elemento padre

  // Mostrar las tareas de la base de datos en el DOM
  axios.get(url_TodoAPI).then(respuesta => {
    respuesta.data.results.map( task => {
      let taskDOM = createTask(task.description, task.done); // Descripción de la tarea
      list.appendChild(taskDOM); // Mostrar las tareas de la DB
    })
  });
  

  // Clic en checkbox
  checkbox.forEach((checkbox) => {
    checkbox.addEventListener("click", onCheckboxClick); // Call func onCheckboxClick
  });

  // Clic en botón borrar
  deleteButtons.forEach((deleteButtons) => {
    deleteButtons.addEventListener("click", onDeleteButton); // Call func onDeleteButton
  });

  // Clic agregar tarea
  addTask.onclick = () => {
    list.appendChild(createTask("Tarea nueva")); // Crea nueva tarea
  }
};
