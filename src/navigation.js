let maxPage;
let page = 1;
let infiniteScroll;
const scrollTrigger = 0.90;

searchFormBtn.addEventListener('click',()=> {
    location.hash='#search=' + searchFormInput.value;
});
trendingBtn.addEventListener('click',()=> {
    location.hash='#trends'
});
arrowBtn.addEventListener('click',()=> {
    history.back();
});

window.addEventListener('DOMContentLoaded',navigator,false);
window.addEventListener('hashchange',navigator,false);
window.addEventListener('scroll',infiniteScroll,false);

function navigator() {

    //console.log({location});
    if (infiniteScroll) {
        window.removeEventListener('scroll',infiniteScroll,
        {passive:false});

        infiniteScroll = undefined;
    }
    if (location.hash.startsWith('#trends')) {
        trendsPage ();
    } else if (location.hash.startsWith('#search=')) {
        searchPage ();
    } else if (location.hash.startsWith('#movie=')) {
        moviePage ();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage ();
    } else {
        homePage();
    } 
    document.body.scrollTop = 0;            //para hacer scroll up cdo cambiamos de #
    document.documentElement.scrollTop = 0; //para hacer scroll up cdo cambiamos de #
    if (infiniteScroll) {
        window.addEventListener('scroll',infiniteScroll,
        {passive:false});
    }

} 
function homePage () {
    //console.log('Home!!!');
    
    searchInput = document.getElementById('formField');
    searchInput.value = '';

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    headerTitle.innerHTML = 'Todas las Películas';
    getTrendingMoviesPreview();
    getCategories();
}
function categoriesPage () {
    //console.log('Categories');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_,categoryData] = location.hash.split('=');
    const [idCateg,categName]  = categoryData.split('-');
    headerTitle.innerHTML = 'Películas por Género';
    headerCategoryTitle.innerHTML = categName;
    page = 1;
    getMoviesByCategory(idCateg);
    infiniteScroll = getPaginatedMoviesByCategory(idCateg);
}
function searchPage () {
    //console.log('Search');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    
    headerTitle.classList.remove('inactive');
    headerTitle.innerHTML = 'Búsqueda de Películas';
    
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    
    const [_,query] = location.hash.split('=');
    searchInput = document.getElementById('formField');
    searchInput.value = query;
    page = 1;
    getMoviesBySearch(query);
    infiniteScroll = getPaginatedMoviesBySearch(query);
}
function trendsPage () {
    //console.log('Trends');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';
    page = 1;
    getTrendingMovies();
    infiniteScroll = getPaginatedTrendingMovies;
}
function moviePage () {
    //console.log('Movie!!!');
    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    
    const [_,movieId] = location.hash.split('=');
    getMovieById(movieId);
}