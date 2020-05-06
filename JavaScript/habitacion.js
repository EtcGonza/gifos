let theme_light = true;
theme_light ? document.documentElement.setAttribute('theme', 'day') : document.documentElement.setAttribute('theme', 'night');

//
let giphy = new Giphy(24, 'WMgym4yAIPYofgGPrganKNA7n1vg2D5Y');
let RTCRecorder = new RtcRecorder();
getMedia();
eventListenerButtons();
mostrarControl(0);

checkStorageMisGifos();

async function getMedia() {
    const ventanasDeGrabacion = document.getElementById('videoFrame');
    RTCRecorder.getMedia(ventanasDeGrabacion);
}

function eventListenerButtons() {
    const buttonCapturar = document.getElementById('buttonCapturar');
    const buttonComenzar = document.getElementById('buttonComenzar');
    const buttonListo = document.getElementById('buttonListo');
    const buttonRepetir = document.getElementById('buttonRepetir');
    const buttonSubir = document.getElementById('buttonSubir');
    const videoNode = document.getElementById('videoFrame');
    const previsualizarGifNode = document.getElementById('previsualizarGif');

    buttonComenzar.addEventListener('click', () => {
        document.getElementById('ventanaTemplate').classList.replace('ocultar', 'mostrar');
        document.getElementById('ventanaInstrucciones').classList.add('ocultar');
    });

    buttonCapturar.addEventListener('click', async() => {
        console.log('COMENCE A GRABAR POR PRIMERA VEZ');
        if (RTCRecorder.getRecorderState() === "inactive") {
            RTCRecorder.comenzarGrabacion();
            mostrarControl(1);
        }
    });

    buttonListo.addEventListener('click', () => {
        console.log('DETUVE LA GRABACION, LISTO');

        mostrarControl(2);

        RTCRecorder.detenerGrabacion();

        const urlBlob = RTCRecorder.getUrlBlob();

        videoNode.classList.add('ocultar');
        previsualizarGifNode.classList.remove('ocultar');

        previsualizarGifNode.setAttribute('src', urlBlob);
    });

    buttonRepetir.addEventListener('click', () => {
        console.log('REPITO GRABACION.');

        mostrarControl(1);

        RTCRecorder.destruirGrabacion();
        RTCRecorder.comenzarGrabacion();

        videoNode.classList.remove('ocultar');
        previsualizarGifNode.classList.add('ocultar');
    });

    buttonSubir.addEventListener('click', () => {
        console.log('Elegi subir el gif.');
        subirGifo();
    });

}

function mostrarControl(mostrar) {
    const arregloControles = document.querySelectorAll('.controles');

    for (contador = 0; contador < arregloControles.length; contador++) {
        if (mostrar == contador) {
            arregloControles[contador].classList.replace('ocultar', 'mostrar');
        } else {
            arregloControles[contador].classList.replace('mostrar', 'ocultar');
        }
    }
}

async function subirGifo() {
    const gifName = 'MyGifNumber' + giphy.getMisIdGuifos().length + '.gif';

    let miForm = new FormData();
    miForm.append('file', RTCRecorder.getMiBlob(), gifName);
    console.log('MiForm: ', miForm.get('file'));

    let myGif = await fetch(`https://upload.giphy.com/v1/gifs?api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y`, {
        method: 'POST',
        body: miForm,
    })

    .then(async response => {
        return await response.json();
    }).catch(error => {
        console.log('Tiraste cualca pibe...');
    });

    // Pusheo el id de mi nuevo gif al array donde tengo todos los ids de mis gifs.
    giphy.pushNewIdGif(myGif.data.id);
    setMisGuifosIdToStorage();
    console.log('Guarde gifs en storage');
}

function checkStorageMisGifos() {
    const misGuifosStorage = localStorage.getItem('misIdGuifos');

    if (misGuifosStorage) {
        giphy.setMisIdGuifos(JSON.parse(misGuifosStorage));
        console.log('Mis Guifos de storage: ', giphy.getMisIdGuifos());
    } else {
        console.log('No habia gifs en el storage para cargar');
    }
}

function setMisGuifosIdToStorage() {
    // Pido el arreglo que tiene los IDs y lo convierto a string.
    const misIdGuifosStringify = JSON.stringify(giphy.getMisIdGuifos());
    // Guardo el arreglo como string con mis gifs en el storage.
    localStorage.setItem(`misIdGuifos`, misIdGuifosStringify);
}




























































const apiKey = "WMgym4yAIPYofgGPrganKNA7n1vg2D5Y";


// FUNCIONES DE API //
// Cargo trending gifs.
async function getTrending(limitGifs) {
    const consultaTrending = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y&limit=${limitGifs}&rating=G`);

    if (consultaTrending.ok) {
        const trendingJson = await consultaTrending.json();
        return trendingJson.data;
    } else {
        console.log('Error al traer trending.');
    }
}

// Inserto los trending en el html.
async function insertarMisTruchiGifos() {
    let tendenciasNodes = document.querySelector('.misGuifos');
    let posicion = 'izquierda';
    let gifs = await getTrending(34);
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