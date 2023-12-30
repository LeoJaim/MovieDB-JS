const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headres:{
        'Content-Type': 'application/json;characterset=utf=8',
    },
    params:{
        'api_key':API_KEY,
    },
});

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
        movieContainer.addEventListener('click',()=> {
            location.hash = '#movie=' + movie.id;
        });
        
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);       
        movieImg.setAttribute(
            lazyload ? 'data-img':'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path,
            );
        //si no tiene imágen trato el error poniéndole una por defecto
        movieImg.addEventListener('error',()=> {
            movieImg.setAttribute('src',
            'https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?w=740&t=st=1703789424~exp=1703790024~hmac=4c80ac54cb0cc7456ac1aa28cbde7148dc416b4b3cba5c74a3407548fb594353');
        });
        //Activo el observador para las imágenes
        if (lazyload) {lazyLoader.observe(movieImg);}
        
        movieContainer.appendChild(movieImg);
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
    createMovies(movies,trendingMoviesPreviewList,true);
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
    createMovies(movies,genericSection,true);  
}

async function getPaginatedMoviesByCategory() {
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

async function getMoviesBySearch(query) {

    const { data } = await api('search/movie',{
        params: {
            query: query
        },
    });
    const movies = data.results;
    createMovies(movies,genericSection,);    
}

async function getPaginatedMoviesBySearch() {
    const [_,iquery] = location.hash.split('=');
   
    const { data } = await api('search/movie',{
        params: {
            query: iquery,
            page: page
        },
    });
    const movies = data.results;
    const {scrollTop,
        scrollHeight,
        clientHeight} = document.documentElement;
        //console.log((clientHeight+scrollTop) /scrollHeight);
    if (((clientHeight+scrollTop) /scrollHeight) >= scrollTrigger) {
        page++; 
        //console.log(page);
        createMovies(
            movies, 
            genericSection,
            {lazyload:true,clean:false},);    
    }
}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    createMovies(movies, genericSection,{lazyload:true,clean:true});

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerHTML = 'Mas Pelis';
    // btnLoadMore.addEventListener('click',getPaginatedTrendingMovies)
    // genericSection.appendChild(btnLoadMore);
    
}

async function getPaginatedTrendingMovies(){
    const {scrollTop,
           scrollHeight,
           clientHeight} = document.documentElement;
    
    if (((clientHeight+scrollTop) /scrollHeight) >= scrollTrigger) {
        page++;
        //console.log(page);
        const { data } = await api('trending/movie/day',{
            params: {
                page:page,
            },
        });
        const movies = data.results;
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