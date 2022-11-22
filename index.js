const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIE_PER_PAGE = 12;

const movies = [];
let filterMovies = [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");

function getMovieByPage(page) {
  const data = filterMovies.length ? filterMovies : movies;
  const starIndex = (page - 1) * MOVIE_PER_PAGE;
  return data.slice(starIndex, starIndex + 12);
}

function showMovieModal(id) {
  const movieTitle = document.querySelector("#movie-modal-title");
  const movieDate = document.querySelector("#movie-modal-date");
  const movieDescription = document.querySelector("#movie-modal-description");
  const movieImage = document.querySelector("#movie-modal-image");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    movieTitle.innerText = data.title;
    movieDate.innerText = "release date: " + data.release_date;
    movieDescription.innerText = data.description;
    movieImage.innerHTML = `<img src='${
      POSTER_URL + data.image
    }' alt="movie-poster" class="img-fluid" />`;
  });
}

function renderMovieList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top"
                alt="Movie Poster"
              />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#MovieModal"
                  data-id='${item.id}'
                >
                  More
                </button>
                <button class="btn btn-info btn-add-favorite" data-id='${
                  item.id
                }'>+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIE_PER_PAGE);
  let rawHTML = "";

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-id='${page}'>${page}</a></li>`;
  }

  paginator.innerHTML = rawHTML;
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);

  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經收藏!");
  }

  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;

  const page = Number(event.target.dataset.id);
  renderMovieList(getMovieByPage(page));
});

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keywords = searchInput.value.trim().toLowerCase();

  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keywords)) {
  //     filterMovies.push(movie);
  //   }
  // }

  filterMovies = movies.filter((movie) => {
    return movie.title.toLowerCase().includes(keywords);
  });

  if (filterMovies.length === 0) {
    return alert(`沒有符合 ${keywords}的電影`);
  }

  renderPaginator(filterMovies.length);
  renderMovieList(getMovieByPage(1));
});

axios
  .get(INDEX_URL)
  .then(function (response) {
    movies.push(...response.data.results);
    renderPaginator(movies.length);
    renderMovieList(getMovieByPage(1));
  })
  .catch(function (error) {
    console.log(error);
  });
