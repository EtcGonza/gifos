const apiKey = "WMgym4yAIPYofgGPrganKNA7n1vg2D5Y";

loadTrending();

// FUNCIONES
async function getTrending(limitGifs) {
    const consultaTrending = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y&limit=${limitGifs}&rating=G`);
    const trendingJson = await consultaTrending.json();
    return trendingJson.data;
}

async function loadTrending() {
    const nodesImg = document.querySelectorAll('.gif-tendencia img');
    const nodeParrafos = document.querySelectorAll('.contenedor-hastags');

    var gifs = await getTrending(nodesImg.length);

    gifsHastag = await getTitlesOfGifs();

    // Inserto los GIFS
    for (contador = 0; contador < nodesImg.length; contador++) {
        nodesImg[contador].setAttribute('src', gifs[contador].images.downsized.url);

        let createParrafo = document.createElement('p');
        createParrafo.innerHTML = gifsHastag[contador];

        nodeParrafos[contador].appendChild(createParrafo);
    }
}

async function getTitlesOfGifs() {
    const nodesTrending = document.querySelectorAll('.contenedor-hastags');
    var gifs = await getTrending(nodesTrending.length);
    var gifHastag = [];

    for (contador = 0; contador < nodesTrending.length; contador++) {
        gifHastag[contador] = ` #${gifs[contador].title.replace(/ /g, " #")}`;
        let deleteIndex = gifHastag[contador].indexOf('#GIF');
        gifHastag[contador] = gifHastag[contador].slice(0, deleteIndex);
    }
    return gifHastag;
}


// function barSearch() {
//     const found = fetch(`http://api.giphy.com/v1/gifs/search?q=cats&api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y`)
//         .then(response => {
//             return response.json();
//         }).then(data => {
//             return data;
//         })
//         .catch(error => {
//             return error;
//         });

//     return found;
// }