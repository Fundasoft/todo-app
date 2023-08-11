// Asignar atributos de otra manera: li.setAttribute("class", "list_item");
// Devuelve el atributo: let atributo = li.getAttribute("class");


// Tachar - Destachar
function onCheckboxClick(event) {
  let id = event.target.parentNode.id; // Obtener id de cada tarea

  // Valor del checked (false or true)
  let checked = event.target.checked;
  // Se accede al nodo padre y luego al nodo del texto
  let listText = event.target.parentNode.querySelector('.list__text');
  let url_todoapi = `http://localhost:3000/todos/${id}?user=1`;

  if (checked === true) {
    axios.put(url_todoapi, {
      done: 1,
    }).then(() => {
      listText.style.textDecoration = 'line-through'; // Se tacha el texto de la tarea
      listText.style.color = 'red';
      listText.contentEditable = false;
      listText.style.cursor = 'default';
    }).catch(() => {
      event.target.checked = false;
    });

  } else {
    axios.put(url_todoapi, {
      done: 0,
    }).then(() => {
      listText.style.textDecoration = 'none'; 
      listText.style.color = 'black';
      listText.contentEditable = true;
      listText.style.cursor = 'text';
    }).catch(() => {
      event.target.checked = true;
    });
  }
}


// Borrar tarea seleccionada
function onDeleteButton(event) {
  let id = event.target.parentNode.id; // Obtener id la tarea
  let url_delete = `http://localhost:3000/todos/${id}?user=1`;
  let tarea = event.target.parentNode.querySelector('.list__text').innerText; // Se obtiene el nombre de la tarea

  let borrar = window.confirm(`¿Está seguro de eliminar: ${tarea}?`);
  if (borrar) {
    let newTaskDOM = document.querySelector('#new');
    if (newTaskDOM === null) {
      axios.delete(url_delete).then( () => {   // Eliminar de BD
        event.target.parentNode.remove();      // Eliminar del DOM
        console.log(`Tarea: ${tarea}, ELIMINADA!!!`);
      }).catch( () => {
        alert(`No se pudo eliminar la tarea`);
      });
    } else {
      // Borra la tarea del DOM que no está en la BD
      event.target.parentNode.remove();      // Eliminar del DOM
    }
  }
}

// Crear nueva tarea
function createTask(id, text, done) {
  // Crear elementos
  let li = window.document.createElement("li");
  li.id = id;
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
    div.contentEditable = false;
    div.style.cursor = 'default';
  }

  // Anidar elementos
  div.appendChild(texto);
  li.appendChild(checkbox);
  li.appendChild(div);
  li.appendChild(deleteButton);

  return li;
}


window.onload = () => {
  let url_TodoAPI = `http://localhost:3000/todos/?user=1`;
  let checkbox = document.querySelectorAll(".list__item > .item-checkbox");  // Selecciona todos los checkbox
  let deleteButtons = document.querySelectorAll(".list__item > .item-delete-button");  // Selecciona todos los botones de eliminar tarea
  let addTask = document.querySelector('.container__add-task');  // Agrega nueva tarea
  let list = document.querySelector(".list");  // Identificar elemento padre

  // Mostrar las tareas de la base de datos en el DOM
  axios.get(url_TodoAPI).then(respuesta => {
    respuesta.data.results.map( task => {
      let taskDOM = createTask(task.id, task.description, task.done); // Descripción de la tarea
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
  // addTask.onclick = () => {
    addTask.addEventListener('click', () => {
      let task = document.querySelector('#new');
      if (task === null) {
        list.appendChild(createTask('new','Tarea nueva',0)); // Crea nueva tarea

      } else {
        ok = window.alert('Ya hay una tarea vacía creada');
        if (ok === undefined) {
          // task.style.backgroundColor = 'rgb(255,0,0)';
          // task.style.color = 'yellow';
          task.style.boxShadow = '1px 1px 1px 9000px rgba(0,0,0,0.6)';
        }
      }
    });
}
