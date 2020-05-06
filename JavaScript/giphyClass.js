class Giphy {

    // Seteo el apiKey y la cantidad de gifs que quiero traer por llamada.
    constructor(setLimitGifs, setApiKey) {
        this.apiKey = setApiKey;
        this.limitGifs = setLimitGifs;
        this.offsetHistory = 0;
        this.misIdGuifos = [];
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

    async getGifById(idGif) {
        const consultaFetch = await fetch(`https://api.giphy.com/v1/gifs/${idGif}?api_key=${this.apiKey}`);

        if (consultaFetch.ok) {
            const dataJson = await consultaFetch.json();
            return dataJson;
        } else {
            console.error('No se pudo traer el gif by ID.');
        }
    }

    async getMisGifsById() {
        let misGifs = [];

        for (let contador = 0; contador < this.misIdGuifos.length; contador++) {
            let gif = await this.getGifById(this.misIdGuifos[contador]);
            misGifs.push(gif);
        }

        return misGifs;
    }

    async pushNewIdGif(idGif) {
        this.misIdGuifos.push(idGif);
        console.log('Nuevo gif pusheado.', this.misIdGuifos);
    }

    getMisIdGuifos() {
        return this.misIdGuifos;
    }

    setMisIdGuifos(misIdGuifos) {
        this.misIdGuifos = misIdGuifos;
    }

}