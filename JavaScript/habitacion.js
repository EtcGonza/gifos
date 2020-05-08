let theme_light = false;
theme_light ? document.documentElement.setAttribute('theme', 'day') : document.documentElement.setAttribute('theme', 'night');
checkStorageTheme();
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
    const buttonDescargarGuifo = document.getElementById('descargarGuifo');
    const buttonCopiarEnlace = document.getElementById('copiarEnlace');
    const videoNode = document.getElementById('videoFrame');
    const previsualizarGifNode = document.getElementById('previsualizarGif');
    const tuGifSubido = document.querySelector('.ventana-gifo-subido img');


    buttonComenzar.addEventListener('click', () => {
        document.getElementById('titulo-ventana').innerHTML = "Un Chequeo Antes de Empezar";
        document.getElementById('ventanaTemplate').classList.replace('ocultar', 'mostrar');
        document.getElementById('ventanaInstrucciones').classList.add('ocultar');
    });

    buttonCapturar.addEventListener('click', async() => {
        document.getElementById('titulo-ventana').innerHTML = "Capturando Tu Guifo";

        if (RTCRecorder.getRecorderState() === "inactive") {
            myTimer = setInterval(incrementSeconds, 1000);
            RTCRecorder.comenzarGrabacion();
            mostrarControl(1);
        }
    });

    buttonListo.addEventListener('click', () => {

        document.getElementById('titulo-ventana').innerHTML = "Vista Previa";


        stopTimer(myTimer);

        mostrarControl(2);

        RTCRecorder.detenerGrabacion();

        const urlBlob = RTCRecorder.getUrlBlob();

        videoNode.classList.add('ocultar');
        previsualizarGifNode.classList.remove('ocultar');

        previsualizarGifNode.setAttribute('src', urlBlob);
        tuGifSubido.setAttribute('src', urlBlob);
    });

    buttonRepetir.addEventListener('click', () => {
        document.getElementById('titulo-ventana').innerHTML = "Capturando Tu Guifo";

        stopTimer(myTimer);
        myTimer = setInterval(incrementSeconds, 1000);

        mostrarControl(1);

        RTCRecorder.destruirGrabacion();
        RTCRecorder.comenzarGrabacion();

        videoNode.classList.remove('ocultar');
        previsualizarGifNode.classList.add('ocultar');
    });

    buttonSubir.addEventListener('click', () => {
        document.getElementById('titulo-ventana').innerHTML = "Subiendo Guifo";

        stopTimer(myTimer);
        mostrarControl(3);
        subirGifo();
    });

    buttonDescargarGuifo.addEventListener('click', () => {
        const miBlob = RTCRecorder.getMiBlob();
        invokeSaveAsDialog(miBlob);
    });

    buttonCopiarEnlace.addEventListener('click', async() => {
        const urlGif = await giphy.getUrlGif();
        await navigator.clipboard.writeText(urlGif);
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

    changeStateVentanaGrabacion('subiendoGif');

    let miForm = new FormData();
    miForm.append('file', RTCRecorder.getMiBlob(), gifName);

    let myGif = await fetch(`https://upload.giphy.com/v1/gifs?api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y`, {
        method: 'POST',
        body: miForm,
    })

    .then(async response => {
        return await response.json();
    }).catch(error => {
        console.log('Tiraste cualca pibe...', error);
    });

    vistaGifSubido();


    // Pusheo el id de mi nuevo gif al array donde tengo todos los ids de mis gifs.
    giphy.pushNewIdGif(myGif.data.id);
    insertarMiNuevoGif(myGif.data.id);
    setMisGuifosIdToStorage();
}

function checkStorageMisGifos() {
    const misGuifosStorage = localStorage.getItem('misIdGuifos');

    if (misGuifosStorage) {
        giphy.setMisIdGuifos(JSON.parse(misGuifosStorage));
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

// CRONOMETRO

function incrementSeconds() {
    let pNode = document.querySelectorAll('.recording-tiempo');

    if (seconds < 12) {
        seconds++;

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
    const tuGifSubido = document.querySelector('.ventana-gifo-subido img');

    stopTimer(myTimer);

    mostrarControl(2);

    RTCRecorder.detenerGrabacion();

    const urlBlob = RTCRecorder.getUrlBlob();

    videoNode.classList.add('ocultar');
    previsualizarGifNode.classList.remove('ocultar');

    previsualizarGifNode.setAttribute('src', urlBlob);
    tuGifSubido.setAttribute('src', urlBlob);
}

function vistaGifSubido() {
    document.getElementById('ventanaTemplate').classList.replace('mostrar', 'ocultar');
    document.getElementById('ventanaInstrucciones').classList.add('ocultar');
    document.getElementById('ventanaFinalizar').classList.replace('ocultar', 'mostrar');
}

function changeStateVentanaGrabacion(state) {
    document.querySelector('.contenedor-grabando');
    document.querySelector('.contenedor-subiendo-gif');

    if (state == 'subiendoGif') {
        progressBar.show();
        document.querySelector('.contenedor-grabando').classList.add('ocultar');
        document.querySelector('.contenedor-subiendo-gif').classList.remove('ocultar');
    } else if (state == 'grabandoGif') {
        progressBar.hide();
        document.querySelector('.contenedor-grabando').classList.remove('ocultar');
        document.querySelector('.contenedor-subiendo-gif').classList.add('ocultar');
    } else {
        console.error('No se pudo cambiar el estado de la ventana de grabacion.');
    }

}

function checkStorageTheme() {

    const theme = localStorage.getItem('theme');

    if (theme == 'day') {
        document.documentElement.setAttribute('theme', 'day');
        document.querySelector('.camera-icon').setAttribute('src', '/assets/img/camera.svg');
    } else if (theme == 'night') {
        document.documentElement.setAttribute('theme', 'night');
        document.querySelector('.camera-icon').setAttribute('src', '/assets/img/camera_light.svg');
    } else {
        document.documentElement.setAttribute('theme', 'day');
        document.querySelector('.camera-icon').setAttribute('src', '/assets/img/camera.svg');
    }
}


// PROGRESSBAR

const ProgressBar = function(childItemsAmmount = 23, progressInterval = 150) {
    const progressBarElement = document.getElementById('progress-bar');
    let hidden = true;
    let childItems = [];
    let interval;
    let firstActive = lastActive = 0;

    function init() {}

    function show() {
        if (!hidden) return;

        hidden = false;
        progressBarElement.classList.remove('progress-bar-hidden');

        renderContent();
        animateContent();
    }

    function hide() {
        if (hidden) return;

        hidden = true;

        progressBarElement.innerHTML = null;
        progressBarElement.classList.add('progress-bar-hidden');

        clearInterval(interval);
        childItems = [];
        firstActive = lastActive = 0;
    }

    function renderContent() {

        for (let i = 0; i <= childItemsAmmount; i++) {
            const item = document.createElement('span');
            item.classList.add('progress-item');
            childItems.push(item);
        }

        childItems.forEach(item => progressBarElement.append(item));
    }

    function animateContent() {
        interval = setInterval(() => {
            if (lastActive < childItems.length) {
                childItems[lastActive].classList.add('active');
                lastActive++;
            } else if (firstActive < childItems.length) {
                childItems[firstActive].classList.remove('active');
                firstActive++;
            } else {
                lastActive = firstActive = 0;
            }
        }, progressInterval);
    }


    return { show, hide };
};

// Cantidad de items, velocidad de progreso (milisegundos)
const progressBar = new ProgressBar(22, 100);