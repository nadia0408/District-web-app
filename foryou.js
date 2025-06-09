document.addEventListener('DOMContentLoaded', () => {
    const previousHitsContainer = document.getElementById('previousHitsContainer');
    const bestAmusementsContainer = document.getElementById('bestAmusementsContainer');

    // IMPORTANT: Replace 'YOUR_TMDB_API_KEY' with your actual TMDB API Key
    // (Same key as used in movies.js)
    const TMDB_API_KEY = '005f5ff6211ddd27011fe0e8b914b4af'; // <--- PUT YOUR KEY HERE
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    const languageMap = {
        'en': 'English', 'hi': 'Hindi', 'ta': 'Tamil', 'te': 'Telugu',
        'ml': 'Malayalam', 'kn': 'Kannada', 'pa': 'Punjabi',
        'es': 'Spanish', 'fr': 'French', 'ja': 'Japanese', 'ko': 'Korean'
    };

    // --- Fetch Previous Movie Hits (from TMDB) ---
    async function fetchPreviousHits() {
        if (TMDB_API_KEY === 'YOUR_TMDB_API_KEY') {
            previousHitsContainer.innerHTML = '<p class="error-message">Please add your TMDB API Key in foryou.js</p>';
            return;
        }
        const loadingIndicator = previousHitsContainer.querySelector('.loading-indicator');
        if(loadingIndicator) loadingIndicator.style.display = 'block';

        try {
            // Fetch popular movies as "previous hits" - you can change to /movie/top_rated
            const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1®ion=IN`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            renderMovies(data.results.slice(0, 6), previousHitsContainer); // Show first 6 popular movies
        } catch (error) {
            console.error("Error fetching previous hits:", error);
            previousHitsContainer.innerHTML = `<p class="error-message">Could not fetch previous hits. ${error.message}</p>`;
        } finally {
            if(loadingIndicator) loadingIndicator.style.display = 'none';
        }
    }

    function renderMovies(movies, container) {
        const movieCardsContainer = container; // The passed container itself will hold the cards directly
        movieCardsContainer.innerHTML = ''; // Clear loading indicator or previous content

        if (!movies || movies.length === 0) {
            movieCardsContainer.innerHTML = '<p>No movies found.</p>';
            return;
        }

        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card-item'); // Use the same styling as movies page for consistency

            const posterUrl = movie.poster_path
                ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
                : 'https://via.placeholder.com/300x450/CCCCCC/000000?Text=No+Poster';

            const certification = movie.adult ? 'A' : 'UA'; // Simplified
            const languageName = languageMap[movie.original_language] || movie.original_language.toUpperCase();
            const languageDisplay = languageName; // For simplicity, not adding "and X more"

            movieCard.innerHTML = `
                <div class="movie-poster-container">
                    <img src="${posterUrl}" alt="${movie.title}">
                </div>
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${certification} | ${languageDisplay}</p>
                </div>
            `;
            movieCardsContainer.appendChild(movieCard);
        });
    }

    // --- Mock Data for Best Amusements (similar to events.js) ---
    const mockAmusements = [
        {
            id: 'amusement1',
            imageUrl: 'images/A1.jpg',
            title: 'Super Fun Zone Park',
            category: 'Amusement Park',
            location: 'City Center, Mumbai'
        },
        {
            id: 'amusement2',
            imageUrl: 'images/A2.jpg',
            title: 'Aqua Splash Water World',
            category: 'Water Park',
            location: 'North Suburbs, Mumbai'
        },
        {
            id: 'amusement3',
            imageUrl: 'images/A3.png',
            title: 'Adventure Kingdom Trails',
            category: 'Adventure Sports',
            location: 'Hillside Area, Mumbai'
        },
        {
            id: 'amusement4',
            imageUrl: 'images/A4.jpg',
            title: 'Go Karting Speedway',
            category: 'Racing',
            location: 'Industrial Area, Mumbai'
        },
         {
            id: 'amusement5',
            imageUrl: 'images/A5.jpg',
            title: 'The Great Mystery Escape',
            category: 'Escape Room',
            location: 'Downtown, Mumbai'
        }
    ];

    function renderAmusements() {
        const amusementCardsContainer = bestAmusementsContainer;
        amusementCardsContainer.innerHTML = ''; // Clear loading indicator

        mockAmusements.forEach(amusement => {
            const card = document.createElement('div');
            card.classList.add('amusement-card-item'); // New class for amusement styling
            card.innerHTML = `
                <div class="amusement-image-container">
                    <img src="${amusement.imageUrl}" alt="${amusement.title}">
                </div>
                <div class="amusement-details">
                    <h3 class="amusement-title">${amusement.title}</h3>
                    <p class="amusement-category">${amusement.category}</p>
                    <p class="amusement-location">${amusement.location}</p>
                </div>
            `;
            amusementCardsContainer.appendChild(card);
        });
    }

    // --- Initial Fetch and Render ---
    if (previousHitsContainer) fetchPreviousHits();
    if (bestAmusementsContainer) renderAmusements();
});