const apiKey = "WMgym4yAIPYofgGPrganKNA7n1vg2D5Y";

barSearch();
loadTrending();

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

async function randomGif() {
    const consultaRandom = await fetch(`http://api.giphy.com/v1/gifs/random?api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y`);
    const jsonRandom = await consultaRandom.json();
    return jsonRandom;
}
//////////////////////

// FUNCIONES GENERALES //
async function loadTrending() {
    const nodesImg = document.querySelectorAll('.gif-tendencia img');
    const nodeParrafos = document.querySelectorAll('.contenedor-hastags');

    var gifs = await getTrending(nodesImg.length);

    gifsHastag = await getTitlesOfGifs(gifs);

    // Inserto los GIFS
    for (contador = 0; contador < nodesImg.length; contador++) {
        nodesImg[contador].setAttribute('src', gifs[contador].images.downsized.url);

        let createParrafo = document.createElement('p');
        createParrafo.innerHTML = gifsHastag[contador];

        nodeParrafos[contador].appendChild(createParrafo);
    }
}

async function getTitlesOfGifs(arrayGifs) {
    var gifHastag = [];

    for (contador = 0; contador < arrayGifs.length; contador++) {
        gifHastag[contador] = ` #${arrayGifs[contador].title.replace(/ /g, " #")}`;
        let deleteIndex = gifHastag[contador].indexOf('#GIF');
        gifHastag[contador] = gifHastag[contador].slice(0, deleteIndex);
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
        } else {
            console.log('ValueInput INVALIDO');
        }
        const random = await randomGif();
        console.log(random);
    });

}