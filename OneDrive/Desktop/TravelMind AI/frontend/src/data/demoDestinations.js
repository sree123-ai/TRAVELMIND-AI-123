export const demoDestinations = [
  {
    id: "munnar",
    name: "Munnar",
    state: "Kerala",
    district: "Idukki",
    category: "Mountains & Nature",
    climate: "Cool (15°C – 22°C)",
    travelTime: "4.5 hrs from Kochi",
    estimatedCost: "₹12,000 – ₹18,000",
    rating: 4.9,
    reviewsCount: 1420,
    matchScore: 98,
    heroImage: "/assets/munnar_hero.jpg",
    galleryImages: [
      "/assets/munnar_hero.jpg",
      "/assets/vagamon_hills.jpg",
      "/assets/kerala_backwaters.jpg",
      "/assets/varkala_beach.jpg"
    ],
    tagline: "Emerald Tea Gardens & Misty Mountain Peaks",
    description: "Munnar is a breathtaking hill station in Kerala's Western Ghats, renowned for rolling tea plantations, cool mountain breeze, exotic flora including Neelakurinji blooms, and endangered Nilgiri Tahr wildlife.",
    aiReasoning: "Perfect match for your preference for scenic nature, cool mountain weather, family safety, and peaceful environment away from heavy traffic.",
    bestFor: ["Couples", "Family with Kids", "Seniors seeking cool breeze", "Photography"],
    
    // Coordinates for 3D Map
    latitude: 10.0889,
    longitude: 77.0595,
    placeId: "ChIJ8wT5i-eGATsR1Z5q8t3d5H8",

    attractions: [
      {
        name: "Eravikulam National Park",
        description: "Home of the endangered Nilgiri Tahr and Rajamala viewpoint.",
        fee: "₹200 per adult, ₹150 for children (Verified)",
        timing: "7:00 AM – 4:00 PM (Subject to seasonal calving)",
        bookingRequired: true,
        bookingUrl: "https://eravikulamnationalpark.in"
      },
      {
        name: "Mattupetty Dam & Lake",
        description: "Scenic reservoir with speed boating and tea hill views.",
        fee: "₹20 per person (Boating: ₹500 for 5 persons)",
        timing: "9:30 AM – 5:00 PM",
        bookingRequired: false,
        bookingUrl: "https://www.keralatourism.org/destination/mattupetty-dam-munnar/205"
      },
      {
        name: "Tata KDHP Tea Museum",
        description: "Centuries-old tea processing machinery and tea tasting sessions.",
        fee: "₹125 per adult, ₹40 for children",
        timing: "9:00 AM – 5:00 PM (Closed on Mondays)",
        bookingRequired: false,
        bookingUrl: "https://www.keralatourism.org/destination/tata-tea-museum-munnar/327"
      }
    ],

    weather: {
      temperature: "18°C",
      condition: "Partly Cloudy with Crisp Mountain Breeze",
      humidity: "68%",
      rainProbability: "15%",
      windSpeed: "11 km/h",
      periods: {
        morning: "14°C, Misty & Refreshing",
        afternoon: "21°C, Pleasant sunshine",
        evening: "17°C, Cool breeze",
        night: "12°C, Chilly, jacket recommended"
      }
    },

    packingSuggestions: [
      "Light woollens / fleece jacket for evening and early morning",
      "Sturdy walking shoes with good grip for tea garden trails",
      "Compact umbrella or waterproof windcheater",
      "Sunscreen and UV protective sunglasses",
      "Personal first-aid kit and prescribed motion-sickness medications for hill curves"
    ],

    ageSuitability: {
      children: "High (Safe tea garden strolls, boating, wildlife spotting)",
      adults: "Excellent (Trekking, photography, cycling, plantation walks)",
      seniors: "High (Comfortable resorts, fresh air; mild caution on steep trekking paths)",
      cautions: "Winding ghat roads may cause mild motion sickness; take anti-motion tablets if prone."
    },

    travelDetails: {
      nearestAirport: "Cochin International Airport (COK) - 110 km (~3.5 hrs by cab)",
      nearestRailway: "Aluva Railway Station (115 km) or Ernakulam Junction (130 km)",
      busConnectivity: "KSRTC Superfast buses run round-the-clock from Kochi, Kottayam, and Madurai",
      localTransport: "Private taxis (approx ₹2,200/day) or auto-rickshaws for short transfers",
      bestRoute: "NH 85 (Kochi-Dhanushkodi road via Kothamangalam & Adimali)"
    },

    thingsToAvoid: [
      "Avoid remote trekking without certified forest department guides.",
      "Do not feed or approach wild animals in National Park areas.",
      "Avoid visiting during heavy monsoon alerts (July-August) due to potential landslip warnings.",
      "General travel precaution information — not medical advice."
    ]
  },

  {
    id: "wayanad",
    name: "Wayanad",
    state: "Kerala",
    district: "Wayanad",
    category: "Waterfalls & Caves",
    climate: "Moderate (21°C – 26°C)",
    travelTime: "2.5 hrs from Kozhikode",
    estimatedCost: "₹10,000 – ₹16,000",
    rating: 4.8,
    reviewsCount: 1180,
    matchScore: 94,
    heroImage: "/assets/kerala_backwaters.jpg",
    galleryImages: [
      "/assets/kerala_backwaters.jpg",
      "/assets/munnar_hero.jpg",
      "/assets/vagamon_hills.jpg",
      "/assets/varkala_beach.jpg"
    ],
    tagline: "Lush Spice Valleys, Mystic Caves & Waterfalls",
    description: "Nestled in the Nilgiri Biosphere, Wayanad enchants travellers with prehistoric cave petroglyphs, expansive spice and coffee estates, earth dams, and cascading waterfalls.",
    aiReasoning: "Matches your criteria for outdoor exploration, authentic regional food, moderate climate, and excellent multi-generation friendly resorts.",
    bestFor: ["Nature Lovers", "Active Families", "Adventure Trekkers", "Food Explorers"],
    
    latitude: 11.6854,
    longitude: 76.1320,
    placeId: "ChIJq_j3XQ2WpzsR4qW5jCgT",

    attractions: [
      {
        name: "Edakkal Caves",
        description: "Neolithic stone age petroglyphs carved into a cliff cave split.",
        fee: "₹50 per adult, ₹30 for kids, camera fee ₹25",
        timing: "9:00 AM – 4:00 PM (Closed Mondays)",
        bookingRequired: false,
        bookingUrl: "https://www.keralatourism.org/destination/edakkal-caves-wayanad/147"
      },
      {
        name: "Banasura Sagar Dam",
        description: "Largest earthen dam in India set against pristine reservoir islands.",
        fee: "₹40 entry, ₹100 for speed boat ride",
        timing: "9:00 AM – 5:00 PM",
        bookingRequired: false,
        bookingUrl: "https://www.keralatourism.org/destination/banasura-sagar-dam/307"
      },
      {
        name: "Soochipara Waterfalls",
        description: "Three-tiered waterfall surrounded by dense deciduous forest.",
        fee: "₹80 entry fee per person",
        timing: "9:00 AM – 5:00 PM",
        bookingRequired: false,
        bookingUrl: "https://www.keralatourism.org/destination/soochipara-falls/252"
      }
    ],

    weather: {
      temperature: "24°C",
      condition: "Mild Breezy with Sunny Spells",
      humidity: "72%",
      rainProbability: "20%",
      windSpeed: "8 km/h",
      periods: {
        morning: "19°C, Fresh morning mist",
        afternoon: "27°C, Warm tropical sunshine",
        evening: "22°C, Gentle valley breeze",
        night: "18°C, Comfortable sleep climate"
      }
    },

    packingSuggestions: [
      "Comfortable breathable cotton clothes and walking trousers",
      "Water-resistant hiking shoes for cave steps and waterfall pathways",
      "Insect repellent cream for spice plantation strolls",
      "Sun hat and reusable water bottle",
      "Light jacket for higher altitude locations (Vythiri / Lakkidi)"
    ],

    ageSuitability: {
      children: "Moderate (Great at Banasura Dam, but steep climbing required for Edakkal Caves)",
      adults: "Excellent (Hiking, ziplining, bamboo rafting in Kuruva Island)",
      seniors: "Moderate (Resorts and dams are accessible; avoid steep cave summit steps)",
      cautions: "Cave trail involves 300+ stone steps with metal railings; elders should pace slowly."
    },

    travelDetails: {
      nearestAirport: "Calicut International Airport (CCJ) - 85 km (~2.5 hrs)",
      nearestRailway: "Kozhikode Railway Station (CLT) - 72 km",
      busConnectivity: "Frequent KSRTC and private buses from Bengaluru, Mysore, and Kozhikode",
      localTransport: "Jeeps and taxis available at Sulthan Bathery, Kalpetta, and Mananthavady",
      bestRoute: "NH 766 via Thamarassery Ghat Pass"
    },

    thingsToAvoid: [
      "Avoid night driving through forested forest checkpoint areas (traffic restricted 9PM - 6AM).",
      "Do not walk off-trail into private cardamom/coffee plantations without permission.",
      "General travel precaution information — not medical advice."
    ]
  },

  {
    id: "varkala",
    name: "Varkala",
    state: "Kerala",
    district: "Thiruvananthapuram",
    category: "Beach & Wellness",
    climate: "Warm Coastal (27°C – 32°C)",
    travelTime: "1 hr from Trivandrum",
    estimatedCost: "₹9,000 – ₹15,000",
    rating: 4.7,
    reviewsCount: 950,
    matchScore: 91,
    heroImage: "/assets/varkala_beach.jpg",
    galleryImages: [
      "/assets/varkala_beach.jpg",
      "/assets/padmanabhaswamy_temple.jpg",
      "/assets/munnar_hero.jpg",
      "/assets/kerala_backwaters.jpg"
    ],
    tagline: "Red Laterite Cliffs & Arabian Sea Sunsets",
    description: "Varkala is Kerala's unique coastal gem where towering red cliffs overlook the turquoise Arabian Sea. It is celebrated for cliff-top bohemian cafes, yoga retreats, safe swimming beaches, and the ancient Janardhana Swamy Temple.",
    aiReasoning: "Ideal for relaxation, sunset vistas, coastal seafood / vegetarian options, and calm seaside leisure without massive party crowds.",
    bestFor: ["Solo Travellers", "Couples", "Wellness & Yoga Enthusiasts", "Relaxation Seekers"],

    latitude: 8.7379,
    longitude: 76.7163,
    placeId: "ChIJ8QW-sWjRBzsR_Zl3gK-p9jE",

    attractions: [
      {
        name: "Varkala Cliff & Papanasam Beach",
        description: "Natural mineral spring waters believed to cleanse sins; iconic cliff promenade.",
        fee: "Free Public Beach Access",
        timing: "Open 24 hours (Lifeguards on duty 8:00 AM – 6:00 PM)",
        bookingRequired: false,
        bookingUrl: "https://www.keralatourism.org/destination/varkala-beach/106"
      },
      {
        name: "Janardhana Swamy Temple",
        description: "2,000-year-old historic Vaishnavite temple with Dutch bell architecture.",
        fee: "Free Entry (Traditional dress code applicable)",
        timing: "5:30 AM – 12:00 PM, 5:00 PM – 8:00 PM",
        bookingRequired: false,
        bookingUrl: "https://www.keralatourism.org/destination/janardhana-swamy-temple-varkala/107"
      },
      {
        name: "Kappil Beach & Backwater Estuary",
        description: "Serene meeting point of backwaters and Arabian sea with boating options.",
        fee: "Free entry (Boating ₹300 - ₹600)",
        timing: "6:00 AM – 7:00 PM",
        bookingRequired: false,
        bookingUrl: "https://www.keralatourism.org/destination/kappil-beach-backwaters/108"
      }
    ],

    weather: {
      temperature: "29°C",
      condition: "Warm & Sunny Coastal Breezes",
      humidity: "78%",
      rainProbability: "10%",
      windSpeed: "14 km/h",
      periods: {
        morning: "26°C, Pleasant sea breeze & sunrise",
        afternoon: "32°C, Hot sunny beach weather",
        evening: "28°C, Spectacular sunset with refreshing wind",
        night: "25°C, Warm tropical night"
      }
    },

    packingSuggestions: [
      "Lightweight linen and breathable cotton beachwear",
      "High SPF sunscreen and aloe vera after-sun gel",
      "Beach sandals and flip-flops",
      "Modest clothing for visiting the Janardhana Swamy Temple",
      "Sunglasses and a wide-brim straw hat"
    ],

    ageSuitability: {
      children: "High (Sandy beach play, safe shallow waters in designated flagged zones)",
      adults: "Excellent (Surfing, cliff cafe culture, Ayurvedic spa, sunset yoga)",
      seniors: "Moderate (Cliff stairs have steep flights; choose accommodations on north/south cliff level)",
      cautions: "Only swim in areas patrolled by certified Kerala Tourism lifeguards."
    },

    travelDetails: {
      nearestAirport: "Thiruvananthapuram International Airport (TRV) - 42 km (~1 hr)",
      nearestRailway: "Varkala Sivagiri Railway Station (VAK) - 3 km (major trains stop)",
      busConnectivity: "Direct KSRTC buses from Trivandrum, Kollam, and Ernakulam",
      localTransport: "Auto-rickshaws readily available at railway station and cliff areas",
      bestRoute: "NH 66 coastal highway via Attingal"
    },

    thingsToAvoid: [
      "Never swim after dusk or in unpatrolled rip-current zones.",
      "Stay well back from crumbling cliff edges, especially during selfie photography.",
      "General travel precaution information — not medical advice."
    ]
  }
];
