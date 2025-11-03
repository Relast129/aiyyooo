// Tour Packages - Load from API
const API_BASE = '/api';

// Default packages (fallback)
const defaultPackages = [
    {
        id: 1,
        title: "🚗 Cultural Explorer – Heritage Tour",
        duration: "7 Days",
        subtitle: "Focus: Heritage, Temples, Ancient Cities | Ideal For: Families, Solo Travelers, Couples, Culture Lovers",
        priceOriginal: 520,
        priceCurrent: 375,
        transport: [
            "A/C Private vehicle + driver for 7 days",
            "Fuel, tolls, parking included",
            "Airport pick-up & drop-off",
            "Optional stopovers & flexible schedule"
        ],
        image: "images/Sigiriya Rock.jpg",
        imageAlt: "Sigiriya Rock Fortress - Cultural Explorer Tour",
        itinerary: [
            {
                day: 1,
                title: "🛬 Colombo Airport → Negombo",
                activities: [
                    "Airport pick-up and hotel transfer",
                    "Optional: Dutch Canal & Fort exploration",
                    "Boat ride in Negombo Lagoon",
                    "Relax at Negombo Beach"
                ]
            },
            {
                day: 2,
                title: "🏛 Negombo → Yapahuwa → Anuradhapura",
                activities: [
                    "Climb Yapahuwa Rock Fortress",
                    "Visit Anuradhapura Ancient City (bicycles available)",
                    "Sunset at Mihintale Temple"
                ]
            },
            {
                day: 3,
                title: "🏯 Anuradhapura → Polonnaruwa → Sigiriya",
                activities: [
                    "Explore Polonnaruwa Ancient Ruins (bike rental available)",
                    "Local rice & curry lunch",
                    "Optional evening village tour by bullock cart or tuk-tuk"
                ]
            },
            {
                day: 4,
                title: "⛰ Sigiriya → Dambulla → Kandy",
                activities: [
                    "Sunrise climb at Sigiriya Lion Rock Fortress",
                    "Visit Dambulla Cave Temple",
                    "Visit Matale Spice Garden",
                    "Cultural dance show in Kandy (evening)"
                ]
            },
            {
                day: 5,
                title: "🛕 Full Day in Kandy",
                activities: [
                    "Visit Temple of the Tooth Relic",
                    "Walk around Kandy Lake",
                    "Visit Royal Botanical Garden – Peradeniya",
                    "Optional local market or gem museum stop"
                ]
            },
            {
                day: 6,
                title: "🏙 Kandy → Colombo",
                activities: [
                    "Optional: Pinnawala Elephant Orphanage",
                    "Optional: Ambuluwawa Tower",
                    "Colombo city drive (Galle Face, Gangaramaya Temple, Independence Square)"
                ]
            },
            {
                day: 7,
                title: "✈ Departure",
                activities: [
                    "Transfer to airport based on flight time"
                ]
            }
        ],
        images: "Suggested Images: Sigiriya Rock Fortress, Anuradhapura Ancient City, Temple of the Tooth Kandy, Polonnaruwa Ruins"
    },
    {
        id: 2,
        title: "🐚 Ultimate Sri Lanka – Mixed Tour",
        duration: "7 Days",
        subtitle: "Focus: Balanced mix of Culture, Nature, Wildlife & Beach | Ideal For: Families, Couples, Anyone wanting \"everything\"",
        priceOriginal: 600,
        priceCurrent: 500,
        transport: [
            "Private A/C vehicle & driver",
            "Full round trip from airport and back",
            "Fuel, highway tolls, waiting time included"
        ],
        image: "images/Nine-Arch-Bridge-Ella-Sri-Lanka-35-1.jpg",
        imageAlt: "Nine Arch Bridge Ella - Ultimate Sri Lanka Tour",
        itinerary: [
            {
                day: 1,
                title: "🛬 Colombo Airport → Negombo",
                activities: [
                    "Lagoon boat tour",
                    "Negombo Dutch Fort and beach sunset"
                ]
            },
            {
                day: 2,
                title: "🦁 Negombo → Sigiriya",
                activities: [
                    "Climb Sigiriya Rock Fortress",
                    "Optional: Village tour with catamaran ride",
                    "Visit Dambulla Cave Temple en route"
                ]
            },
            {
                day: 3,
                title: "🛕 Sigiriya → Kandy",
                activities: [
                    "Visit Matale Spice Garden",
                    "Explore Temple of the Tooth Relic",
                    "Evening Cultural Dance Show"
                ]
            },
            {
                day: 4,
                title: "🍃 Kandy → Nuwara Eliya",
                activities: [
                    "Tea plantation & factory tour",
                    "Visit Ramboda Falls",
                    "Free evening at Gregory Lake"
                ]
            },
            {
                day: 5,
                title: "🚆 Nuwara Eliya → Ella (Train Ride)",
                activities: [
                    "Scenic train to Ella",
                    "Walk to Nine Arches Bridge",
                    "Hike Little Adam's Peak",
                    "Optional: Zipline experience"
                ]
            },
            {
                day: 6,
                title: "🦁 Ella → Yala Safari → Mirissa",
                activities: [
                    "Early morning Yala Safari (book separately)",
                    "Transfer to Mirissa",
                    "Sunset at Coconut Tree Hill"
                ]
            },
            {
                day: 7,
                title: "🏝 Mirissa → Galle → Colombo",
                activities: [
                    "Visit Galle Dutch Fort",
                    "Optional: Turtle Hatchery stop",
                    "Transfer to Colombo Airport"
                ]
            }
        ],
        addons: [
            "Safari jeep booking assistance",
            "Train ticket booking (with surcharge)",
            "Hotel suggestions (no booking)",
            "Daily WhatsApp support"
        ],
        images: "Suggested Images: Ella Nine Arches Bridge, Yala Safari Leopard, Mirissa Beach, Tea Plantations Nuwara Eliya, Galle Fort"
    },
    {
        id: 3,
        title: "🚙 10-Day Guided Transportation Package",
        duration: "10 Days",
        subtitle: "Travel by eco-friendly Toyota Prius with a knowledgeable guide. Ideal for individuals or small groups seeking comfortable, hassle-free transport.",
        priceOriginal: 750,
        priceCurrent: 535,
        transport: [
            "Eco-friendly travel in a comfortable Toyota Prius",
            "Experienced local guide for smooth transfers and insider tips",
            "Flexible for individuals or small groups",
            "Explore at your own pace with recommended activities",
            "Hassle-free transport between Sri Lanka's must-see spots"
        ],
        image: "images/Yala Park Safari.jpg",
        imageAlt: "Yala National Park Safari - 10-Day Guided Tour",
        itinerary: [
            {
                day: 1,
                title: "Colombo → Negombo",
                description: "Start your journey with a smooth transfer from bustling Colombo to the tranquil coastal town of Negombo. Explore Negombo's famous lagoon, sandy beaches, and vibrant fishing harbor."
            },
            {
                day: 2,
                title: "Negombo → Anuradhapura",
                description: "Travel north to Anuradhapura, the ancient capital of Sri Lanka. Discover well-preserved ruins, sacred stupas, and serene meditation spots."
            },
            {
                day: 3,
                title: "Anuradhapura → Sigiriya",
                description: "Head to Sigiriya where the iconic Lion Rock Fortress awaits. Explore the fortress climb, beautiful frescoes, and surrounding gardens."
            },
            {
                day: 4,
                title: "Sigiriya → Dambulla → Kandy",
                description: "Visit the stunning Dambulla Cave Temple, then continue to Kandy, the cultural heart of Sri Lanka. Stroll around Kandy Lake or visit the Temple of the Tooth."
            },
            {
                day: 5,
                title: "Kandy → Nuwara Eliya",
                description: "Drive through lush tea plantations and misty mountains to the \"Little England\" of Sri Lanka. Enjoy cool weather, botanical gardens, and colonial architecture."
            },
            {
                day: 6,
                title: "Nuwara Eliya → Horton Plains → Nuwara Eliya",
                description: "Morning transfer to Horton Plains National Park, home to the breathtaking \"World's End\" cliff and scenic nature trails."
            },
            {
                day: 7,
                title: "Nuwara Eliya → Ella",
                description: "Travel to the laid-back mountain town of Ella. Take in panoramic views, visit the Nine Arches Bridge, or hike to Ella Rock."
            },
            {
                day: 8,
                title: "Ella → Yala National Park",
                description: "Transfer to Yala, a haven for wildlife enthusiasts. Prepare for your own safari adventure (optional and not included)."
            },
            {
                day: 9,
                title: "Yala → Galle",
                description: "Drive to the historic fortified city of Galle. Explore its charming streets, colonial architecture, artisan shops, and ocean views."
            },
            {
                day: 10,
                title: "Galle → Colombo",
                description: "Complete your journey with a transfer back to Colombo. Enjoy a city tour, visit local markets, or prepare for your onward travel."
            }
        ],
        images: "Suggested Images: Horton Plains World's End, Ella Rock View, Yala National Park Wildlife, Colombo City, Toyota Prius on scenic road"
    }
];

// Load packages from API
async function loadPackages() {
    try {
        console.log('Loading packages from API...');
        const response = await fetch(`${API_BASE}/packages?active=true`);
        const result = await response.json();
        
        console.log('Packages API response:', result);
        
        if (result.success && result.data && result.data.length > 0) {
            console.log(`Found ${result.data.length} active packages`);
            renderPackages(result.data);
        } else {
            console.log('No packages from API, using defaults');
            renderPackages(defaultPackages);
        }
    } catch (error) {
        console.error('Error loading packages:', error);
        renderPackages(defaultPackages);
    }
}

// Render packages
function renderPackages(packages) {
    const container = document.getElementById('packages-container');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing content
    
    packages.forEach(pkg => {
        const packageHTML = `
            <div class="package-card">
                <div class="package-header">
                    <div class="package-badge">${pkg.duration}</div>
                    <h3 class="package-title">${pkg.title}</h3>
                    <p class="package-subtitle">${pkg.subtitle}</p>
                </div>
                
                <div class="package-image">
                    <img src="${pkg.image}" alt="${pkg.imageAlt}" class="package-img" loading="lazy">
                    <div class="package-image-overlay"></div>
                </div>
                
                <div class="package-content">
                    <div class="package-features">
                        <h4>🚘 ${pkg.id === 3 ? "What's Included:" : "Included Transport Service:"}</h4>
                        <ul>
                            ${pkg.transport.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="package-itinerary">
                        <h4>🗓 Itinerary Highlights:</h4>
                        ${pkg.itinerary.map(day => `
                            <div class="itinerary-day">
                                <div class="day-number">Day ${day.day}</div>
                                <div class="day-content">
                                    <h5>${day.title}</h5>
                                    ${day.description ? `<p>${day.description}</p>` : ''}
                                    ${day.activities ? `
                                        <ul>
                                            ${day.activities.map(activity => `<li>${activity}</li>`).join('')}
                                        </ul>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    ${pkg.addons ? `
                        <div class="package-addons">
                            <h4>🌟 Optional Add-Ons:</h4>
                            <ul>
                                ${pkg.addons.map(addon => `<li>${addon}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    <div class="package-pricing">
                        <div class="price-container">
                            <span class="price-original">$${pkg.priceOriginal}</span>
                            <span class="price-current">$${pkg.priceCurrent}</span>
                            <span class="price-label">per couple</span>
                        </div>
                        <button class="btn btn-primary btn-book" data-whatsapp="Hi! I'm interested in the ${pkg.title.replace(/[🚗🐚🚙]/g, '').trim()} ($${pkg.priceCurrent}). Can you provide more details?">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            Book via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += packageHTML;
    });
    
    // Add WhatsApp click handlers
    document.querySelectorAll('.btn-book').forEach(btn => {
        btn.addEventListener('click', function() {
            const message = this.getAttribute('data-whatsapp');
            const whatsappUrl = `https://wa.me/94768118780?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadPackages);
