const sampleProducts = [
  {
    name: "4K Action Camera",
    description:
      "Compact waterproof action camera with image stabilization, dual screens, and 4K recording support.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    buyPrice: 299,
    rentPricePerDay: 18,
    depositAmount: 60,
    stock: 10,
    category: "Electronics"
  },
  {
    name: "Wireless Noise-Cancelling Headphones",
    description:
      "Premium over-ear headphones with adaptive noise cancellation, long battery life, and crystal-clear sound.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    buyPrice: 249,
    rentPricePerDay: 14,
    depositAmount: 50,
    stock: 12,
    category: "Electronics"
  },
  {
    name: "Portable Bluetooth Speaker",
    description:
      "Rugged portable speaker with deep bass, waterproof body, and up to 16 hours of playback.",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80",
    buyPrice: 129,
    rentPricePerDay: 9,
    depositAmount: 25,
    stock: 15,
    category: "Electronics"
  },
  {
    name: "Gaming Laptop",
    description:
      "High-performance laptop with dedicated graphics, 16GB RAM, 1TB SSD, and RGB keyboard for creators and gamers.",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    buyPrice: 1499,
    rentPricePerDay: 55,
    depositAmount: 250,
    stock: 4,
    category: "Computers"
  },
  {
    name: "Ultrabook Pro 14",
    description:
      "Slim aluminum ultrabook with all-day battery life, 14-inch display, and fast SSD storage for hybrid work.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    buyPrice: 1199,
    rentPricePerDay: 42,
    depositAmount: 220,
    stock: 5,
    category: "Computers"
  },
  {
    name: "Mechanical Keyboard",
    description:
      "Hot-swappable mechanical keyboard with tactile switches, per-key RGB lighting, and compact layout.",
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80",
    buyPrice: 159,
    rentPricePerDay: 8,
    depositAmount: 30,
    stock: 14,
    category: "Computers"
  },
  {
    name: "DSLR Camera Kit",
    description:
      "Professional DSLR with 24MP sensor, versatile zoom lens, tripod, and battery pack for studio or travel shoots.",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80",
    buyPrice: 999,
    rentPricePerDay: 42,
    depositAmount: 180,
    stock: 6,
    category: "Photography"
  },
  {
    name: "Mirrorless Creator Camera",
    description:
      "Compact mirrorless camera with 4K video, fast autofocus, and interchangeable lenses for creators on the move.",
    image:
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=900&q=80",
    buyPrice: 1299,
    rentPricePerDay: 48,
    depositAmount: 220,
    stock: 5,
    category: "Photography"
  },
  {
    name: "Drone Aerial Combo",
    description:
      "Foldable drone with stabilized 4K camera, obstacle sensing, and extended flight battery pack.",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=80",
    buyPrice: 899,
    rentPricePerDay: 36,
    depositAmount: 170,
    stock: 7,
    category: "Photography"
  },
  {
    name: "Cordless Power Drill Set",
    description:
      "Professional drill driver kit with battery pack, charger, bits, and carry case for home and workshop use.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80",
    buyPrice: 179,
    rentPricePerDay: 11,
    depositAmount: 35,
    stock: 10,
    category: "Tools"
  },
  {
    name: "Pressure Washer",
    description:
      "Heavy-duty pressure washer ideal for car detailing, patios, and outdoor cleaning jobs.",
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80",
    buyPrice: 349,
    rentPricePerDay: 19,
    depositAmount: 65,
    stock: 8,
    category: "Tools"
  },
  {
    name: "Laser Level Kit",
    description:
      "Precision self-leveling laser with tripod and carrying case for interior layouts and renovation work.",
    image:
      "https://images.unsplash.com/photo-1581092588429-6c4e6762cb53?auto=format&fit=crop&w=900&q=80",
    buyPrice: 139,
    rentPricePerDay: 8,
    depositAmount: 25,
    stock: 11,
    category: "Tools"
  },
  {
    name: "Camping Tent 4-Person",
    description:
      "Weather-resistant camping tent with quick setup poles, ventilation windows, and roomy interior.",
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
    buyPrice: 229,
    rentPricePerDay: 13,
    depositAmount: 40,
    stock: 9,
    category: "Outdoor"
  },
  {
    name: "Mountain Bike",
    description:
      "Trail-ready mountain bike with front suspension, hydraulic disc brakes, and lightweight alloy frame.",
    image:
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=80",
    buyPrice: 799,
    rentPricePerDay: 29,
    depositAmount: 140,
    stock: 6,
    category: "Outdoor"
  },
  {
    name: "Inflatable Kayak",
    description:
      "Portable inflatable kayak set with paddles, pump, and storage bag for lakeside weekend trips.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
    buyPrice: 499,
    rentPricePerDay: 24,
    depositAmount: 90,
    stock: 5,
    category: "Outdoor"
  },
  {
    name: "Projector Home Cinema",
    description:
      "Full HD projector with rich color output, dual speakers, and easy streaming support for movie nights.",
    image:
      "https://images.unsplash.com/photo-1528395874238-34ebe249b3f2?auto=format&fit=crop&w=900&q=80",
    buyPrice: 549,
    rentPricePerDay: 21,
    depositAmount: 100,
    stock: 7,
    category: "Entertainment"
  },
  {
    name: "VR Headset",
    description:
      "Immersive VR headset with motion controllers, precise tracking, and a comfortable extended-wear fit.",
    image:
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=900&q=80",
    buyPrice: 449,
    rentPricePerDay: 20,
    depositAmount: 85,
    stock: 6,
    category: "Entertainment"
  },
  {
    name: "Party Speaker Tower",
    description:
      "High-output party speaker with synchronized lights, wireless mic support, and powerful low-end response.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80",
    buyPrice: 389,
    rentPricePerDay: 18,
    depositAmount: 70,
    stock: 8,
    category: "Entertainment"
  }
];

module.exports = sampleProducts;
