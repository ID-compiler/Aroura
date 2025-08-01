import React from 'react'

const products = [
  // Digital Artworks
  {
  id: 1,
  name: "Crimson Muse",
  category: "digital",
  image: "/digi_art/digi_art1.png",
  price: "₹2,500",
  numericPrice: 2500,
  description: "A dramatic portrait of a woman immersed in a bed of roses. This moody red-toned piece evokes themes of beauty, sorrow, and mystique.",
  features: ["4K Resolution", "Printable Format", "Commercial License", "Emotionally Evocative"],
  rating: "★★★★☆"
},
{
  id: 2,
  name: "Love Beyond Death",
  category: "digital",
  image: "/digi_art/digi_art2.webp",
  price: "₹3,000",
  numericPrice: 3000,
  description: "A haunting yet tender portrait of eternal love—this skeletal figure surrounded by roses echoes emotions carved into the forgotten walls of ancient forts, hidden behind spiderwebs. A true tribute to undying connection.",
  features: ["Gothic Romance", "Symbolic Composition", "Poster Ready", "Emotional Depth"],
  rating: "★★★★★"
},
{
  id: 3,
  name: "Golden Swamp Deer",
  category: "digital",
  image: "/digi_art/digi_art3.webp",
  price: "₹3,500",
  numericPrice: 3500,
  description: "A majestic swamp deer basking in golden light amidst lush surroundings. This serene scene captures the essence of positivity, peace, and natural elegance.",
  features: ["Wildlife Focus", "Uplifting Mood", "Nature Vibes", "Printable in 4K"],
  rating: "★★★★★"
},
{
  id: 4,
  name: "Fractured Face",
  category: "digital",
  image: "/digi_art/digi_art4.webp",
  price: "₹2,800",
  numericPrice: 2800,
  description: "A colorful, abstract portrait where geometric lines fragment the face into an explosion of emotion and chaos.",
  features: ["Abstract Composition", "Bold Color Palette", "Digital Portrait", "High Resolution"],
  rating: "★★★★☆"
},
{
  id: 5,
  name: "Soft Blossom",
  category: "digital",
  image: "/digi_art/digi_art5.webp",
  price: "₹4,000",
  numericPrice: 4000,
  description: "A tender pastel portrait of a girl with soft lighting and floral accents, evoking calm and innocence.",
  features: ["Pastel Aesthetic", "High Detail", "Printable", "Commercial Use"],
  rating: "★★★★★"
},
{
  id: 6,
  name: "Steel & Rose",
  category: "digital",
  image: "/digi_art/digi_art6.webp",
  price: "₹3,200",
  numericPrice: 3200,
  description: "A striking monochrome hand clutching roses with a splash of blood red—symbolic and edgy.",
  features: ["Monochrome + Color Pop", "Tattoo-Inspired", "Emotionally Powerful", "Print Ready"],
  rating: "★★★★☆"
},
{
  id: 7,
  name: "Blush Whisper",
  category: "digital",
  image: "/digi_art/digi_art7.webp",
  price: "₹3,800",
  numericPrice: 3800,
  description: "A romantic soft-focus portrait of a young woman with floral accents and a vintage charm.",
  features: ["Vintage Mood", "Soft Palette", "High Detail", "Print Quality"],
  rating: "★★★★☆"
},
{
  id: 8,
  name: "Golden Gaze",
  category: "digital",
  image: "/digi_art/digi_art8.webp",
  price: "₹4,500",
  numericPrice: 4500,
  description: "A regal digital portrait adorned with traditional jewelry, celebrating cultural heritage and elegance.",
  features: ["Cultural Style", "Warm Tones", "HD Portrait", "Poster Ready"],
  rating: "★★★★★"
},
{
  id: 9,
  name: "Modern Maharani",
  category: "digital",
  image: "/digi_art/digi_art9.webp",
  price: "₹2,900",
  numericPrice: 2900,
  description: "A bold, modern Indian muse portrayed in vibrant colors and fashionable sunglasses. This artwork blends pop culture with traditional elegance—a tribute to empowered femininity.",
  features: ["Indian Pop Fusion", "Vibrant Palette", "Modern Muse Aesthetic", "Print Ready"],
  rating: "★★★★☆"
},
{
  id: 10,
  name: "Travel Motion",
  category: "digital",
  image: "/digi_art/digi_art10.png",
  price: "₹4,200",
  numericPrice: 4200,
  description: "Inspired by the iconic film *Chennai Express*, this vivid artwork captures a cinematic moment on an Indian train—rich with movement, color, and emotion.",
  features: ["Movie-Inspired", "Desi Vibes", "High Detail", "Urban Transport Scene"],
  rating: "★★★★☆"
},
{
  id: 11,
  name: "Rain-Kissed Beauty",
  category: "digital",
  image: "/digi_art/digi_art11.png",
  price: "₹2,500",
  numericPrice: 2500,
  description: "A beautiful portrait of a woman with wet hair, capturing a delicate, rainy mood. Her expression conveys softness and strength.",
  features: ["Portrait Style", "Wet Hair Detail", "Soft Expression", "4K Quality"],
  rating: "★★★★☆"
},
{
  id: 12,
  name: "Skull of Love",
  category: "digital",
  image: "/digi_art/digi_art12.webp",
  price: "₹3,000",
  numericPrice: 3000,
  description: "A symbolic digital piece showing a hand holding a skull with roses — a reflection of love beyond death.",
  features: ["Symbolic Art", "Skull and Roses", "Love and Death Theme", "Dark Palette"],
  rating: "★★★★☆"
},
{
  id: 13,
  name: "Femme Fatale",
  category: "digital",
  image: "/digi_art/digi_art13.webp",
  price: "₹3,500",
  numericPrice: 3500,
  description: "A high-contrast digital portrait of a fierce and expressive woman with bold red lips and piercing eyes.",
  features: ["Bold Makeup", "Digital Glam", "Sharp Detail", "Print Ready"],
  rating: "★★★★★"
},
{
  id: 14,
  name: "Ocean Huntress",
  category: "digital",
  image: "/digi_art/digi_art14.webp",
  price: "₹2,800",
  numericPrice: 2800,
  description: "A fiery pirate queen standing strong by the sea — perfect for lovers of ocean legends and nautical tales.",
  features: ["Ocean Theme", "Pirate Concept", "Fantasy Female", "Illustrated Style"],
  rating: "★★★★☆"
},
{
  id: 15,
  name: "Dreamscape Vision",
  category: "digital",
  image: "/digi_art/digi_art15.webp",
  price: "₹4,000",
  numericPrice: 4000,
  description: "A whimsical artwork full of colors, capturing the raw essence of unfiltered imagination and freedom.",
  features: ["Surreal Elements", "Vibrant Color Scheme", "Abstract Style", "Print Ready"],
  rating: "★★★★☆"
},
{
  id: 16,
  name: "Silhouette of Silence",
  category: "digital",
  image: "/digi_art/digi_art16.webp",
  price: "₹3,200",
  numericPrice: 3200,
  description: "A minimalist silhouette artwork of a woman, evoking mystery and quiet strength through shadows.",
  features: ["Minimalist Design", "Strong Silhouette", "Poster Friendly", "Monochrome Style"],
  rating: "★★★★☆"
},
{
  id: 17,
  name: "Water Fairy in Bloom",
  category: "digital",
  image: "/digi_art/digi_art17.webp",
  price: "₹3,800",
  numericPrice: 3800,
  description: "A fantasy portrait of a water fairy in radiant hues — a symbol of beauty, grace, and nature’s magic.",
  features: ["Fantasy Theme", "Fairy Design", "Magical Palette", "Watercolor Style"],
  rating: "★★★★☆"
},
{
  id: 18,
  name: "Mind on Fire",
  category: "digital",
  image: "/digi_art/digi_art18.webp",
  price: "₹4,500",
  numericPrice: 4500,
  description: "An explosion of color and form from the mind of a dreamer — dynamic, chaotic, and beautiful.",
  features: ["Expressionist Style", "Bold Colors", "Creative Explosion", "Digital Print"],
  rating: "★★★★★"
},
{
  id: 19,
  name: "Tea Time Surrealism",
  category: "digital",
  image: "/digi_art/digi_art19.webp",
  price: "₹2,900",
  numericPrice: 2900,
  description: "A surreal take on ordinary moments, where time, space, and objects twist into a whimsical reality.",
  features: ["Surreal Composition", "Tea Party Concept", "Bright Colors", "Fantasy Detail"],
  rating: "★★★★☆"
},
{
  id: 20,
  name: "Crosshatch Mind",
  category: "digital",
  image: "/digi_art/digi_art20.webp",
  price: "₹4,200",
  numericPrice: 4200,
  description: "An intricate portrait built with hatching lines and layered strokes — a masterclass in digital penwork.",
  features: ["Hatching Technique", "Linework Art", "High Detail", "Monoline Style"],
  rating: "★★★★☆"
},
{
  id: 21,
  name: "Posture Muse",
  category: "digital",
  image: "/digi_art/digi_art21.webp",
  price: "₹2,500",
  numericPrice: 2500,
  description: "A minimalistic digital artwork ideal for posters or banners. Clean lines and artistic pose reflect elegance and simplicity.",
  features: ["Poster Friendly", "Modern Style", "Printable Format", "High Resolution"],
  rating: "★★★☆☆"
},
{
  id: 22,
  name: "Golden Haze Landscape",
  category: "digital",
    "image": "/digi_art/digi_art22.webp",
    "price": "₹3,000",
    "numericPrice": 3000,
    "description": "A warm-toned digital landscape evoking feelings of sunset serenity. Perfect for living spaces or meditative corners.",
    "features": ["Warm Palette", "HD Quality", "Instant Download", "Print Ready"],
    "rating": "★★★★☆"
  },
  {
    "id": 23,
    "name": "Haunted Portrait",
    "category": "digital",
    "image": "/digi_art/digi_art23.webp",
    "price": "₹3,500",
    "numericPrice": 3500,
    "description": "A stylized, ghostly figure looking straight at you—perfect for eerie settings or gothic collectors.",
    "features": ["Gothic Tone", "Atmospheric", "High Contrast", "Dark Aesthetic"],
    "rating": "★★★★☆"
  },
  {
    "id": 24,
    "name": "Oceanbound Heart",
    "category": "digital",
    "image": "/digi_art/digi_art24.webp",
    "price": "₹2,800",
    "numericPrice": 2800,
    "description": "Inspired by love for oceans and pirate adventures, this piece brings sea and romance together.",
    "features": ["Oceanic Theme", "Adventure Mood", "High Quality", "Perfect for Nautical Walls"],
    "rating": "★★★☆☆"
  },
  {
    "id": 25,
    "name": "Vivid Imagination",
    "category": "digital",
    "image": "/digi_art/digi_art25.webp",
    "price": "₹4,000",
    "numericPrice": 4000,
    "description": "An artistic burst of color and shapes that capture the mind’s most wild and boundless imagination.",
    "features": ["Vibrant Colors", "Creative Composition", "Abstract Art", "High Resolution"],
    "rating": "★★★★★"
  },
  {
    "id": 26,
    "name": "Digital Swordsman - Zoro Tribute",
    "category": "digital",
    "image": "/digi_art/digi_art26.webp",
    "price": "₹3,200",
    "numericPrice": 3200,
    "description": "A fierce tribute to Roronoa Zoro, the legendary swordsman. For anime lovers and One Piece fans.",
    "features": ["Anime Style", "Tribute Art", "Detailed Illustration", "Print Ready"],
    "rating": "★★★★★"
  },
  {
    "id": 27,
    "name": "Luffy’s Dream",
    "category": "digital",
    "image": "/digi_art/digi_art27.webp",
    "price": "₹3,800",
    "numericPrice": 3800,
    "description": "A youthful portrayal of Monkey D. Luffy, capturing his dreams of being King of Pirates since childhood.",
    "features": ["Anime Theme", "Luffy Tribute", "HD Artwork", "For One Piece Fans"],
    "rating": "★★★★☆"
  },
  {
    "id": 28,
    "name": "Nami’s Treasure",
    "category": "digital",
    "image": "/digi_art/digi_art28.webp",
    "price": "₹4,500",
    "numericPrice": 4500,
    "description": "A fantasy-style tribute to Monkey D. Luffy featuring elements that will please Nami lovers too.",
    "features": ["Fantasy Pirate Art", "Nami-Inspired Details", "Vibrant Style", "Perfect for Fans"],
    "rating": "★★★★★"
  },
  {
    "id": 29,
    "name": "Modern Muse 3",
    "category": "digital",
    "image": "/digi_art/digi_art29.webp",
    "price": "₹2,900",
    "numericPrice": 2900,
    "description": "An expressive piece portraying a modern Indian muse with textured layers and cultural abstraction.",
    "features": ["Textured Finish", "Indian Muse Vibes", "High Contrast", "Print Ready"],
    "rating": "★★★★☆"
  },
  {
    "id": 30,
    "name": "Expressive Chaos",
    "category": "digital",
    "image": "/digi_art/digi_art30.webp",
    "price": "₹4,200",
    "numericPrice": 4200,
    "description": "A dynamic art inspired by the movie Chennai Express—vibrant, dramatic, and full of movement.",
    "features": ["Movie Inspired", "Bold Colors", "Energetic Mood", "Perfect for Home Decor"],
    "rating": "★★★★☆"
  },
  {
    "id": 31,
    "name": "Digital Symmetry",
    "category": "digital",
    "image": "/digi_art/digi_art31.webp",
    "price": "₹3,800",
    "numericPrice": 3800,
    "description": "A symmetrical abstract art using futuristic tones and geometric balance for visual harmony.",
    "features": ["Symmetry Design", "Modern Aesthetic", "High Quality", "Decorative"],
    "rating": "★★★☆☆"
  },
  {
    "id": 32,
    "name": "Fantasy Enchanted Grove",
    "category": "digital",
    "image": "/digi_art/digi_art32.webp",
    "price": "₹4,500",
    "numericPrice": 4500,
    "description": "A magical grove with fairytale vibes and glowing flora. Whimsical and mysterious.",
    "features": ["Fantasy Theme", "Glowing Lights", "Whimsical Touch", "High Detail"],
    "rating": "★★★★★"
  },
  {
    "id": 33,
    "name": "Muse of Time",
    "category": "digital",
    "image": "/digi_art/digi_art33.webp",
    "price": "₹2,900",
    "numericPrice": 2900,
    "description": "An art piece reflecting emotional depth and heritage through modern abstract visuals.",
    "features": ["Cultural Touch", "Time-Inspired", "Abstract Muse", "Print Ready"],
    "rating": "★★★★☆"
  },
  {
    "id": 34,
    "name": "Hatched Space",
    "category": "digital",
    "image": "/digi_art/digi_art34.webp",
    "price": "₹4,200",
    "numericPrice": 4200,
    "description": "A digital masterpiece using the hatching art form to represent cosmic energy and layered texture.",
    "features": ["Hatching Technique", "Cosmic Style", "Layered Detail", "Printable Format"],
    "rating": "★★★★☆"
  },



  // Merchandise Products

  {
    "id": 41,
    "name": "BITS Globe Tee",
    "category": "merch",
    "image": "/merchandise/merch1.png",
    "price": "₹799",
    "numericPrice": 799,
    "description": "T-shirt representing BITS Pilani as a global platform rooted in India, designed with cultural and modern symbolism.",
    "features": ["High Quality Cotton", "Unisex Fit", "BITS Branding", "Durable Print"],
    "rating": "★★★★☆"
  },
  {
    "id": 42,
    "name": "BITS Launch Tower Tee",
    "category": "merch",
    "image": "/merchandise/merch2.png",
    "price": "₹849",
    "numericPrice": 849,
    "description": "Creative representation of BITS as a launchpad for innovation and international growth, proudly made in India.",
    "features": ["Unique Print", "Soft Fabric", "Cultural Roots", "Modern Design"],
    "rating": "★★★★☆"
  },
  {
    "id": 43,
    "name": "BITS Skyline Tee",
    "category": "merch",
    "image": "/merchandise/merch3.png",
    "price": "₹849",
    "numericPrice": 849,
    "description": "Minimalist illustration of BITS Pilani with a message of rising from Indian roots to global impact.",
    "features": ["Premium Fabric", "BITS Identity", "Comfort Fit", "Minimalist Art"],
    "rating": "★★★☆☆"
  },
  {
    "id": 44,
    "name": "Launchpad Logo Set",
    "category": "merch",
    "image": "/merchandise/merch4.webp",
    "price": "₹999",
    "numericPrice": 999,
    "description": "Logo tee and mug set representing the Launchpad entrepreneurial spirit at BITS.",
    "features": ["Combo Pack", "High Print Quality", "Startup Culture", "Gift Ready"],
    "rating": "★★★★☆"
  },
  {
    "id": 45,
    "name": "Launchpad Hoodie Set",
    "category": "merch",
    "image": "/merchandise/merch5.webp",
    "price": "₹1,299",
    "numericPrice": 1299,
    "description": "Cozy hoodie and mug set for the Launchpad community, designed for founders and dreamers.",
    "features": ["Winter Wear", "Soft Hoodie", "Launchpad Logo", "Mug Included"],
    "rating": "★★★★★"
  },
  {
    "id": 46,
    "name": "BITS Tech Logo Set",
    "category": "merch",
    "image": "/merchandise/merch6.webp",
    "price": "₹999",
    "numericPrice": 999,
    "description": "Merchandise set featuring the bold tech-inspired Launchpad logo on a tee and mug.",
    "features": ["Black T-Shirt", "Mug Combo", "BITS Club Branding", "Tech Style"],
    "rating": "★★★★☆"
  },
  {
    "id": 47,
    "name": "Desi Snacker Sneakers",
    "category": "merch",
    "image": "/merchandise/sho1.png",
    "price": "₹2,999",
    "numericPrice": 2999,
    "description": "Colorful sneakers inspired by Indian childhood snacks and street flavors, playful and nostalgic.",
    "features": ["Snack Theme", "Durable Sole", "Vivid Colors", "Youthful Vibe"],
    "rating": "★★★★★"
  },
  {
    "id": 48,
    "name": "Astronaut Moon Walkers",
    "category": "merch",
    "image": "/merchandise/sho2.png",
    "price": "₹3,299",
    "numericPrice": 3299,
    "description": "Sneakers with a clean space aesthetic and moon explorer astronaut graphics.",
    "features": ["Space Theme", "White Base", "Astronaut Print", "Lightweight"],
    "rating": "★★★★☆"
  },
  {
    "id": 49,
    "name": "Red Orbit Runners",
    "category": "merch",
    "image": "/merchandise/sho3.png",
    "price": "₹3,499",
    "numericPrice": 3499,
    "description": "Bold red sneakers with cosmic detailing, perfect for dreamers and stargazers.",
    "features": ["Red Base", "Futuristic Design", "Astronaut Vibe", "Stylish Look"],
    "rating": "★★★★☆"
  },
  {
    "id": 50,
    "name": "Floating Astronaut Kicks",
    "category": "merch",
    "image": "/merchandise/sho4.png",
    "price": "₹3,599",
    "numericPrice": 3599,
    "description": "Featuring an astronaut floating in deep space, these sneakers scream exploration.",
    "features": ["Floating Art", "Galaxy-Inspired", "Premium Finish", "Comfort Insole"],
    "rating": "★★★★★"
  },
  {
    "id": 51,
    "name": "Ronaldo Speedstrike White",
    "category": "merch",
    "image": "/merchandise/sho5.jpg",
    "price": "₹3,699",
    "numericPrice": 3699,
    "description": "White limited-edition shoes with iconic Cristiano Ronaldo silhouette—perfect for fans.",
    "features": ["Ronaldo Print", "Football Vibes", "Signature Design", "Supportive Fit"],
    "rating": "★★★★★"
  },
  {
    "id": 52,
    "name": "CR7 Action Sneakers",
    "category": "merch",
    "image": "/merchandise/sho6.jpg",
    "price": "₹3,699",
    "numericPrice": 3699,
    "description": "Celebrate Cristiano Ronaldo’s legacy with dynamic action-inspired artwork on these stylish sneakers.",
    "features": ["Dynamic Print", "CR7 Theme", "Comfort Sole", "Athletic Appeal"],
    "rating": "★★★★☆"
  }
];

export default products;