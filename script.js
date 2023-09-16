document.addEventListener('DOMContentLoaded', function () {
    const apiKeyInput = document.getElementById('api-key');
    const movieTitleInput = document.getElementById('movie-title');
    const searchButton = document.getElementById('search-button');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const resultsContainer = document.getElementById('results');

    function showLoader() {
        loader.classList.remove('hidden');
    }

    function hideLoader() {
        loader.classList.add('hidden');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function clearError() {
        errorMessage.textContent = '';
        errorMessage.classList.add('hidden');
    }

    async function fetchMovies(apiKey, title) {
        showLoader();
        clearError();
        resultsContainer.innerHTML = '';

        const apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${encodeURIComponent(apiKey)}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.Response === 'True') {
                data.Search.forEach((movie) => {
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('movie-card');
                    const poster = movie.Poster !== 'N/A' ? movie.Poster : 'no-poster.png';
                    movieCard.innerHTML = `
                        <img src="${poster}" alt="${movie.Title}">
                        <p>${movie.Title} (${movie.Year})</p>
                        <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank">More Details</a>
                    `;
                    resultsContainer.appendChild(movieCard);
                });
            } else {
                showError(data.Error);
            }
        } catch (error) {
            showError('An error occurred. Please try again later.');
        }

        hideLoader();
    }

    searchButton.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        const movieTitle = movieTitleInput.value.trim();

        if (apiKey === '' || movieTitle === '') {
            showError('Both API Key and Movie Title are required.');
        } else {
            fetchMovies(apiKey, movieTitle);
        }
    });
});
