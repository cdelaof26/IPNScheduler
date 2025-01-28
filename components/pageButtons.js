document.addEventListener('DOMContentLoaded', function() {
    let root_script = document.querySelector('script#pageButtons');

    let div = document.createElement('div');

    let button = document.createElement('button');
    button.textContent = 'Hello';
    div.appendChild(button);
    root_script.replaceWith(div);
    div.id = 'pageButtons'
})