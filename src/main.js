const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headres:{
        'Content-Type': 'application/json;characterset=utf=8',
    },
    params:{
        'api_key':API_KEY,
    },
});

async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;

    movies.forEach(movie => {
        const trendingPreviewMoviesContainer = document.querySelector
        ('#trendingPreview .trendingPreview-movieList');
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        
        const movieImg = document.createElement('img');

        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute(
            'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path,
            );

            movieContainer.appendChild(movieImg);
            trendingPreviewMoviesContainer.appendChild(movieContainer);

    });
    console.log({data,movies});
}

async function getCategories() {
    const {data} = await api('genre/movie/list');
    const categories = data.genres; //el data. varía segun la definición de la API , aca es data.genres. En movies es data.results
    
    categories.forEach(category => {
        const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list');

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container'); 
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        const categoryTitleText = document.createTextNode(category.name);
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        previewCategoriesContainer.appendChild(categoryContainer);
    });
    console.log({data,categories});
}
getCategories();
getTrendingMoviesPreview();