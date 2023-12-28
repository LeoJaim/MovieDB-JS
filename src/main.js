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



function createMovies(movies,container,lazyload = false){
    container.innerHTML= '';
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

    // trendingMoviesPreviewList.innerHTML="";
    // movies.forEach(movie => {
    //     const movieContainer = document.createElement('div');
    //     movieContainer.classList.add('movie-container');
        
    //     const movieImg = document.createElement('img');

    //     movieImg.classList.add('movie-img');
    //     movieImg.setAttribute('alt',movie.title);
    //     movieImg.setAttribute(
    //         'src',
    //         'https://image.tmdb.org/t/p/w300' + movie.poster_path,
    //         );

    //         movieContainer.appendChild(movieImg);
    //         trendingMoviesPreviewList.appendChild(movieContainer);

    // });
    console.log({data,movies});
}

async function getCategories() {
    const {data} = await api('genre/movie/list');
    const categories = data.genres; //el data. varía segun la definición de la API , aca es data.genres. En movies es data.results
    
    createCategories(categories,categoriesPreviewList);

    //const categoriesPreviewList = document.querySelector('#categoriesPreview .categoriesPreview-list');
    // categoriesPreviewList.innerHTML = "";
    // categories.forEach(category => {  
    //     const categoryContainer = document.createElement('div');
    //     categoryContainer.classList.add('category-container'); 
    //     const categoryTitle = document.createElement('h3');      
    //     categoryTitle.classList.add('category-title');
    //     categoryTitle.setAttribute('id', 'id' + category.id);
    //     categoryTitle.addEventListener('click',()=> {
    //         location.hash = '#category=' + category.id + '-' + category.name;
    //     });
    //     const categoryTitleText = document.createTextNode(category.name);

    //     categoryTitle.appendChild(categoryTitleText);
    //     categoryContainer.appendChild(categoryTitle);
    //     categoriesPreviewList.appendChild(categoryContainer);
    // });
    console.log({data,categories});
}

async function getMoviesByCategory(idcateg) {
    const { data } = await api('discover/movie',{
        params: {
            with_genres: idcateg,
        },
    });
    const movies = data.results;
    createMovies(movies,genericSection);

    //const trendingMoviesPreviewList = document.querySelector('#trendingPreview .trendingPreview-movieList');
    // genericSection.innerHTML="";
    // movies.forEach(movie => {
    //     const movieContainer = document.createElement('div');
    //     movieContainer.classList.add('movie-container');
    
    //     const movieImg = document.createElement('img');
    //     movieImg.classList.add('movie-img');
    //     movieImg.setAttribute('alt',movie.title);
    //     movieImg.setAttribute(
    //         'src',
    //         'https://image.tmdb.org/t/p/w300' + movie.poster_path,
    //         );

    //         movieContainer.appendChild(movieImg);
    //         genericSection.appendChild(movieContainer);

    // });    
}

async function getMoviesBySearch(query) {
    const { data } = await api('search/movie',{
        params: {
            query: query,
        },
    });
    const movies = data.results;
    createMovies(movies,genericSection);    
}
async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    createMovies(movies, genericSection);
  }

  async function getMovieById(id) {
    const { data: movie } = await api('movie/' + id);
  
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

    createMovies(relatedMovies,relatedMoviesContainer);
}