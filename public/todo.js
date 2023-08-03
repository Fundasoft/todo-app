function onCheckboxClick(event) {
    var checked = event.target.checked;
    if (checked === true) {
        event.target.parentNode.querySelector('.list__text')
            .style.textDecoration = 'line-through';
    } else {
        event.target.parentNode.querySelector('.list__text')
            .style.textDecoration = 'none';
    }
}

function onDeleteButton(event) {
    var text = event.target.parentNode.querySelector('.list__text').innerText;
    var confirmed = window.confirm(`¿Estás seguro que deseas eliminar ${text}?`);
    if (confirmed) {
        event.target.parentNode.remove();
    }
}

function onBlurText(event, texts) {
    if(texts[event.target.parentNode.id] === event.target.innerText) {
        console.log('No hay cambios');
    } else {
        console.log('Hay cambios');
        texts[event.target.parentNode.id] = event.target.innerText;
    }
}

function createTask(text) {
    var li = document.createElement('li');
    var checkbox = document.createElement('input');
    var div = document.createElement('div');
    var texto = document.createTextNode(text);
    var deleteButton = document.createElement('input');

    li.className = 'list__item';
    checkbox.type = 'checkbox';
    checkbox.className = 'item-checkbox';
    checkbox.addEventListener('click', onCheckboxClick);
    deleteButton.type = 'button';
    deleteButton.value = '🗑️';
    deleteButton.className = 'item-delete-button';
    deleteButton.addEventListener('click', onDeleteButton);
    div.className = 'list__text';

    div.appendChild(texto);
    li.appendChild(checkbox);
    li.appendChild(div);
    li.appendChild(deleteButton);

    return li;
}

window.onload = () => {
    var checkboxs = document.querySelectorAll('.list__item > .item-checkbox');
    var deleteButtons = document.querySelectorAll('.list__item > .item-delete-button');
    var addTask = document.querySelector('.container__add-task > .add-task');
    var list = document.querySelector('.list');
    var listTexts = document.querySelectorAll('.list__text');

    console.log(axios.get('http://localhost:3000/todos?user=1').then(respuesta => console.log(respuesta.data.results)));
    
    checkboxs.forEach(checkbox => {
        checkbox.addEventListener('click', onCheckboxClick);
    });

    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener('click', onDeleteButton);
    })

    addTask.addEventListener('click', () => {
        list.appendChild(createTask('Nueva tarea'));
    });

    var texts = [];

    listTexts.forEach(listText => {
        texts.push(listText.innerText);
        listText.addEventListener('blur', (event) => onBlurText(event, texts));
    });
}
