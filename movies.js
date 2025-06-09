document.addEventListener('DOMContentLoaded', () => {
    const moviesPageMainContent = document.getElementById('moviesPageMainContent');
    let allFetchedMovies = []; // Store all fetched movies
    let currentBooking = {};   // Store current booking process state

    const TMDB_API_KEY = '005f5ff6211ddd27011fe0e8b914b4af'; // Your API Key
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    const TMDB_IMAGE_BASE_URL_W500 = 'https://image.tmdb.org/t/p/w500';
    // const TMDB_IMAGE_BASE_URL_ORIGINAL = 'https://image.tmdb.org/t/p/original'; // Not currently used, but kept for potential future use

    const languageMap = {
        'en': 'English', 'hi': 'Hindi', 'ta': 'Tamil', 'te': 'Telugu',
        'ml': 'Malayalam', 'kn': 'Kannada', 'pa': 'Punjabi',
        'es': 'Spanish', 'fr': 'French', 'ja': 'Japanese', 'ko': 'Korean'
        // Add more common languages if needed
    };

    // --- MOCK DATA FOR ENHANCED BOOKING ---
    const mockCinemasData = [
        {
            id: 'cinema1',
            name: 'RR Cinema Omaxe Gurugram Mall, Sector 49, Gurugram',
            logo: 'https://via.placeholder.com/60x60/FF0000/FFFFFF?Text=RR',
            distance: '3.4 km away',
            cancellation: 'Non-cancellable',
            showtimes: [
                { time: '10:30 PM', screenType: 'DOLBY', availability: 'available' }
            ]
        },
        {
            id: 'cinema2',
            name: 'Cinepolis The Esplanade, Gurugram',
            logo: 'https://via.placeholder.com/60x60/0000FF/FFFFFF?Text=CP',
            distance: '3.5 km away',
            cancellation: 'Non-cancellable',
            showtimes: [
                { time: '10:00 PM', screenType: '4K LASER DOLBY 7.1', availability: 'filling-fast' },
                { time: '11:50 PM', screenType: '4K LASER DOLBY 7.1', availability: 'available' }
            ]
        },
        {
            id: 'cinema3',
            name: 'Ajay Devgn\'s NY Cinemas, Elan Epic Mall, Gurgaon',
            logo: 'https://via.placeholder.com/60x60/008000/FFFFFF?Text=NY',
            distance: '5.1 km away',
            cancellation: 'Allows cancellation',
            showtimes: [
                { time: '10:00 PM', screenType: 'LASER DOLBY ATMOS', availability: 'almost-full' }
            ]
        }
    ];

    // --- UI RENDERING STATES ---
    const VIEW_STATES = {
        MOVIE_GRID: 'movie_grid',
        MOVIE_SHOWTIMES: 'movie_showtimes',
        SEAT_SELECTION: 'seat_selection',
        BOOKING_SUMMARY: 'booking_summary'
    };
    let currentView = VIEW_STATES.MOVIE_GRID;

    function renderPage() {
        if (!moviesPageMainContent) {
            console.error("Main content container 'moviesPageMainContent' not found!");
            return;
        }
        moviesPageMainContent.innerHTML = ''; // Clear previous content

        switch (currentView) {
            case VIEW_STATES.MOVIE_GRID:
                renderMovieGridContainer();
                fetchNowShowingMovies();
                break;
            case VIEW_STATES.MOVIE_SHOWTIMES:
                if (currentBooking.movie) {
                    renderMovieShowtimesView(currentBooking.movie);
                } else {
                    console.error("No movie selected for showtimes view.");
                    currentView = VIEW_STATES.MOVIE_GRID; // Fallback
                    renderPage();
                }
                break;
            case VIEW_STATES.SEAT_SELECTION:
                 if (currentBooking.movie && currentBooking.cinema && currentBooking.showtime) {
                    renderSeatSelectionView(currentBooking.movie, currentBooking.cinema, currentBooking.showtime);
                } else {
                    console.error("Missing data for seat selection view.");
                    currentView = VIEW_STATES.MOVIE_SHOWTIMES; // Fallback
                    renderPage();
                }
                break;
            case VIEW_STATES.BOOKING_SUMMARY:
                if (currentBooking.movie && currentBooking.cinema && currentBooking.showtime && currentBooking.selectedSeatsInfo) {
                    renderBookingSummaryView();
                } else {
                    console.error("Missing data for booking summary view.");
                    currentView = VIEW_STATES.SEAT_SELECTION; // Fallback
                    renderPage();
                }
                break;
            default:
                renderMovieGridContainer();
                fetchNowShowingMovies();
        }
    }

    // --- MOVIE GRID (Initial View) ---
    function renderMovieGridContainer() {
        moviesPageMainContent.innerHTML = `
            <section class="now-showing-section">
                <h2>NOW SHOWING</h2>
                <div class="movie-grid-container" id="movieGridContainerInPage">
                    <div class="loading-indicator">Loading movies...</div>
                </div>
            </section>
        `;
    }

    async function fetchNowShowingMovies() {
        const gridContainer = document.getElementById('movieGridContainerInPage');
        if (!gridContainer) {
            console.warn("Movie grid container not found in DOM when trying to fetch movies.");
            return;
        }
        const loadingIndicator = gridContainer.querySelector('.loading-indicator');

        // Note: The check `TMDB_API_KEY === 'YOUR_TMDB_API_KEY'` is removed
        // because you've hardcoded your actual key. If you revert to a placeholder, add it back.
        if (!TMDB_API_KEY || TMDB_API_KEY === 'YOUR_TMDB_API_KEY_PLACEHOLDER') { // More robust check
             if (gridContainer) gridContainer.innerHTML = '<p class="error-message">TMDB API Key is missing or invalid in movies.js</p>';
             return;
        }

        if(loadingIndicator) loadingIndicator.style.display = 'block';

        try {
            // CORRECTED URL with '&' before region
            const response = await fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1®ion=IN`);

            if (!response.ok) {
                const errorText = await response.text(); // Get more details from API error
                console.error("API Error Response:", response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}. ${errorText}`);
            }
            const data = await response.json();
            if (data.results) {
                allFetchedMovies = data.results;
                renderMovieCards(allFetchedMovies, gridContainer);
            } else {
                console.warn("No 'results' field in API response:", data);
                if (gridContainer) gridContainer.innerHTML = '<p>No movies found or API error.</p>';
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            if (gridContainer) gridContainer.innerHTML = `<p class="error-message">Could not fetch movies. ${error.message}. Check console.</p>`;
        } finally {
            if(loadingIndicator) loadingIndicator.style.display = 'none';
        }
    }

    function renderMovieCards(movies, container) {
        if (!container) return;
        container.innerHTML = ''; // Clear loading

        if (!movies || movies.length === 0) {
            container.innerHTML = '<p>No movies currently showing.</p>';
            return;
        }
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card-item');
            movieCard.dataset.movieId = movie.id;

            const posterUrl = movie.poster_path ? `${TMDB_IMAGE_BASE_URL_W500}${movie.poster_path}` : 'https://via.placeholder.com/500x750/CCCCCC/000000?Text=No+Poster';
            const certification = movie.adult ? 'A' : 'UA';
            const languageName = languageMap[movie.original_language] || movie.original_language.toUpperCase();

            movieCard.innerHTML = `
                <div class="movie-poster-container">
                    <img src="${posterUrl}" alt="${movie.title}">
                </div>
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${certification} | ${languageName}</p>
                </div>
            `;
            movieCard.addEventListener('click', () => {
                const selectedMovie = allFetchedMovies.find(m => m.id.toString() === movie.id.toString());
                if (selectedMovie) {
                    currentBooking = { movie: selectedMovie, date: new Date().toISOString().split('T')[0] };
                    currentView = VIEW_STATES.MOVIE_SHOWTIMES;
                    renderPage();
                } else {
                    console.error("Selected movie not found in fetched list:", movie.id);
                }
            });
            container.appendChild(movieCard);
        });
    }

    // --- MOVIE SHOWTIMES VIEW (Step 1 of new flow) ---
    function renderMovieShowtimesView(movie) {
        const mockDuration = "2 hr 1 min"; // TMDB doesn't provide runtime in /now_playing easily
        let dateScrollerHtml = '<div class="date-scroller">';
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const day = date.toLocaleDateString('en-US', { day: 'numeric' });
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
            const monthName = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const fullDate = date.toISOString().split('T')[0];
            const isActive = fullDate === currentBooking.date;
            dateScrollerHtml += `
                <div class="date-item ${isActive ? 'active' : ''}" data-date="${fullDate}">
                    <span class="date-day-num">${day}</span>
                    <span class="date-day-name">${dayName}</span>
                    ${i === 0 ? `<span class="date-month">${monthName}</span>` : ''}
                </div>`;
        }
        dateScrollerHtml += '</div>';

        let cinemasHtml = mockCinemasData.map(cinema => `
            <div class="cinema-listing">
                <div class="cinema-info">
                    <img src="${cinema.logo}" alt="${cinema.name} logo" class="cinema-logo">
                    <div>
                        <h4>${cinema.name}</h4>
                        <p class="cinema-meta">${cinema.distance} | ${cinema.cancellation}</p>
                    </div>
                </div>
                <div class="showtime-slots">
                    ${cinema.showtimes.map(st => `
                        <button class="showtime-slot-btn" data-cinema-id="${cinema.id}" data-time="${st.time}" data-screen="${st.screenType}" data-availability="${st.availability}">
                            ${st.time}
                            <span class="showtime-screen">${st.screenType}</span>
                            <span class="showtime-availability-dot ${st.availability}"></span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `).join('');

        moviesPageMainContent.innerHTML = `
            <div class="movie-showtimes-page">
                <button id="backToGridBtn" class="back-button">← All Movies</button>
                <div class="movie-details-header">
                    <img src="${movie.poster_path ? TMDB_IMAGE_BASE_URL_W500 + movie.poster_path : 'https://via.placeholder.com/150x225?text=No+Poster'}" alt="${movie.title}" class="details-movie-poster">
                    <div class="details-movie-info">
                        <h1>${movie.title}</h1>
                        <p>${movie.adult ? 'A' : 'UA'} | ${languageMap[movie.original_language] || movie.original_language.toUpperCase()} | ${mockDuration}</p>
                        <button class="btn-outline">View details</button>
                    </div>
                </div>
                ${dateScrollerHtml}
                <div class="filters-bar">
                    <button class="filter-btn dropdown"> <span class="icon">🔧</span> Filters <span class="arrow">▼</span></button>
                    <button class="filter-btn">After 10 PM</button>
                    <button class="filter-btn">Wheelchair Friendly</button>
                    <button class="filter-btn">Recliners</button>
                    <button class="filter-btn">Premium Seats</button>
                </div>
                <div class="availability-legend">
                    <span class="legend-item"><span class="dot available"></span> Available</span>
                    <span class="legend-item"><span class="dot filling-fast"></span> Filling fast</span>
                    <span class="legend-item"><span class="dot almost-full"></span> Almost full</span>
                </div>
                <div class="cinema-listings-container">
                    ${cinemasHtml}
                </div>
            </div>
        `;

        document.getElementById('backToGridBtn').addEventListener('click', () => {
            currentView = VIEW_STATES.MOVIE_GRID;
            renderPage();
        });

        document.querySelectorAll('.date-item').forEach(item => {
            item.addEventListener('click', (e) => {
                currentBooking.date = e.currentTarget.dataset.date;
                document.querySelectorAll('.date-item.active').forEach(active => active.classList.remove('active'));
                e.currentTarget.classList.add('active');
                // In a real app, you'd filter or re-fetch mockCinemasData based on the new date.
                // For now, it just visually updates the active date.
                console.log(`Date changed to: ${currentBooking.date}. Cinema showtimes would update here if backend connected.`);
            });
        });

        document.querySelectorAll('.showtime-slot-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const cinemaId = e.currentTarget.dataset.cinemaId;
                currentBooking.cinema = mockCinemasData.find(c => c.id === cinemaId);
                currentBooking.showtime = {
                    time: e.currentTarget.dataset.time,
                    screenType: e.currentTarget.dataset.screen,
                    pricePerTicket: { PREMIUM: 180, KIDS: 120 } // Example categories
                };
                currentBooking.tickets = 10;
                currentView = VIEW_STATES.SEAT_SELECTION;
                renderPage();
            });
        });
    }

    // --- SEAT SELECTION VIEW (Step 2 of new flow) ---
    function renderSeatSelectionView(movie, cinema, showtime) {
        const seatCategories = [
            { name: 'PREMIUM', price: (showtime.pricePerTicket && showtime.pricePerTicket.PREMIUM) || 180, rows: ['R', 'Q', 'P', 'O', 'N', 'M'] },
            { name: 'KIDS', price: (showtime.pricePerTicket && showtime.pricePerTicket.KIDS) || 120, rows: ['B', 'A'] }
        ];
        // ... (rest of the seat selection HTML generation and logic from your previous correct version) ...
        // This part is quite long, so I'm truncating for brevity here.
        // Ensure the full logic for seatMapHtml, event listeners for seats, ticketQtySelect, etc., is present.

        // Example start of seatMapHtml (ensure you have the full version)
        let seatMapHtml = `<div class="seat-selection-page">
            <div class="seat-selection-header">
                <button id="backToShowtimesBtnSeat" class="back-button">←</button>
                <div>
                    <h3>${movie.title}</h3>
                    <p>${new Date(currentBooking.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })} | ${showtime.time} at ${cinema.name.split(',')[0]}</p>
                </div>
                <div class="ticket-count-selector">
                     <label for="ticketQty">Tickets:</label>
                     <select id="ticketQty">
                        ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${n === (currentBooking.tickets || 10) ? 'selected' : ''}>${n}</option>`).join('')}
                     </select>
                </div>
            </div>
            <div class="seat-map-area">`;

        // FULL SEAT MAP GENERATION LOGIC HERE (from your last working version)
        // ...
        seatCategories.forEach(category => {
            seatMapHtml += `<div class="seat-category-section">
                                <p class="seat-category-price">${category.name}: ₹${category.price}</p>`;
            category.rows.forEach(rowLetter => {
                seatMapHtml += `<div class="seat-row-layout">
                                    <span class="row-identifier">${rowLetter}</span>
                                    <div class="seats-group left">`;
                let seatsToRenderLeft = 0;
                let seatStartNumberLeft = 0;

                if (['R', 'Q', 'P', 'O', 'N', 'M'].includes(rowLetter)) {
                    seatsToRenderLeft = 10;
                    seatStartNumberLeft = 10; // R10, R9...
                } else if (['B', 'A'].includes(rowLetter)) {
                    seatsToRenderLeft = 13;
                    seatStartNumberLeft = 22; // B22, B21... or A26, A25...
                    if (rowLetter === 'A') seatStartNumberLeft = 26;
                }

                for (let i = 0; i < seatsToRenderLeft; i++) {
                    const seatNumDisplay = seatStartNumberLeft - i;
                    const seatId = `${rowLetter}${seatNumDisplay}`;
                    const isBooked = Math.random() < 0.15;
                    seatMapHtml += `<div class="seat ${isBooked ? 'booked' : 'available'}" data-seat-id="${seatId}" data-price="${category.price}" data-category="${category.name}">${seatNumDisplay}</div>`;
                }
                seatMapHtml += `</div>`; // End left group

                if (['R', 'Q', 'P', 'O', 'N', 'M'].includes(rowLetter)) {
                    seatMapHtml += `<div class="seats-group right">`;
                    let seatsToRenderRight = 0;
                    let seatStartNumberRight = 0;
                    if (rowLetter === 'R') { seatsToRenderRight = 2; seatStartNumberRight = 2;} // R1,R2
                    else if (rowLetter === 'Q') { seatsToRenderRight = 4; seatStartNumberRight = 4;} //Q4,Q3..
                    else if (rowLetter === 'P') { seatsToRenderRight = 2; seatStartNumberRight = 2;}
                    else if (rowLetter === 'O') { seatsToRenderRight = 2; seatStartNumberRight = 2;}
                    else if (rowLetter === 'N') { seatsToRenderRight = 2; seatStartNumberRight = 2;}
                    else if (rowLetter === 'M') { seatsToRenderRight = 2; seatStartNumberRight = 2;}


                    for (let i = 0; i < seatsToRenderRight; i++) {
                        const seatNumDisplay = seatStartNumberRight - i;
                        const seatId = `${rowLetter}${seatNumDisplay}`;
                        const isBooked = Math.random() < 0.1;
                        const isWheelchair = (rowLetter === 'Q' && (seatNumDisplay === 4 || seatNumDisplay === 3)); // Example
                        const isNoSeat = (rowLetter === 'Q' && seatNumDisplay === 0 ); // Example for a gap

                        if(isNoSeat) {
                             seatMapHtml += `<div class="seat no-seat"></div>`;
                        } else {
                            seatMapHtml += `<div class="seat ${isBooked ? 'booked' : 'available'} ${isWheelchair ? 'wheelchair' : ''}" data-seat-id="${seatId}" data-price="${category.price}" data-category="${category.name}">${seatNumDisplay}</div>`;
                        }
                    }
                    seatMapHtml += `</div>`; // End right group
                }
                seatMapHtml += `</div>`; // End seat-row-layout
            });
            seatMapHtml += `</div>`; // End seat-category-section
        });

        seatMapHtml += `</div>
                        <div class="screen-this-way-visual"><div></div></div>
                        <p class="screen-indicator-text">SCREEN THIS WAY</p>
                        <div class="seat-legend modern">
                            <span class="legend-item"><span class="seat-indicator available"></span> Available</span>
                            <span class="legend-item"><span class="seat-indicator occupied"></span> Occupied</span>
                            <span class="legend-item"><span class="seat-indicator selected"></span> Selected</span>
                            <span class="legend-item"><span class="seat-indicator wheelchair-legend"><img src="https://img.icons8.com/ios-filled/15/000000/wheelchair.png" alt="wheelchair"/></span> Wheelchair</span>
                        </div>
                        <button id="proceedToSummaryBtnNew" class="btn-primary-seat" disabled>Pay ₹0</button>
                      </div>`;
        moviesPageMainContent.innerHTML = seatMapHtml;
        currentBooking.selectedSeatsInfo = currentBooking.selectedSeatsInfo || []; // Ensure it's initialized

        const ticketQtySelect = document.getElementById('ticketQty');
        const proceedBtn = document.getElementById('proceedToSummaryBtnNew');

        function updateTotalAndButton() {
            const numTickets = parseInt(ticketQtySelect.value);
            let totalPrice = 0;
            currentBooking.selectedSeatsInfo.forEach(seat => totalPrice += seat.price);

            proceedBtn.textContent = `Pay ₹${totalPrice.toFixed(2)}`;
            proceedBtn.disabled = currentBooking.selectedSeatsInfo.length !== numTickets || numTickets === 0;
        }

        document.querySelectorAll('.seat.available').forEach(seatEl => {
            seatEl.addEventListener('click', () => {
                if (seatEl.classList.contains('no-seat') || seatEl.classList.contains('booked')) return;

                const seatId = seatEl.dataset.seatId;
                const price = parseFloat(seatEl.dataset.price);
                const category = seatEl.dataset.category;
                const maxSeats = parseInt(ticketQtySelect.value);
                const isSelected = currentBooking.selectedSeatsInfo.some(s => s.id === seatId);

                if (isSelected) {
                    seatEl.classList.remove('selected');
                    currentBooking.selectedSeatsInfo = currentBooking.selectedSeatsInfo.filter(s => s.id !== seatId);
                } else {
                    if (currentBooking.selectedSeatsInfo.length < maxSeats) {
                        seatEl.classList.add('selected');
                        currentBooking.selectedSeatsInfo.push({ id: seatId, price: price, category: category });
                    } else {
                        alert(`You can only select up to ${maxSeats} seat(s). Change ticket quantity if needed.`);
                    }
                }
                updateTotalAndButton();
            });
        });

        ticketQtySelect.addEventListener('change', () => {
            currentBooking.tickets = parseInt(ticketQtySelect.value);
            if (currentBooking.selectedSeatsInfo.length > currentBooking.tickets) {
                while (currentBooking.selectedSeatsInfo.length > currentBooking.tickets) {
                    const seatToDeselect = currentBooking.selectedSeatsInfo.shift();
                    const seatEl = document.querySelector(`.seat[data-seat-id="${seatToDeselect.id}"]`);
                    if (seatEl) seatEl.classList.remove('selected');
                }
            }
            updateTotalAndButton();
        });

        document.getElementById('backToShowtimesBtnSeat').addEventListener('click', () => {
            currentView = VIEW_STATES.MOVIE_SHOWTIMES;
            renderPage();
        });
        proceedBtn.addEventListener('click', () => {
            currentBooking.totalAmount = currentBooking.selectedSeatsInfo.reduce((sum, seat) => sum + seat.price, 0);
            currentView = VIEW_STATES.BOOKING_SUMMARY;
            renderPage();
        });
        updateTotalAndButton(); // Initial state
    }


    // --- BOOKING SUMMARY VIEW (Step 3 of new flow) ---
    function renderBookingSummaryView() {
        const movie = currentBooking.movie;
        const cinema = currentBooking.cinema;
        const showtime = currentBooking.showtime;
        const seats = currentBooking.selectedSeatsInfo.map(s => s.id).join(', ');
        const numTickets = currentBooking.tickets;
        const orderAmount = currentBooking.totalAmount;
        const taxesAndFees = orderAmount * 0.12; // Mock 12% tax
        const toBePaid = orderAmount + taxesAndFees;

        moviesPageMainContent.innerHTML = `
            <div class="booking-summary-page">
                <div class="summary-header">
                    <button id="backToSeatsBtnSummary" class="back-button">←</button>
                    <h3>Review your booking</h3>
                    <span></span> <!-- Spacer for centering title -->
                </div>
                <div class="summary-content-wrapper">
                    <div class="booking-details-column">
                        <div class="summary-movie-card">
                            <img src="${movie.poster_path ? TMDB_IMAGE_BASE_URL_W500 + movie.poster_path : 'https://via.placeholder.com/80x120?text=Poster'}" alt="${movie.title}">
                            <div>
                                <h4>${movie.title}</h4>
                                <p>${movie.adult ? 'A' : 'UA'} | ${languageMap[movie.original_language]} | 2D</p>
                                <p>${cinema.name.split(',')[0]}${cinema.name.split(',')[1] ? ', ' + cinema.name.split(',')[1] : ''}</p>
                            </div>
                        </div>
                        <div class="summary-show-info">
                            <p><strong>Today, ${new Date(currentBooking.date).toLocaleDateString('en-US', {day: 'numeric', month: 'short'})}</strong> | ${showtime.time}</p>
                            <p><strong>${numTickets} Tickets</strong> - ${currentBooking.selectedSeatsInfo.map(s => s.category + " - " + s.id).join(', ')}</p>
                            <p class="total-ticket-price">₹${orderAmount.toFixed(2)}</p>
                        </div>
                        <div class="cancellation-info">
                            <p><span class="icon">ℹ️</span> This theatre ${cinema.cancellation === 'Non-cancellable' ? 'doesn\'t allow' : 'allows'} cancellation</p>
                        </div>
                        <div class="offers-section">
                            <h4>Offers <a href="#" class="see-all">See all</a></h4>
                            <div class="offer-item">
                                <img src="https://via.placeholder.com/20x20/27AE60/FFFFFF?Text=%" alt="offer icon">
                                <div>
                                    <p>Flat ₹50 OFF</p>
                                    <span>Save ₹50 with this code</span>
                                </div>
                                <button class="apply-btn">Apply</button>
                            </div>
                        </div>
                         <div class="food-beverages-section">
                            <h4>Food and beverages <a href="#" class="see-all">See all</a></h4>
                            <!-- Add F&B items here if needed -->
                        </div>
                    </div>
                    <div class="payment-summary-column">
                        <h4>Payment summary</h4>
                        <div class="payment-line-item"><span>Order amount</span><span>₹${orderAmount.toFixed(2)}</span></div>
                        <div class="payment-line-item">
                            <span>Taxes & fees <span class="arrow-dropdown">▼</span></span>
                            <span>₹${taxesAndFees.toFixed(2)}</span>
                        </div>
                        <hr>
                        <div class="payment-line-item to-be-paid">
                            <span>To be paid</span>
                            <span>₹${toBePaid.toFixed(2)}</span>
                        </div>
                        <h4>Your details <a href="#" class="edit-link">Edit</a></h4>
                        <div class="user-details-summary">
                            <p><span class="icon">📞</span> +91-9555XXXXXX</p>
                            <p><span class="icon">📍</span> Delhi</p>
                        </div>
                        <div class="terms-conditions">
                            <p><span class="icon">❓</span> Terms and conditions <span class="arrow-right">→</span></p>
                        </div>
                        <div class="final-payment-action">
                            <div class="total-payable-bottom">₹${toBePaid.toFixed(2)} TOTAL</div>
                            <button class="proceed-to-pay-btn">Proceed To Pay</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('backToSeatsBtnSummary').addEventListener('click', () => {
            currentView = VIEW_STATES.SEAT_SELECTION;
            renderPage();
        });

        document.querySelector('.proceed-to-pay-btn').addEventListener('click', () => {
            alert('Proceeding to actual payment gateway (mocked). Booking successful!');
            currentView = VIEW_STATES.MOVIE_GRID;
            renderPage();
        });
    }

    // --- Initial Page Load ---
    renderPage();
});