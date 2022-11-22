const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const movies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
const dataPanel = document.querySelector("#data-panel");

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
                <button class="btn btn-danger btn-remove-favorite" data-id='${
                  item.id
                }'>X</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}

function removeFromFavorits(id) {
  //防止 movies 是空陣列的狀況 (如果movies是空陣列要怎麼觸發這個函式?)
  if (!movies || !movies.length) return;
  //利用findIndex ()去尋找movies陣列中，電影id 與函式開頭代入的id 相同者，並回傳其在movies陣列中的位置，將其存入movieIndex的變數中
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  //防止 movieIndex 是空的狀況
  if (movieIndex === -1) return;
  // 使用splice()，將排序為movieIndex的資料，從movies陣列中移除
  movies.splice(movieIndex, 1);
  // 將新的movies 陣列存入localSTorage中
  localStorage.setItem("favoriteMovies", JSON.stringify(movies));
  //重新渲染頁面
  renderMovieList(movies);
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorits(Number(event.target.dataset.id));
  }
});

renderMovieList(movies);
