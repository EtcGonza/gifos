const apiKey = "WMgym4yAIPYofgGPrganKNA7n1vg2D5Y";
const toSearch = 'cats';

console.log('Ejecutando');

barSearch(toSearch);

function barSearch(buscar) {
    const found = fetch(`http://api.giphy.com/v1/gifs/search?q=${buscar}&api_key=WMgym4yAIPYofgGPrganKNA7n1vg2D5Y`)
        .then((response) => {
            return response.json();
        }).then(data => {
            console.log(data);
            return data;
        })
        .catch((error) => {
            return error;
        });

    return found;
}