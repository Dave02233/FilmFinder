const tmdbKey = '6d97711df58218950224274a47331355'; //Si autodistrugge ogni 12 ore, fregati se volevi qualche chiave 
const tmdbBaseUrl = 'https://api.themoviedb.org/3/';
const playBtn = document.getElementById('playBtn');

async function hashInput(input) {
    const encoder = new TextEncoder(); //Creazione istanza, serve per convertire una stringa in un array di byte
    const data = encoder.encode(input); //Conversione string => array di bye
    const hashBuffer = await crypto.subtle.digest("SHA-256", data); //API per calcolo hash SHA-256 (rappresentazione binaria dell'hash?), asincrona con promise
    //console.log(hashBuffer);
    return Array.from(new Uint8Array(hashBuffer)) //Conversione del buffer in un array di byte
        .map(b => b.toString(16).padStart(2, "0")) //Converte ogni byte in una stringa hex, padstart per mettere uno 0 davanti nel caso lunghezza < 2
        .join("");
}

const getGenres = async () => {
  const genreRequestEndpoint = "genre/movie/list"
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = tmdbBaseUrl + genreRequestEndpoint + requestParams;
  try{
    const response = await fetch(urlToFetch);
    if(response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse.genres;
      //console.log(jsonResponse);
    }
  }catch(error){
    console.log(error);
  }
};

const getMovies = async () => {
  const selectedGenre = getSelectedGenre();
  const discoverMovieEndpoint = `discover/movie`;
  const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}`;
  const urlToFecth = tmdbBaseUrl + discoverMovieEndpoint + requestParams;
  try{
    const response = await fetch(urlToFecth);
    if(response.ok) {
      const jsonResponse = await response.json()
      //console.log(jsonResponse.results);
      const movies = jsonResponse.results;
      console.log(movies);
      return movies;
    }
  }catch(error){
    console.log(error);
  }
};

const getMovieInfo = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `movie/${movieId}`
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = tmdbBaseUrl + movieEndpoint + requestParams;

  try{
    const response = await fetch(urlToFetch);
    if(response.ok) {
      const movieInfo = await response.json();
      console.log(movieInfo)
      return movieInfo;
    }
  }catch(e){
    console.log(e);
  }

};
getMovieInfo();

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = async () => {
  const movieInfo = document.getElementById('movieInfo');
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  };
  const movies = await getMovies();
  const randomMovie = await getRandomMovie(movies);
  const info = await getMovieInfo(randomMovie);
  displayMovie(info);
};

getGenres().then(populateGenreDropdown);
playBtn.onclick = showRandomMovie;