eventListenerButtonBuscar();
eventListenerChangeTheme();
eventListenerButtonsSugerencias();
eventListenerButtonsVerMas();

// EVENTLISTENERS
// Listener para los botones de sugerencia.
function eventListenerButtonsSugerencias() {
    const buttonsSugerencias = document.querySelectorAll('button.button-sugerencia');
    const input = document.getElementById('input_buscar');

    buttonsSugerencias.forEach(button => {
        button.addEventListener('click', () => {
            // Oculto todos los botones de sugerencia y el div que los contiene.
            hideContenedorSugerencias();
            // Inserto el texto en el input y hago una busqueda con el texto.
            input.value = button.innerHTML;
            insertarBusqueda(button.innerHTML);
        });
    });
}

// Listener para los botones 'Elegir Tema', 'day' y 'nigth.
function eventListenerChangeTheme() {
    let logoGifNode = document.querySelector('.logo-gif');
    var elegirTemaNode = document.querySelector('.ventana-temas');
    const boton = document.getElementById('mostrar-temas');

    boton.addEventListener('click', () => {
        elegirTemaNode.classList.toggle('ocultar');
    });

    const botonDay = document.getElementById('changeToDay');
    botonDay.addEventListener('click', () => {
        document.documentElement.setAttribute('theme', 'day');
        logoGifNode.setAttribute('src', './assets/img/gifOF_logo_day.png');
        localStorage.setItem('theme', 'day');
        changeButtonSearchTheme();
        elegirTemaNode.classList.toggle('ocultar');
    });

    const botonNight = document.getElementById('changeToNight');
    botonNight.addEventListener('click', () => {
        document.documentElement.setAttribute('theme', 'night');
        logoGifNode.setAttribute('src', './assets/img/gifOF_logo_night.png');
        localStorage.setItem('theme', 'night');
        changeButtonSearchTheme();
        elegirTemaNode.classList.toggle('ocultar');
    });
}

// Listener para cuando se clickea el boton de buscar.
function eventListenerButtonBuscar() {
    const boton = document.getElementById('boton-buscar');
    let valueInput = null;

    boton.addEventListener('click', async() => {
        // Get value del input.
        valueInput = document.getElementById('input_buscar').value;

        // Prevengo de que se realicen consultas vacias.
        if (valueInput && valueInput.length > 0) {
            insertarBusqueda(valueInput);

        }
    });
}

// Listener para los botones de Ver Mas.
function eventListenerButtonsVerMas() {
    const buttonsVerMas = document.querySelectorAll('button.ver-mas');
    // Agrego listener a cada uno de los botones 'Ver mas...'
    buttonsVerMas.forEach(button => {
        button.addEventListener('click', () => {
            // Del contenedor en el que se encuentra el boton tomo la etiqueta p con su texto.
            let valueToSearch = button.parentElement.querySelector('p').innerHTML;
            // Quito el # que tengo al principio del titulo.
            valueToSearch = valueToSearch.split('#').join('');
            // Realizo la busqueda.
            insertarBusqueda(valueToSearch);
            // Llevo el scroll hacia arriba.
            window.scrollTo(0, 0);
        });
    });
}