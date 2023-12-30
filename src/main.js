//DATA
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headres:{
        'Content-Type': 'application/json;characterset=utf=8',
    },
    params:{
        'api_key':API_KEY,
    },
});

function likedMovieInfo(){
    const item = JSON.parse(localStorage.getItem('likedMovie'));
    let movies;
    if (item) {
        movies = item;
    } else {
        movies={};
    }
    return movies;
}

function likeMovie(movie){
    const likedMovies = likedMovieInfo();
    if(likedMovies[movie.id]) {
        //sacar peli del LS
        console.log('ya esta likeada, ELMINAR');
        likedMovies[movie.id] = undefined;
    } else {
        console.log('no esta likeada, AGREGAR');
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem('likedMovie',JSON.stringify(likedMovies));
}

// Utils
//Definición del lazy loader
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry)=> {
        //console.log(entry.target.setAttribute);
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src',url);
            //entry.target.setAttribute(isVisible,true);
        }
    });
});

function createMovies(
        movies,
        container,
        {lazyload = false,
         clean = true} = {},
         ){
        if(clean) {
            container.innerHTML= '';
        }
        movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);       
        movieImg.setAttribute(
            lazyload ? 'data-img':'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path,
            );
        movieImg.addEventListener('click',()=> {
            location.hash = '#movie=' + movie.id;
        });
        //si no tiene imágen trato el error poniéndole una por defecto
        movieImg.addEventListener('error',()=> {
            movieImg.setAttribute('src',
            'https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?w=740&t=st=1703789424~exp=1703790024~hmac=4c80ac54cb0cc7456ac1aa28cbde7148dc416b4b3cba5c74a3407548fb594353');
        });
        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        movieBtn.addEventListener('click',() => {
            movieBtn.classList.toggle('movie-btn--liked');
            //Agrega peli a local storage
            likeMovie(movie);
        });

        //Activo el observador para las imágenes
        if (lazyload) {lazyLoader.observe(movieImg);}
        
        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
        container.appendChild(movieContainer);
    });
}

function createCategories(categories,container) {
        container.innerHTML = "";
        categories.forEach(category => {  
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('category-container'); 
            const categoryTitle = document.createElement('h3');      
            categoryTitle.classList.add('category-title');
            categoryTitle.setAttribute('id', 'id' + category.id);
            categoryTitle.addEventListener('click',()=> {
                location.hash = '#category=' + category.id + '-' + category.name;
            });
            const categoryTitleText = document.createTextNode(category.name);
    
            categoryTitle.appendChild(categoryTitleText);
            categoryContainer.appendChild(categoryTitle);
            container.appendChild(categoryContainer);
        });
}

//llamados a la API

async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    //const trendingMoviesPreviewList = document.querySelector('#trendingPreview .trendingPreview-movieList');
    createMovies(
        movies,
        trendingMoviesPreviewList,
        {lazyload:true,
            clean:true
        });
}

async function getCategories() {
    const {data} = await api('genre/movie/list');
    const categories = data.genres; //el data. varía segun la definición de la API , aca es data.genres. En movies es data.results
    
    createCategories(categories,categoriesPreviewList);
}

async function getMoviesByCategory(idcateg) {
    const { data } = await api('discover/movie',{
        params: {
            with_genres: idcateg,
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(movies,genericSection,true);
}

function getPaginatedMoviesByCategory(idcateg) {
    //función con closure
    return async function () {
        const {scrollTop,
               scrollHeight,
               clientHeight
              } = document.documentElement;
        const scrollIsBottom = ((clientHeight+scrollTop) /scrollHeight) >= 
            scrollTrigger;
        const pageIsNotMax = page < maxPage;

        if (scrollIsBottom && pageIsNotMax) {
            page++;
            //console.log(page);
            const { data } = await api('discover/movie',{
                params: {
                    with_genres: idcateg,
                    page:page,       
                },
            });
            const movies = data.results;
            createMovies(
                movies,
                genericSection, 
                {lazyload:true,clean:false},); 
        }; 
    };
}

async function getMoviesBySearch(query) {

    const { data } = await api('search/movie',{
        params: {
            query: query
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(movies,genericSection,);    
}

function getPaginatedMoviesBySearch(query) {
    //Solución con Closure para acceder a string de búsqueda pasándolo
    //como parámetro
    //const [_,iquery] = location.hash.split('='); "No necesito mas esta linea"
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
              } = document.documentElement;
        const scrollIsBottom = ((clientHeight+scrollTop) /scrollHeight) >= 
                                scrollTrigger;
        const pageIsNotMax = page < maxPage;
        if (scrollIsBottom && pageIsNotMax) {
            page++; 
            //console.log(page);
            const { data } = await api('search/movie',{
                params: {
                    query: query,
                    page: page
                },
            });
            const movies = data.results;
            createMovies(
                movies, 
                genericSection,
                {lazyload:true,clean:false},);    
        };
    };
}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    createMovies(movies, genericSection,{lazyload:true,clean:true});
    //console.log(data.total_pages);
    maxPage = data.total_pages;
    
}

async function getPaginatedTrendingMovies(){
    const {scrollTop,
           scrollHeight,
           clientHeight} = document.documentElement;
    
           const pageIsNotMax = page < maxPage;
           const scrollIsBottom = ((clientHeight+scrollTop)/scrollHeight) >= scrollTrigger;
    if (scrollIsBottom && pageIsNotMax) {
        page++;
        //console.log(page);
        const { data } = await api('trending/movie/day',{
            params: {
                page:page,
            },
        });
        const movies = data.results;
        //console.log(data)
        createMovies(
            movies, 
            genericSection,
            {lazyload:true,clean:false},);
    }
}

async function getMovieById(id) {
    //Trae el detalle de una peli, cdo haces click en el trending preview
    //o en el trending en general.
    const { data: movie } = await api('movie/' + id);
    console.log(movie);
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = `
    linear-gradient(
        180deg,
        rgba(0,0,0,0.35) 19.27%,
        rgba(0,0,0,0) 29.17%
    ),
    url(${movieImgUrl})`;
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview; 
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres,movieDetailCategoriesList);
    getRelatedMoviesId(id);
  
}

async function getRelatedMoviesId (id) {
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;
    console.log(relatedMovies);
    createMovies(relatedMovies,relatedMoviesContainer,true);
}

/* Funciones paginadas sin Closure */
async function getPaginatedMoviesBySearch_no_closure() {
    //vuelvo a traer el query porque no puedo acceder (sin closures) 
    //a la variable q tiene el search de la función sin paginar
    const [_,iquery] = location.hash.split('=');
    const {scrollTop,
        scrollHeight,
        clientHeight} = document.documentElement;
    const scrollIsBottom = ((clientHeight+scrollTop) /scrollHeight) >= 
                               scrollTrigger;
    const pageIsNotMax = page < maxPage;
    if (scrollIsBottom && pageIsNotMax) {
        page++; 
        //console.log(page);
        const { data } = await api('search/movie',{
            params: {
                query: iquery,
                page: page
            },
        });
        const movies = data.results;
        createMovies(
            movies, 
            genericSection,
            {lazyload:true,clean:false},);    
    };
}

async function getPaginatedMoviesByCategory_no_closure() {
    const {scrollTop,
           scrollHeight,
           clientHeight} = document.documentElement;

    const [_,category] = location.hash.split('=');
    const [idcat,categName]  = category.split('-');
    if (((clientHeight+scrollTop) /scrollHeight) >= scrollTrigger) {
        page++;
        //console.log(page);
        const { data } = await api('discover/movie',{
            params: {
                page:page,
                with_genres: idcat,
            },
        });
        const movies = data.results;
        createMovies(
            movies,
            genericSection, 
            {lazyload:true,clean:false},); 
    } 
}