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
  background_gray(false);

  if (checked === true && id !== 'new') {
    axios.put(url_todoapi, {
      done: 1,
    }).then(() => {
      listText.style.textDecoration = 'line-through'; // Se tacha el texto de la tarea
      listText.style.color = 'red';
      listText.contentEditable = false;
      listText.style.cursor = 'default';
      alert_sweet(`¡${listText.innerText}: OK!`,'success');
    }).catch(() => {
      event.target.checked = false;
    });

  } else if (id !== 'new') {
    axios.put(url_todoapi, {
      done: 0,
    }).then(() => {
      listText.style.textDecoration = 'none'; 
      listText.style.color = 'black';
      listText.contentEditable = true;
      listText.style.cursor = 'text';
      alert_sweet(`¡${listText.innerText}: Pendiente!`,'info');
    }).catch(() => {
      event.target.checked = true;
    });
  } else {
    event.target.checked = false;
  }
}


// Borrar tarea seleccionada
function onDeleteButton(event) {
  let id = event.target.parentNode.id; // Obtener id la tarea
  let url_delete = `http://localhost:3000/todos/${id}?user=1`;
  let tarea = event.target.parentNode.querySelector('.list__text').innerText; // Se obtiene el nombre de la tarea
  
  // Alert Delete
  Swal.fire({
    title: '¿Quieres borrar la tarea',
    text: `${tarea}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, borrar!'
  }).then((result) => {

    if (result.isConfirmed) {
      background_gray(false); // Quitar fondo gris
      if (id !== 'new') {
        axios.delete(url_delete).then( () => {   // Eliminar de BD
          event.target.parentNode.remove();      // Eliminar del DOM
        }).catch( () => {
          alert_sweet('No se puedo eliminar la tarea','error');
        });

      } else {
        event.target.parentNode.remove(); // Borra la tarea del DOM que no está en la BD
      }
      alert_sweet(`Tarea: ${tarea}, eliminada!`,'success',false, true);
    }

  })
}

// Detector de cambios en el nombre de las tareas
function onBlurText(event, texts) {
  let id = event.target.parentNode.id;
  let newText = event.target.innerText;

  if (texts.get(id) !== newText) {
    if (id === 'new') { // Si Nueva tarea está creada
      axios.post(`http://localhost:3000/todos/?user=1`, {
        description: newText,
      }).then(results => {
        texts.delete(id); // Borra el id new
        texts.set(results.data.id, results.data.description);
        background_gray(false);
        event.target.parentNode.id = results.data.id; // Cambia el id new por uno de DB
      });
      alert_sweet('Tarea ingresada con éxito!','success');

    } else {
      axios.put(`http://localhost:3000/todos/${id}?user=1`, {
        description: newText,
      })
      texts.delete(id);
      texts.set(id, newText);
      background_gray(false);
      alert_sweet('Tarea actualiada!','success');
   }
  }
}

// Colocar / Quitar:  fondo gris y focus
function background_gray(opc) {
  let task = document.querySelector('#new');
  if (opc) {
    task.style.boxShadow = '10px 1px 1px 9000px rgba(0,0,0,0.6)'; // Fondo gris
    task.getElementsByClassName("list__text")[0].focus(); // focus
  } else if (task !== null){
    task.style.boxShadow = ''; // Quitar fondo gris
  }
}

// Verificar si hay una Nueva Tarea Creada 
function newTaskCreated() {
  let task = document.querySelector('#new');
  if (task !== null)  return true;
  return false;
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

// SweetAlert2
function alert_sweet(text, type, time = 1600, boton = false) {
  Swal.fire({
    position: 'top-end',
    icon: type,
    title: text,
    showConfirmButton: boton,
    timer: time
  });
}


window.onload = () => {
  let texts = new Map();
  let url_TodoAPI = `http://localhost:3000/todos/?user=1`;
  let checkbox = document.querySelectorAll(".list__item > .item-checkbox");  // Selecciona todos los checkbox
  let deleteButtons = document.querySelectorAll(".list__item > .item-delete-button");  // Selecciona todos los botones de eliminar tarea
  let addTask = document.querySelector('.container__add-task');  // Agrega nueva tarea
  let list = document.querySelector(".list");  // Identificar elemento padre

  // Mostrar las tareas de la base de datos en el DOM
  axios.get(url_TodoAPI).then(respuesta => {
    respuesta.data.results.map( task => {
      let taskDOM = createTask(task.id, task.description, task.done); // Descripción de la tarea
      texts.set(`${task.id}`, task.description);
      list.appendChild(taskDOM); // Mostrar las tareas de la DB
    });
    let listTexts = document.querySelectorAll('.list__text');
    listTexts.forEach(listText => {
      listText.addEventListener('blur',(event) => onBlurText(event, texts));
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
      let defaultText = 'Nueva tarea';
      
      if (newTaskCreated() === false) {
        let newTask = createTask('new',defaultText,0);
        texts.set('new',defaultText);
        newTask.querySelector('.list__text').addEventListener('blur',(event) => onBlurText(event, texts));
        list.appendChild(newTask); // Crea nueva tarea
        background_gray(true);

      } else {
        // Callback
        setTimeout(function(){
          alert_sweet('Ya tienes una nueva tarea creada!','warning',2000);
        }, 500);
        setTimeout(background_gray(true),1000); // background_gray es la función myCallback
      }
    });
}
