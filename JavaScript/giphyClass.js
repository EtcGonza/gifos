class Giphy {

    // Seteo el apiKey y la cantidad de gifs que quiero traer por llamada.
    constructor(setLimitGifs, setApiKey) {
        this.apiKey = setApiKey;
        this.limitGifs = setLimitGifs;
        this.offsetHistory = 0;
    }

    // Cargo trending gifs.
    async getTrending() {
        const consultaTrending = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${this.apiKey}&limit=${this.limitGifs}&offset=${this.offsetHistory}&rating=G`);

        if (consultaTrending.ok) {
            const trendingJson = await consultaTrending.json();
            this.offsetHistory = this.offsetHistory + this.limitGifs;
            return trendingJson.data;
        } else {
            console.error('Error al traer trending.');
        }
    }

    // Recibo gifs segun un valor ingresado.
    async buscarApi(searchParam) {
        const consultaSearch = await fetch(`http://api.giphy.com/v1/gifs/search?q=${searchParam}&api_key=${this.apiKey}`);

        if (consultaSearch.ok) {
            const jsonSearch = await consultaSearch.json();
            return jsonSearch.data;
        } else {
            console.error('Error al traer buscar.');
        }
    }

    // Me trae un gif random.
    async getRandomGif() {
        const consultaRandom = await fetch(`http://api.giphy.com/v1/gifs/random?api_key=${this.apiKey}`);

        if (consultaRandom.ok) {
            const jsonRandom = await consultaRandom.json();
            return jsonRandom.data;
        } else {
            console.error('Error al traer Gif Random.');
        }
    }

    // Traigo un gif random.
    async getFourRandomsGifs() {
        let auxArrayGifs = [];

        for (let contador = 0; contador < 4; contador++) {
            let gif = await this.getRandomGif();
            auxArrayGifs.push(gif);
        }

        return auxArrayGifs;
    }

}