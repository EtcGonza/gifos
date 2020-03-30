const apiKey = "WMgym4yAIPYofgGPrganKNA7n1vg2D5Y";
var theme_light = true;

const THEME_ATTRIB_NAME = "theme";
const THEME_LIGHT = "light";
const THEME_DARK = "dark";

theme_light ? document.documentElement.setAttribute(THEME_ATTRIB_NAME, THEME_LIGHT) : document.documentElement.setAttribute(THEME_ATTRIB_NAME, THEME_DARK);

barSearch();
loadTrending();
loadSugest();

// FUNCIONES DE API //
async function getTrending(limitGifs) {
    const consultaTrending = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y&limit=${limitGifs}&rating=G`);
    const trendingJson = await consultaTrending.json();
    return trendingJson.data;
}

async function buscarApi(searchParam) {
    const consultaSearch = await fetch(`http://api.giphy.com/v1/gifs/search?q=${searchParam}&api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y`);
    const jsonSearch = await consultaSearch.json();
    return jsonSearch;
}

async function getRandomGif() {
    const consultaRandom = await fetch(`http://api.giphy.com/v1/gifs/random?api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y`);
    const jsonRandom = await consultaRandom.json();
    return jsonRandom.data;
}
//////////////////////

// FUNCIONES GENERALES //
async function loadTrending() {
    const nodesImg = document.querySelectorAll('.gif-tendencia img');
    const nodeParrafos = document.querySelectorAll('.contenedor-hastags');

    var gifs = await getTrending(nodesImg.length);
    console.log(gifs);

    const gifsHastag = await getTitlesOfGifs(gifs, true);

    // Inserto los GIFS
    for (contador = 0; contador < nodesImg.length; contador++) {
        nodesImg[contador].setAttribute('src', gifs[contador].images.downsized.url);
        console.log(gifs[contador].images.downsized.url);

        let createParrafo = document.createElement('p');
        createParrafo.innerHTML = gifsHastag[contador];
        createParrafo.setAttribute('class', 'fondo-degradado');

        nodeParrafos[contador].appendChild(createParrafo);
    }
}

async function loadSugest() {
    nodesImg = document.querySelectorAll('.gif-sugerencia .gif');
    nodesParrafos = document.querySelectorAll('.descripcion-gif');

    var gifsRandom = [];

    for (let contador = 0; contador < 4; contador++) {
        gifsRandom.push(await getRandomGif());
    }

    const gifsHastag = await getTitlesOfGifs(gifsRandom, false);

    for (let contador = 0; contador < 4; contador++) {
        nodesImg[contador].setAttribute('src', gifsRandom[contador].images.downsized.url);
        let createParrafo = document.createElement('p');
        createParrafo.innerHTML = gifsHastag[contador];
        nodesParrafos[contador].prepend(createParrafo);
    }
}

async function getTitlesOfGifs(arrayGifs, cutTitles) {
    var gifHastag = [];

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
    var resultadosGifs = [];
    var valueInput = null;

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