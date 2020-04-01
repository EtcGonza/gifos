const apiKey = "WMgym4yAIPYofgGPrganKNA7n1vg2D5Y";
let theme_light = true;

const THEME_ATTRIB_NAME = "theme";
const THEME_LIGHT = "light";
const THEME_DARK = "dark";

theme_light ? document.documentElement.setAttribute(THEME_ATTRIB_NAME, THEME_LIGHT) : document.documentElement.setAttribute(THEME_ATTRIB_NAME, THEME_DARK);

barSearch();
clickBotonTemas();
loadTrending();
loadSugest();

// FUNCIONES DE API //
async function getTrending(limitGifs) {
    const consultaTrending = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y&limit=${limitGifs}&rating=G`);

    if (consultaTrending.ok) {
        const trendingJson = await consultaTrending.json();
        return trendingJson.data;
    } else {
        console.log('Error al traer trending.');
    }
}

async function buscarApi(searchParam) {
    const consultaSearch = await fetch(`http://api.giphy.com/v1/gifs/search?q=${searchParam}&api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y`);

    if (consulta.ok) {
        const jsonSearch = await consultaSearch.json();
        return jsonSearch;
    } else {
        console.log('Error al traer buscar.');
    }

}

async function getRandomGif() {
    const consultaRandom = await fetch(`http://api.giphy.com/v1/gifs/random?api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y`);

    if (consultaRandom.ok) {
        const jsonRandom = await consultaRandom.json();
        return jsonRandom.data;
    } else {
        console.log('Error al traer Gif Random.');
    }
}

// FUNCIONES GENERALES //
async function loadSugest() {
    nodesImg = document.querySelectorAll('.gif-sugerencia .gif');
    nodesParrafos = document.querySelectorAll('.descripcion-gif');

    // Array que tendra mis gifs.
    let gifsRandom = [];

    // Pido cuatro gifs randoms.
    for (let contador = 0; contador < 4; contador++) {
        gifsRandom.push(await getRandomGif());
    }

    // Arreglo con los titulos de mis gifs randoms.
    const arrayGifsHastag = await getTitlesOfGifs(gifsRandom, false);

    for (let contador = 0; contador < 4; contador++) {

        let urlChequeada = checkUrlGif(gifsRandom[contador].images);

        nodesImg[contador].setAttribute('src', urlChequeada);

        let createParrafo = document.createElement('p');
        createParrafo.innerHTML = checkGifTitle(arrayGifsHastag[contador]);

        nodesParrafos[contador].prepend(createParrafo);
    }
}

async function loadTrending() {
    let tendenciasNodes = document.querySelector('.grid');
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

async function getTitlesOfGifs(arrayGifs, cutTitles) {
    let gifHastag = [];

    if (cutTitles == true) {
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
            let deleteIndex = gifHastag[contador].indexOf('#GIF');
            gifHastag[contador] = gifHastag[contador].slice(0, deleteIndex);
        }

    }

    return gifHastag;
}

function barSearch() {

    const boton = document.getElementById('boton-buscar');
    let resultadosGifs = [];
    let valueInput = null;

    boton.addEventListener('click', async() => {
        // Get value del input.
        valueInput = document.getElementById('input_buscar').value;

        // Prevengo de que se realicen consultas vacias.
        if (valueInput || 0 > valueInput.length) {
            // Traigo resultados de busqueda.
            resultadosGifs = await buscarApi(valueInput);
            console.log(resultadosGifs);
        } else {
            console.log('ValueInput INVALIDO');
        }
    });

}

function createGridItem(imgSrc, hastagsText, posicionInsertar) {

    let divContenedor = document.createElement('div');

    let imgTag = document.createElement('img');
    imgTag.setAttribute('src', imgSrc);

    let divHastag = document.createElement('div');
    divHastag.setAttribute('class', 'contenedor-hastags');

    let parrafoTag = document.createElement('p');
    parrafoTag.innerHTML = checkGifTitle(hastagsText);
    parrafoTag.setAttribute('class', 'fondo-degradado');

    if (posicionInsertar == undefined) {
        divContenedor.setAttribute('class', 'grid-item gif-tendencia');
        imgTag.setAttribute('class', 'gif');

    } else if (posicionInsertar.toLocaleLowerCase() == 'derecha') {
        divContenedor.setAttribute('class', 'grid-item gif-tendencia expand-derecha');
        imgTag.setAttribute('class', 'gif-expand');

    } else if (posicionInsertar.toLocaleLowerCase() == 'izquierda') {
        divContenedor.setAttribute('class', 'grid-item gif-tendencia expand-izquierda');
        imgTag.setAttribute('class', 'gif-expand');

    } else {
        console.log('Estas pasando cualquier cosa amigo.');
    }

    divContenedor.appendChild(imgTag);
    divContenedor.appendChild(divHastag);
    divHastag.appendChild(parrafoTag);

    return divContenedor;
}

function checkGifTitle(titleGif) {
    if (titleGif == ' ') {
        return "This Gif doesn't have a title";
    } else {
        return titleGif;
    }
}

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

function clickBotonTemas() {
    const boton = document.getElementById('mostrar-temas');

    boton.addEventListener('click', () => {
        var nodesTemas = document.querySelector('.ventana-temas');
        nodesTemas.classList.replace('ocultar', 'mostrar');
    });
}