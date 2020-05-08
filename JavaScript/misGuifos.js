let theme_light = true;
theme_light ? document.documentElement.setAttribute('theme', 'day') : document.documentElement.setAttribute('theme', 'night');

let giphy = new Giphy(24, 'WMgym4yAIPYofgGPrganKNA7n1vg2D5Y');
checkStorageTheme();

checkStorageMisGifos();
insertarMisGuifos();

async function insertarMisGuifos() {
    let misGuifosNode = document.querySelector('.misGuifos');
    let posicion = 'izquierda';
    let misGuifos = await giphy.getMisGifsById();

    // Inserto los GIFS
    for (contador = 0, bandera = 1; contador < misGuifos.length; contador++) {
        let urlChequeada = checkUrlGif(misGuifos[contador].images);

        if (bandera == 5 && posicion == 'izquierda') {
            bandera = 1;
            posicion = 'derecha';
            const nuevoNodo = createGridItem(urlChequeada, 'izquierda');
            misGuifosNode.appendChild(nuevoNodo);
        } else if (bandera == 5 && posicion == 'derecha') {
            bandera = 1;
            posicion = 'izquierda';
            const nuevoNodo = createGridItem(urlChequeada, 'derecha');
            misGuifosNode.appendChild(nuevoNodo);
        } else {
            const nuevoNodo = createGridItem(urlChequeada);
            misGuifosNode.appendChild(nuevoNodo);
            bandera++;
        }
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
    console.log('Ninguna URL valida');
    return 'https://media.giphy.com/media/xTiN0L7EW5trfOvEk0/giphy.gif';

}

function createGridItem(imgSrc, posicionInsertar) {

    let divContenedor = document.createElement('div');

    let imgTag = document.createElement('img');
    imgTag.setAttribute('src', imgSrc);

    let divHastag = document.createElement('div');
    divHastag.setAttribute('class', 'contenedor-gif relative');

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

    return divContenedor;
}

function checkStorageTheme() {

    const theme = localStorage.getItem('theme');
    let logoGifNode = document.querySelector('.logo-gif');

    if (theme == 'day') {
        document.documentElement.setAttribute('theme', 'day');
        logoGifNode.setAttribute('src', '/assets/img/gifOF_logo_day.png');
    } else if (theme == 'night') {
        document.documentElement.setAttribute('theme', 'night');
        logoGifNode.setAttribute('src', '/assets/img/gifOF_logo_night.png');
    } else {
        document.documentElement.setAttribute('theme', 'day');
    }
}

function checkStorageMisGifos() {
    const misGuifosStorage = localStorage.getItem('misIdGuifos');

    if (misGuifosStorage) {
        giphy.setMisIdGuifos(JSON.parse(misGuifosStorage));
    } else {
        console.log('No habia gifs en el storage para cargar');
    }
}