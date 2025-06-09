document.addEventListener('DOMContentLoaded', () => {
    // --- MOCK DATA FOR THE "FOR YOU" PAGE ---

    // Data based on the first screenshot for "Hits from Previous Weeks"
    const mockHits = [
        {
            imageUrl: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-Qmhvb2wgQ2h1ayBNYWFm,fs-29,co-FFFFFF,ly-610,lx-24,pa-8_0_0_0,l-end/et00398679-btyywuakxl-portrait.jpg',
            title: 'Bhool Chuk Maaf',
            details: 'UA13+ | Hindi'
        },
        {
            imageUrl: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-TWlzc2lvbjogSW1wb3NzaWJsZSAtIERlYWQgUmVja29uaW5nIFBhcnQgT25l,fs-29,co-FFFFFF,ly-610,lx-24,pa-8_0_0_0,l-end/et00329482-muwzwsbqdensure-portrait.jpg',
            title: 'Mission Impossible - The Final Reckoning',
            details: 'UA13+ | English and 1 more'
        },
        {
            imageUrl: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RmluYWwgRGVzdGluYXRpb246IEJsb29kbGluZXM%3D,fs-29,co-FFFFFF,ly-610,lx-24,pa-8_0_0_0,l-end/et00396024-roqgqjxdje-portrait.jpg',
            title: 'Final Destination: Bloodlines',
            details: 'A | English and 1 more'
        },
        {
            imageUrl: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-S2FyYXRlIEtpZA%3D%3D,fs-29,co-FFFFFF,ly-610,lx-24,pa-8_0_0_0,l-end/et00309736-toqjwpqrbe-portrait.jpg',
            title: 'Karate Kid: Legends',
            details: 'UA13+ | English and 1 more'
        }
    ];

    // Data for "Best Amusements" - using placeholders as in the screenshot
    const mockAmusements = [
        {
            imageUrl: 'https://via.placeholder.com/250x375/3498DB/FFFFFF?Text=Water+Park+Fun'
        },
        {
            imageUrl: 'https://via.placeholder.com/250x375/E74C3C/FFFFFF?Text=Trampoline+Madness'
        },
        {
            imageUrl: 'https://via.placeholder.com/250x375/F1C40F/000000?Text=Go+Karting'
        },
        {
            imageUrl: 'https://via.placeholder.com/250x375/2ECC71/FFFFFF?Text=Adventure+Zone'
        }
    ];

    // --- DOM Elements ---
    const hitsContainer = document.getElementById('hitsContainer');
    const amusementsContainer = document.getElementById('amusementsContainer');

    // --- Render Functions ---
    function renderHits() {
        if (!hitsContainer) return;
        hitsContainer.innerHTML = '';
        mockHits.forEach(hit => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${hit.imageUrl}" alt="${hit.title}">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${hit.title}</h3>
                    <p class="card-details">${hit.details}</p>
                </div>
            `;
            hitsContainer.appendChild(card);
        });
    }

    function renderAmusements() {
        if (!amusementsContainer) return;
        amusementsContainer.innerHTML = '';
        mockAmusements.forEach(amusement => {
            const card = document.createElement('div');
            card.className = 'amusement-card';
            card.innerHTML = `
                <img src="${amusement.imageUrl}" alt="Amusement Park">
            `;
            amusementsContainer.appendChild(card);
        });
    }

    // --- Initial Render ---
    renderHits();
    renderAmusements();
});