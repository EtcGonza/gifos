let theme_light = true;
theme_light ? document.documentElement.setAttribute('theme', 'day') : document.documentElement.setAttribute('theme', 'night');

//
let giphy = new Giphy(24, 'WMgym4yAIPYofgGPrganKNA7n1vg2D5Y');
let RTCRecorder = new RtcRecorder();
let myTimer;
let seconds = 0;

getMedia();
eventListenerButtons();
mostrarControl(0);

checkStorageMisGifos();
insertarMisGuifos();


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
            myTimer = setInterval(incrementSeconds, 1000);
            RTCRecorder.comenzarGrabacion();
            mostrarControl(1);
        }
    });

    buttonListo.addEventListener('click', () => {
        console.log('DETUVE LA GRABACION, LISTO');

        stopTimer(myTimer);

        mostrarControl(2);

        RTCRecorder.detenerGrabacion();

        const urlBlob = RTCRecorder.getUrlBlob();

        videoNode.classList.add('ocultar');
        previsualizarGifNode.classList.remove('ocultar');

        previsualizarGifNode.setAttribute('src', urlBlob);
    });

    buttonRepetir.addEventListener('click', () => {
        console.log('REPITO GRABACION.');
        stopTimer(myTimer);
        myTimer = setInterval(incrementSeconds, 1000);

        mostrarControl(1);

        RTCRecorder.destruirGrabacion();
        RTCRecorder.comenzarGrabacion();

        videoNode.classList.remove('ocultar');
        previsualizarGifNode.classList.add('ocultar');
    });

    buttonSubir.addEventListener('click', () => {
        console.log('Elegi subir el gif.');
        stopTimer(myTimer);
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
    insertarMiNuevoGif(myGif.data.id);
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

async function insertarMiNuevoGif(idGif) {
    let misGuifosNode = document.querySelector('.misGuifos');
    const miGif = await giphy.getGifById(idGif);

    let urlChequeada = checkUrlGif(miGif.images);
    const nuevoNodo = createGridItem(urlChequeada);
    misGuifosNode.appendChild(nuevoNodo);
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

function incrementSeconds() {
    let pNode = document.querySelectorAll('.recording-tiempo');

    if (seconds < 12) {
        seconds++;
        console.log(seconds);

        if (seconds <= 9) {
            seconds = '0' + seconds;
            pNode[0].innerHTML = '00:00:' + seconds;
            pNode[1].innerHTML = '00:00:' + seconds;
            seconds = parseInt(seconds);
        } else {
            pNode[0].innerHTML = '00:00:' + seconds;
            pNode[1].innerHTML = '00:00:' + seconds;
        }
    } else {
        forzarDetenerGrabacion();
    }
}

function stopTimer(myTimer) {
    clearInterval(myTimer);
    seconds = 0;
}

function forzarDetenerGrabacion() {
    const videoNode = document.getElementById('videoFrame');
    const previsualizarGifNode = document.getElementById('previsualizarGif');

    stopTimer(myTimer);

    mostrarControl(2);

    RTCRecorder.detenerGrabacion();

    const urlBlob = RTCRecorder.getUrlBlob();

    videoNode.classList.add('ocultar');
    previsualizarGifNode.classList.remove('ocultar');

    previsualizarGifNode.setAttribute('src', urlBlob);
}