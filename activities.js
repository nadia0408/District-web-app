document.addEventListener('DOMContentLoaded', () => {
    // --- MOCK DATA ---
    const mockCarouselActivities = [
        {
            id: 'activity-carousel-1',
            imageUrl: 'images/E02.jpg', // Corrected from 'mages/'
            title: 'Zoreko - Best Deals',
            date: 'Ongoing',
            tag: 'Indoor Fun'
        },
        {
            id: 'activity-carousel-2',
            imageUrl: 'images/A01.jpg', // Corrected from '.jppg'
            title: 'Mojoland Extravaganza',
            date: '6 Jun - 6 Jul, 10:30AM',
            location: '54th Grand Trunk Rd, Sonipat',
            tag: 'Water Park'
        },
        {
            id: 'activity-carousel-3',
            imageUrl: 'images/E01.jpg', // Correct path
            title: 'Deals are Jumping this June at SKYJUMPER',
            date: 'Make your next jump count',
            tag: 'Trampoline'
        },
        {
            id: 'activity-carousel-4',
            imageUrl: 'images/E04.jpg',
            title: 'Atlantic Water World - Ride The Tide',
            date: 'All Summer',
            tag: 'Water Fun'
        },
        {
            id: 'activity-carousel-5',
            imageUrl: 'images/E03.jpg',
            title: 'EID Special Offer',
            date: 'From June 06th to 15th',
            tag: 'Festive Fun'
        }
    ];

    const mockAllActivities = [
        {
            id: 'activity-grid-1',
            imageUrl: 'images/AA01.jpg',
            date: '6 Jun - 30 Jun, 10AM',
            title: 'Worlds of Wonder (WOW) - Water Park',
            location: 'Worlds of Wonder, Noida',
            price: '₹799 onwards',
            category: 'Water Park',
            details: 'Enjoy thrilling water slides and a wave pool at WOW. Perfect for a family outing this summer. Multiple food courts available.'
        },
        {
            id: 'activity-grid-2',
            imageUrl: 'images/AA02.jpg',
            date: '6 Jun - 30 Jun, 10AM',
            title: 'Drizzling Land Water & Amusement Park | Ghaziabad',
            location: 'Drizzling Land, Ghaziabad',
            price: '₹650 onwards',
            category: 'Amusement & Water Park',
            details: 'Drizzling Land offers a mix of exciting rides and water attractions. Great for all age groups. Special offers on weekdays.'
        },
        {
            id: 'activity-grid-3',
            imageUrl: 'images/AA04.jpg',
            date: '6 Jun - 30 Jun, 10AM',
            title: 'Atlantic Water World',
            location: 'Atlantic Water World, Delhi/NCR',
            price: '₹899 onwards',
            category: 'Water Park',
            details: 'Dive into fun at Atlantic Water World with numerous slides and pools. Locker facilities and costumes available on rent.'
        },
        {
            id: 'activity-grid-4',
            imageUrl: 'images/AA05.png',
            date: '5 Jun - 18 Jun, 11AM',
            title: 'Museum of Illusions | New Delhi',
            location: 'Museum of Illusions, Delhi/NCR',
            price: '₹590 onwards',
            category: 'Museum',
            details: 'Experience mind-bending optical illusions and interactive exhibits. A fun and educational visit for everyone.'
        },
        {
            id: 'activity-rage-room', // For the single detail view example
            imageUrl: 'images/AA06.png',
            title: 'Rage Room | Delhi',
            category: 'Indoor Games',
            timing: 'March 22 | 10AM - August 30 | 10AM',
            location: 'Rage Room Delhi, Delhi',
            price: 'Starts from ₹350',
            offer: 'Get 20% off up to ₹250 + Exclusive bank offers!',
            about: 'A heart-pumping adventure in a room—smash, shatter, and unleash the thrill. Choose your weapon, pick your playlist, and let go of your stress in a safe and controlled environment. Perfect for individuals or groups looking for a unique experience.'
        }
    ];

    // --- DOM Elements ---
    const carouselContainer = document.getElementById('activityCarouselContainer');
    const carouselDotsContainer = document.getElementById('activityCarouselDots');
    const prevButton = document.getElementById('activityCarouselPrev');
    const nextButton = document.getElementById('activityCarouselNext');
    const allActivitiesContainer = document.getElementById('allActivitiesContainer');
    const singleActivityDetailView = document.getElementById('singleActivityDetailView');


    let currentCarouselIndex = 0;

    // --- Render Functions ---
    function renderActivityCarousel() {
        if (!carouselContainer) return;
        carouselContainer.innerHTML = '';
        if(carouselDotsContainer) carouselDotsContainer.innerHTML = '';

        mockCarouselActivities.forEach((activity, index) => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide'); // Use generic carousel-slide class
            // Add specific class for activity if needed: slide.classList.add('activity-carousel-slide');
            if (index === currentCarouselIndex) slide.classList.add('active');

            slide.innerHTML = `
                <img src="${activity.imageUrl}" alt="${activity.title}">
                <div class="carousel-caption">
                    ${activity.tag ? `<span class="carousel-tag">${activity.tag}</span>` : ''}
                    <h3>${activity.title}</h3>
                    <p>${activity.date} ${activity.location ? ' - ' + activity.location : ''}</p>
                </div>
            `;
            carouselContainer.appendChild(slide);

            if(carouselDotsContainer) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === currentCarouselIndex) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                carouselDotsContainer.appendChild(dot);
            }
        });
        updateCarouselTransform();
    }

    function updateCarouselTransform() { // Re-use from events.js if identical, or keep separate
        if (!carouselContainer) return;
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next', 'inactive');
            if (index === currentCarouselIndex) {
                slide.classList.add('active');
            } else if (index === (currentCarouselIndex - 1 + mockCarouselActivities.length) % mockCarouselActivities.length) {
                slide.classList.add('prev');
            } else if (index === (currentCarouselIndex + 1) % mockCarouselActivities.length) {
                slide.classList.add('next');
            } else {
                 slide.classList.add('inactive');
            }
        });
    }

    function goToSlide(index) {
        currentCarouselIndex = index;
        renderActivityCarousel();
    }

    function nextCarouselSlide() {
        currentCarouselIndex = (currentCarouselIndex + 1) % mockCarouselActivities.length;
        renderActivityCarousel();
    }

    function prevCarouselSlide() {
        currentCarouselIndex = (currentCarouselIndex - 1 + mockCarouselActivities.length) % mockCarouselActivities.length;
        renderActivityCarousel();
    }


    function renderAllActivities() {
        if (!allActivitiesContainer) return;
        allActivitiesContainer.innerHTML = '';
        mockAllActivities.filter(act => act.id !== 'activity-rage-room').forEach(activity => { // Exclude rage room from grid for now
            const card = document.createElement('div');
            card.classList.add('activity-card-item'); // New class for distinct styling
            card.innerHTML = `
                <div class="activity-image-container">
                    <img src="${activity.imageUrl}" alt="${activity.title}">
                </div>
                <div class="activity-details">
                    <p class="activity-date">${activity.date}</p>
                    <h3 class="activity-title">${activity.title}</h3>
                    <p class="activity-location">${activity.location}</p>
                    <p class="activity-price">${activity.price}</p>
                </div>
            `;
            // Add click listener to show detail view
            card.addEventListener('click', () => showSingleActivityDetail(activity.id));
            allActivitiesContainer.appendChild(card);
        });
    }

    function showSingleActivityDetail(activityId) {
        const activity = mockAllActivities.find(act => act.id === activityId);
        if (!activity || !singleActivityDetailView) return;

        // Hide carousel and grid
        if (document.querySelector('.activity-carousel-section')) document.querySelector('.activity-carousel-section').style.display = 'none';
        if (document.querySelector('.all-activities-section')) document.querySelector('.all-activities-section').style.display = 'none';
        
        singleActivityDetailView.innerHTML = `
            <button id="backToActivities" class="back-button">← Back to Activities</button>
            <div class="single-activity-header">
                <img src="${activity.imageUrl.replace('400x250', '800x300')}" alt="${activity.title}" class="single-activity-banner">
                <div class="single-activity-info-box">
                    <h2>${activity.title}</h2>
                    <p><span class="icon">🏷️</span> ${activity.category}</p>
                    <p><span class="icon">📅</span> ${activity.timing || activity.date}</p>
                    <p><span class="icon">📍</span> ${activity.location}</p>
                    <p class="price-info">Starts from <strong>${activity.price.replace('Starts from ', '')}</strong></p>
                    <button class="btn-book-activity">BOOK TICKETS</button>
                    ${activity.offer ? `<div class="activity-offer">${activity.offer}</div>` : ''}
                </div>
            </div>
            <div class="single-activity-content">
                <h3>About the Activity</h3>
                <p>${activity.about || activity.details || 'More details coming soon.'}</p>
            </div>
        `;
        singleActivityDetailView.style.display = 'block';

        document.getElementById('backToActivities').addEventListener('click', () => {
            singleActivityDetailView.style.display = 'none';
            if (document.querySelector('.activity-carousel-section')) document.querySelector('.activity-carousel-section').style.display = 'block'; // Or 'flex' if it was
            if (document.querySelector('.all-activities-section')) document.querySelector('.all-activities-section').style.display = 'block';
        });

        // Add event listener for the book tickets button (for future implementation)
        const bookButton = singleActivityDetailView.querySelector('.btn-book-activity');
        if (bookButton) {
            bookButton.addEventListener('click', () => {
                alert(`Booking for "${activity.title}" - This part needs to be implemented!`);
                // Here you would navigate to a seat selection / booking summary specific to activities
            });
        }
    }


    // --- Initial Render & Event Listeners ---
    if (carouselContainer) {
        renderActivityCarousel();
        if (prevButton) prevButton.addEventListener('click', prevCarouselSlide);
        if (nextButton) nextButton.addEventListener('click', nextCarouselSlide);
        // setInterval(nextCarouselSlide, 7000); // Auto-play
    }
    if (allActivitiesContainer) renderAllActivities();

    // Example: Directly show Rage Room detail if a specific hash is present or for testing
    // if(window.location.hash === '#rage-room') {
    //     showSingleActivityDetail('activity-rage-room');
    // }
});