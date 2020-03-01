const apiKey = "WMgym4yAIPYofgGPrganKNA7n1vg2D5Y";
var misTendencias;

var img = document.createElement('img').src = "/assets/img/photo_2020-02-22_15-52-06.jpg";

var foo = document.getElementById("tendencias");
foo.appendChild(img);

// document.images.
// document.getElementById('tendencia').innerHTML('assets/img/photo_2020-02-22_15-52-06.jpg');

// FUNCIONES
async function getTrending() {

    const trending = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y&limit=4&rating=G`)
        .then(response => {
            return response.json();
        }).then((data) => {
            return data;
        }).catch((error) => {
            console.log('Tuvimos errores pidiendo data: ', error);
        });

    misTendencias = await (() => {
        trending.then(res => {
            return res.data;
        });
    });

    console.log(misTendencias);
}

function barSearch() {
    const found = fetch(`http://api.giphy.com/v1/gifs/search?q=cats&api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y`)
        .then(response => {
            return response.json();
        }).then(data => {
            return data;
        })
        .catch(error => {
            return error;
        });

    return found;
}