document.addEventListener('DOMContentLoaded', () => {
    // --- DATA for the 3D Coverflow Carousel (Using your image URLs) ---
    const mockCarouselEvents = [
        {
            imageUrl: 'images/E01.jpg',
            title: 'Sky Jumper Trampoline Park | ILD',
            date: '6 Jun - 30 Jun, 11:30AM',
            location: 'SkyJumper, ILD Trade Centre, Gurugram',
            price: '₹360 onwards',
            link: '#'
        },
        {
            imageUrl: 'images/E02.jpg',
            title: 'Zoreko - Rcube Monad Mall',
            date: 'Everyday | 12PM - 10PM',
            location: 'Zoreko - Original Gamers, Delhi/NCR',
            price: '₹599 onwards',
            link: '#'
        },
        {
            imageUrl: 'images/E03.jpg',
            title: 'EID Special Offer',
            date: 'FROM JUNE 06TH TO 15TH, 2025',
            location: 'Multiple Venues',
            price: 'Special Prices',
            link: '#'
        },
        {
            imageUrl: 'images/E04.jpg',
            title: 'Ride The Tide | Atlantic Water World',
            date: 'Ongoing',
            location: 'Atlantic Water World, Delhi/NCR',
            price: '₹449 onwards',
            link: '#'
        },
        {
            imageUrl: 'images/E05.jpg',
            title: 'Art of Pottery Workshop',
            date: 'Every Weekend',
            location: 'Naveen Chhaya Pottery Studio, Delhi/NCR',
            price: '₹1570 onwards',
            link: '#'
        }
    ];

    // --- DATA for sections below (Using your image URLs) ---
    const mockArtists = [
        { id: 1, name: 'Baby J', imageUrl: 'images/E5.jpg' },
        { id: 2, name: 'Lil Pump', imageUrl: 'images/E1.jpg' },
        { id: 3, name: 'Louis CK', imageUrl: 'images/E3.jpg' },
        { id: 4, name: 'Radhika Das', imageUrl: 'images/E4.jpg' },
        { id: 5, name: 'Tye Turner', imageUrl: 'images/E2.jpg' }
    ];

    const mockAllEvents = [
        { id: 1, imageUrl: 'images/A3.png', date: '6 Jun - 30 Jun, 10AM', title: 'Worlds of Wonder (WOW) - Water Park', location: 'Worlds of Wonder, Noida', price: '₹799 onwards' },
        { id: 2, imageUrl: 'images/A2.jpg', date: '6 Jun - 30 Jun, 10AM', title: 'Atlantic Water World', location: 'Atlantic Water World, Delhi/NCR', price: '₹899 onwards' },
        { id: 3, imageUrl: 'images/A1.jpg', date: '6 Jun - 30 Jun, 10AM', title: 'Drizzling Land Water & Amusement Park | Ghaziabad', location: 'Drizzling Land, Ghaziabad', price: '₹650 onwards' },
        { id: 4, imageUrl: 'images/A4.jpg', date: '5 Jun - 18 Jun, 7:30PM', title: 'Museum of Illusions | New Delhi', location: 'Museum of Illusions, Delhi/NCR', price: '₹590 onwards' }
    ];

    // --- DOM Elements ---
    const carouselContainer = document.getElementById('eventCarouselContainer');
    const prevButton = document.getElementById('carouselPrev');
    const nextButton = document.getElementById('carouselNext');
    const activeSlideInfoContainer = document.getElementById('activeSlideInfo');
    const artistCardsContainer = document.getElementById('artistCardsContainer');
    const allEventsContainer = document.getElementById('allEventsContainer');

    if (!carouselContainer) return;

    let currentCarouselIndex = Math.floor(mockCarouselEvents.length / 2); // Start in the middle

    // --- Carousel Logic ---
    function updateCarousel() {
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        slides.forEach((slide, index) => {
            const offset = index - currentCarouselIndex;
            slide.className = 'carousel-slide'; // Reset classes

            if (offset === 0) slide.classList.add('active');
            else if (offset > 0 && offset <= 2) slide.classList.add(`next-${offset}`);
            else if (offset < 0 && offset >= -2) slide.classList.add(`prev-${Math.abs(offset)}`);
            else slide.classList.add('hidden-slide');
        });
        updateActiveSlideInfo();
    }

    function updateActiveSlideInfo() {
        const activeEvent = mockCarouselEvents[currentCarouselIndex];
        if (activeSlideInfoContainer) {
            activeSlideInfoContainer.innerHTML = `
                <a href="${activeEvent.link || '#'}" class="info-link" target="_blank">
                    <p class="date">${activeEvent.date}</p>
                    <h3 class="title">${activeEvent.title}</h3>
                    <p class="location">${activeEvent.location}</p>
                    <p class="price">${activeEvent.price}</p>
                </a>
            `;
        }
    }

    function buildCarousel() {
        mockCarouselEvents.forEach((event, index) => {
            const slide = document.createElement('div');
            slide.innerHTML = `<img src="${event.imageUrl}" alt="${event.title}">`;
            slide.addEventListener('click', () => {
                if (index !== currentCarouselIndex) {
                    currentCarouselIndex = index;
                    updateCarousel();
                }
            });
            carouselContainer.appendChild(slide);
        });
        updateCarousel();
    }

    // --- Other Render Functions ---
    function renderArtists() {
        if (!artistCardsContainer) return;
        artistCardsContainer.innerHTML = '';
        mockArtists.forEach(artist => {
            const card = document.createElement('div');
            card.classList.add('artist-card');
            card.innerHTML = `<img src="${artist.imageUrl}" alt="${artist.name}"><p>${artist.name}</p>`;
            artistCardsContainer.appendChild(card);
        });
    }

    function renderAllEvents() {
        if (!allEventsContainer) return;
        allEventsContainer.innerHTML = '';
        mockAllEvents.forEach(event => {
            const card = document.createElement('div');
            card.classList.add('event-card-item');
            card.innerHTML = `<div class="event-image-container"><img src="${event.imageUrl}" alt="${event.title}"></div><div class="event-details"><p class="event-date">${event.date}</p><h3 class="event-title">${event.title}</h3><p class="event-location">${event.location}</p><p class="event-price">${event.price}</p></div>`;
            allEventsContainer.appendChild(card);
        });
    }

    // --- Initial Render & Event Listeners ---
    buildCarousel();

    if (nextButton) nextButton.addEventListener('click', () => {
        currentCarouselIndex = (currentCarouselIndex + 1) % mockCarouselEvents.length;
        updateCarousel();
    });
    if (prevButton) prevButton.addEventListener('click', () => {
        currentCarouselIndex = (currentCarouselIndex - 1 + mockCarouselEvents.length) % mockCarouselEvents.length;
        updateCarousel();
    });

    renderArtists();
    renderAllEvents();
});