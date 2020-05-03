const giphy = new Giphy(24, 'WMgym4yAIPYofgGPrganKNA7n1vg2D5Y');

let theme_light = true;
theme_light ? document.documentElement.setAttribute('theme', 'day') : document.documentElement.setAttribute('theme', 'night');

// Traigo palabras sugeridas, API datamuse.
async function getSugerencias(value) {
    const consulta = await fetch(`http://api.datamuse.com/sug?max=3&s=${value}`);
    const dataSugerencias = await consulta.json();
    return dataSugerencias;
}
// FUNCIONES GENERALES //
async function insertarSugerencias2() {
    nodesImg = document.querySelectorAll('.gif-sugerencia .gif');
    nodesParrafos = document.querySelectorAll('.descripcion-gif');

    // Array que tendra mis gifs. Pido cuatro gifs randoms.
    let gifsRandom = await giphy.getFourRandomsGifs();

    // Arreglo con los titulos de mis gifs randoms.
    const arrayGifsHastag = await getTitlesOfGifs(gifsRandom, false);

    for (let contador = 0; contador < 4; contador++) {
        let urlChequeada = checkUrlGif(gifsRandom[contador].images);

        nodesImg[contador].setAttribute('src', urlChequeada);

        let createParrafo = document.createElement('p');
        createParrafo.innerHTML = checkGifTitle(arrayGifsHastag[contador]);
        createParrafo.setAttribute('class', 'estiloTituloGif');

        nodesParrafos[contador].prepend(createParrafo);
    }
}

// Inserto los trending en el html.
async function insertarTrending() {
    let tendenciasNodes = document.querySelector('.trending');
    let posicion = 'izquierda';
    let gifs = await giphy.getTrending();
    const gifsHastag = await getTitlesOfGifs(gifs, true);

    // Inserto los GIFS
    for (contador = 0, bandera = 1; contador < gifs.length; contador++) {
        let urlChequeada = checkUrlGif(gifs[contador].images);

        if (bandera == 5 && posicion == 'izquierda') {
            bandera = 1;
            posicion = 'derecha';
            const nuevoNodo = createGridItem(urlChequeada, gifsHastag[contador], 'izquierda');
            tendenciasNodes.appendChild(nuevoNodo);
        } else if (bandera == 5 && posicion == 'derecha') {
            bandera = 1;
            posicion = 'izquierda';
            const nuevoNodo = createGridItem(urlChequeada, gifsHastag[contador], 'derecha');
            tendenciasNodes.appendChild(nuevoNodo);
        } else {
            const nuevoNodo = createGridItem(urlChequeada, gifsHastag[contador]);
            tendenciasNodes.appendChild(nuevoNodo);
            bandera++;
        }
    }
}
// Inserto lo que se busco con el input en el html.
async function insertarBusqueda(busqueda) {
    let busquedaVieja = document.querySelector('.resultado-busqueda');
    let nuevaBusqueda = document.createElement('div');
    nuevaBusqueda.setAttribute('class', 'grid resultado-busqueda');

    let resultadoGifs = await giphy.buscarApi(busqueda);
    const gifsHastag = await getTitlesOfGifs(resultadoGifs, true);

    // Inserto los GIFS
    let posicion = 'izquierda';
    for (contador = 0, bandera = 1; contador < resultadoGifs.length; contador++) {
        let urlChequeada = checkUrlGif(resultadoGifs[contador].images);

        if (bandera == 5 && posicion == 'izquierda') {
            bandera = 1;
            posicion = 'derecha';
            const nuevoNodo = createGridItem(urlChequeada, gifsHastag[contador], 'izquierda');
            nuevaBusqueda.appendChild(nuevoNodo);
        } else if (bandera == 5 && posicion == 'derecha') {
            bandera = 1;
            posicion = 'izquierda';
            const nuevoNodo = createGridItem(urlChequeada, gifsHastag[contador], 'derecha');
            nuevaBusqueda.appendChild(nuevoNodo);
        } else {
            const nuevoNodo = createGridItem(urlChequeada, gifsHastag[contador]);
            nuevaBusqueda.appendChild(nuevoNodo);
            bandera++;
        }
    }

    // Hago esto para que siempre el nodo viejo 
    // que contiene las busquedas se reemplace
    // por el nodo nuevo que estoy creando.
    busquedaVieja.parentElement.replaceChild(nuevaBusqueda, busquedaVieja);

    showHideSearches(true);
}
// Recibe un arreglo de gifs y devuelve los titulos de todos esos gifs.
async function getTitlesOfGifs(arrayGifs, cortarTitulo) {
    let gifHastag = [];

    if (cortarTitulo == true) {
        // Corto el titulo por partes y le inserto a cada parte un hastag.
        for (contador = 0; contador < arrayGifs.length; contador++) {
            gifHastag[contador] = ` #${arrayGifs[contador].title.replace(/ /g, " #")}`;
            let deleteIndex = gifHastag[contador].indexOf('#GIF');
            gifHastag[contador] = gifHastag[contador].slice(0, deleteIndex);
        }

    } else {
        // No corto el titulo por partes y solo le agrego el hastag adelante.
        for (contador = 0; contador < arrayGifs.length; contador++) {
            gifHastag[contador] = ` #${arrayGifs[contador].title}`;
            let deleteIndex = gifHastag[contador].indexOf('GIF');
            gifHastag[contador] = gifHastag[contador].slice(0, deleteIndex);
        }

    }

    return gifHastag;
}
// Se ejecuta cada vez que cambia el valor del input.
function getInputChanges() {
    changeButtonSearchTheme();
    insertarSugerencias();
}
// Setea toda la estructura grid de gifs. 
function createGridItem(imgSrc, hastagsText, posicionInsertar) {

    let divContenedor = document.createElement('div');

    let imgTag = document.createElement('img');
    imgTag.setAttribute('src', imgSrc);

    let divHastag = document.createElement('div');
    divHastag.setAttribute('class', 'contenedor-gif relative');

    let parrafoTag = document.createElement('p');
    parrafoTag.innerHTML = checkGifTitle(hastagsText);
    parrafoTag.setAttribute('class', 'fondo-degradado estiloTituloGif absolute hastags');

    if (posicionInsertar == undefined) {
        divContenedor.setAttribute('class', 'grid-item gif-tendencia');
        imgTag.setAttribute('class', 'gif');

    } else if (posicionInsertar.toLocaleLowerCase() == 'derecha') {
        divContenedor.setAttribute('class', 'grid-item gif-tendencia expand-derecha');
        imgTag.setAttribute('class', 'gif gif-expand');

    } else if (posicionInsertar.toLocaleLowerCase() == 'izquierda') {
        divContenedor.setAttribute('class', 'grid-item gif-tendencia expand-izquierda');
        imgTag.setAttribute('class', 'gif gif-expand');

    } else {
        console.log('Estas pasando cualquier cosa amigo.');
    }

    divHastag.appendChild(imgTag);
    divContenedor.appendChild(divHastag);
    divHastag.appendChild(parrafoTag);

    return divContenedor;
}
// Chequea si el titulo del gif es valido y sino agrega uno por default.
function checkGifTitle(titleGif) {
    if (titleGif == ' ' || titleGif == ' #' || titleGif == undefined) {
        return "This Gif doesn't have a title";
    } else {
        return titleGif;
    }
}
// Chequea si la URL del gif es valida, sino inserta un gif por default.
function checkUrlGif(arrayGifImages) {
    for (let key in arrayGifImages) {
        let value = arrayGifImages[key];
        if (value.url) {
            // Encontre una url valida en el gif y la devuelvo.
            return value.url;
        }
    }

    // Si llegue aca, significa que no habia ninguna url valida.
    // Devuelvo un gif predeterminado para cuando esto sucede.
    return 'https://media.giphy.com/media/xTiN0L7EW5trfOvEk0/giphy.gif';

}
// Chequea si existe un theme en el storage, y si existe lo carga.
async function checkStorageTheme() {
    const storageTheme = await localStorage.getItem('theme');
    let logoGifNode = document.querySelector('.logo-gif');

    if (storageTheme == 'day') {
        document.documentElement.setAttribute('theme', 'day');
        logoGifNode.setAttribute('src', '/assets/img/gifOF_logo_day.png');
        changeButtonSearchTheme();
    } else if (storageTheme == 'night') {
        document.documentElement.setAttribute('theme', 'night');
        logoGifNode.setAttribute('src', '/assets/img/gifOF_logo_night.png');
        changeButtonSearchTheme();
    } else {
        document.documentElement.setAttribute('theme', 'day');
        logoGifNode.setAttribute('src', '/assets/img/gifOF_logo_day.png');
        changeButtonSearchTheme();
    }
}
// Oculto o muestro el contenedor que contiene las busquedas.
function showHideSearches(mostrar) {
    let contenedorBusquedaNode = document.querySelector('.contenedor-busquedas');

    if (mostrar) {
        contenedorBusquedaNode.classList.replace('ocultar', 'mostrar');
    } else {
        contenedorBusquedaNode.classList.replace('mostrar', 'ocultar');
    }
}
// Cambio el color del boton de buscar.
function changeButtonSearchTheme() {
    let value = document.getElementById('input_buscar').value;
    const buttonObjTheme = getButtonObjTheme();

    if (value != "") {
        changeSearchButtonColor(buttonObjTheme.colorTextValue,
            buttonObjTheme.backgroundColorValue,
            buttonObjTheme.lupaValue);
    } else {
        changeSearchButtonColor(buttonObjTheme.colorTextInactive,
            buttonObjTheme.backgroundColorInactive,
            buttonObjTheme.lupaInactive);
    }
}
// Me devuelve un objeto con los estilo que tiene que tener el boton segun el theme.
function getButtonObjTheme() {
    const themeActive = document.documentElement.getAttribute('theme');

    var styles = getComputedStyle(document.documentElement);
    const backgroundColorValue = styles.getPropertyValue('--color-button-buscar-con-valor');
    const colorTextValue = styles.getPropertyValue('--color-text-button-buscar-con-valor');

    const backgroundColorInactive = styles.getPropertyValue('--color-button-buscar-sin-valor');
    const colorTextInactive = styles.getPropertyValue('--color-text-button-buscar-sin-valor');

    if (themeActive === 'day') {
        return {
            backgroundColorValue,
            colorTextValue,
            backgroundColorInactive,
            colorTextInactive,
            lupaInactive: '/assets/img/lupa_inactive_ligth.svg',
            lupaValue: '/assets/img/lupa_value_ligth.svg'
        };
    } else {
        return {
            backgroundColorValue,
            colorTextValue,
            backgroundColorInactive,
            colorTextInactive,
            lupaInactive: '/assets/img/lupa_inactive_nigth.svg',
            lupaValue: '/assets/img/lupa_value_nigth.svg'
        };
    }

}
// Seteo el boton buscar segun los valores que recibo.
function changeSearchButtonColor(colorText, backgroundColor, pathLupaIcon) {
    const boton = document.getElementById('boton-buscar');
    const lupaIcon = document.querySelector('.icono-lupa');

    boton.style.backgroundColor = backgroundColor;
    boton.style.color = colorText;
    lupaIcon.setAttribute('src', pathLupaIcon);
}
// Inserto sugerencias segun lo que se escribe en el input y me devuelve la API.
async function insertarSugerencias() {
    let value = document.getElementById('input_buscar').value;
    const buttonsNodes = document.querySelectorAll('button.button-sugerencia');
    const divSugerencias = document.querySelector('div.sugerencias-busqueda');

    if (value.length > 3) {
        // Consulto por sugerencias
        const sugerencias = await getSugerencias(value);
        // Muestro el div que contiene los botones
        divSugerencias.classList.replace('ocultar', 'mostar');

        for (contador = 0; contador < sugerencias.length; contador++) {
            // A cada boton le inserto el texto que recibo como sugerencia.
            // Al boton que le estoy insertando le agrego la clase mostrar.
            // Asi evito que se muestren botones vacios.
            buttonsNodes[contador].classList.replace('ocultar', 'mostrar');
            buttonsNodes[contador].innerHTML = sugerencias[contador].word;
        }
    } else {
        // Oculto todos los botones de sugerencia y el div que los contiene.
        hideContenedorSugerencias();
    }
}
// Oculta los botones de sugerencia y el div que los contiene.
function hideContenedorSugerencias() {
    const buttonsNodes = document.querySelectorAll('button.button-sugerencia');
    const divSugerencias = document.querySelector('div.sugerencias-busqueda');

    for (contador = 0; contador < buttonsNodes.length; contador++) {
        divSugerencias.setAttribute('class', 'sugerencias-busqueda ocultar');
        buttonsNodes[contador].classList.replace('mostrar', 'ocultar');
    }
}

function infinitiScroll() {
    window.onscroll = function(ev) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            insertarTrending();
        }
    };
}

infinitiScroll();
checkStorageTheme();
insertarTrending();
insertarSugerencias2();
getInputChanges();