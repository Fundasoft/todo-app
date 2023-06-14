function createTask(text) {
    var li = document.createElement('li');
    var input = document.createElement('input');
    var div = document.createElement('div');
    var texto = document.createTextNode(text);

    li.className = 'list__item';
    input.type = 'checkbox';
    div.className = 'list__text';

    div.appendChild(texto);
    li.appendChild(input);
    li.appendChild(div);

    return li;
}
