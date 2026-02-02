const mongoose = require('mongoose');
const Product = require('../models/Product');
const IMAGES = require('../uploads/images');
const FRAME_COLORS = [
  "Black", "Blue", "Grey", "Transparent", "Red",
  "Green", "Brown", "Silver", "Gold"
];
const GLASS_COLORS = ["Grey", "Blue", "Green", "Pink"];
const MATERIALS = ["TR90", "Acetate", "Polycarbonate", "Stainless Steel"];
const WEIGHTS = ["Light", "Average", "Feather Light", "Above Average"];
const COLLECTIONS = ["JJ Tints", "Urban Style", "Premium Line"];
const SUB_COLLECTIONS = ["Athleisure", "Lenskart HUSTLR"];
const COUNTRIES = ["India", "China", "Vietnam"];
const WIDTHS = ["138 mm","140 mm","142 mm","145 mm"];
const GENDERS = ["Unisex"];
const PRESCRIPTION = ["Bifocal / Progressive", "Single Vision"];
const POWERS = ["Supports High Power", "Upto Regular Power"];

mongoose.connect('mongodb://localhost:27017/lenskart');

async function seed() {
  try {
    await Product.deleteMany();

    const products = [];

    Object.keys(IMAGES).forEach(category => {

      // ✅ CASE 1: Sale (ARRAY)
      if (Array.isArray(IMAGES[category])) {
        IMAGES[category].forEach((img, i) => {
          products.push({
            name: `Sale Product ${i + 1}`,
            style: "Modern",
            category: "Sale",
            shape: null,
            type: "Sale",
            ageGroup: null,
            price: 999 + (i * 30),
            stock: 3,
            status: "IN_STOCK",
            image: img
          });
        });
        return; // ⛔ skip normal flow
      }

      const BRANDS = [
  "Vincent Chase",
  "John Jacobs",
  "Lenskart Hustlr",
  "Hooper",
  "Lenskart Studio"
];

const NAME_PARTS = [
  "Pro", "Air", "Flex", "Neo", "Ultra", "Max", "Edge", "Prime", "Elite"
];

const FRAME_TYPES = ["Full Rim", "Half Rim", "Rimless"];

let GLOBAL_INDEX = 0;

      // ✅ CASE 2: Normal categories (OBJECT)
      Object.keys(IMAGES[category]).forEach(subKey => {
        const imageList = IMAGES[category][subKey];

        imageList.forEach((img, i) => {

          let shape = null;
          let type = null;
          let ageGroup = null;

          // 🔥 Mapping logic
          if (category === "Eyeglasses" || category === "Sunglasses") {
            shape = subKey;               // Square, Round, Rectangle, Aviator
          }

          if (category === "Special Power" || category === "Contact Lenses") {
            type = subKey;                // Zero Power, Clear, Color
          }

          if (category === "Kids Glasses") {
            ageGroup = subKey;            // 2-5 Years, 5-8 Years
          }

const idx = GLOBAL_INDEX++;   // ✅ single source index

const brand = BRANDS[idx % BRANDS.length];
const frameType = FRAME_TYPES[idx % FRAME_TYPES.length];
const nameTag = NAME_PARTS[idx % NAME_PARTS.length];

const basePrice =
  category === "Sunglasses" ? 2499 :
  category === "Eyeglasses" ? 1999 :
  category === "Kids Glasses" ? 1299 :
  category === "Contact Lenses" ? 899 :
  1599;

const price = basePrice + Math.floor(Math.random() * 1200);
const rating = Number((4 + Math.random()).toFixed(1));
const reviews = Math.floor(Math.random() * 900 + 20);

const frameColor = FRAME_COLORS[idx % FRAME_COLORS.length];

products.push({

  // UI DATA
  sizes: ["Medium", "Wide"],

  colors: [
    FRAME_COLORS[idx % FRAME_COLORS.length],
    FRAME_COLORS[(idx+1) % FRAME_COLORS.length],
    FRAME_COLORS[(idx+2) % FRAME_COLORS.length]
  ],

  originalPrice: price + Math.floor(Math.random() * 800 + 300),
  discountPercent: Math.floor(Math.random() * 30 + 10),
  tagline: ["Dark Knight 2.0", "Urban Pro", "Air Max", "Neo Flex"][idx % 4],

  // CORE DATA
  name: `${brand} ${shape || type || ageGroup} ${nameTag} ${idx}`,
  brand,
  style: "Modern",
  category,
  shape,
  type,
  ageGroup,
  frameType,

  // FILTERABLE ATTRIBUTES
  glassColor: GLASS_COLORS[idx % GLASS_COLORS.length],
  material: MATERIALS[idx % MATERIALS.length],
  weightGroup: WEIGHTS[idx % WEIGHTS.length],
  collection: COLLECTIONS[idx % COLLECTIONS.length],
  subCollection: SUB_COLLECTIONS[idx % SUB_COLLECTIONS.length],
  country: COUNTRIES[idx % COUNTRIES.length],
  frameWidth: WIDTHS[idx % WIDTHS.length],
  gender: GENDERS[0],
  productType: category === "Sunglasses" ? "Sunglasses" : "Eyeglasses",
  prescriptionType: PRESCRIPTION[idx % PRESCRIPTION.length],
  supportedPowers: POWERS[idx % POWERS.length],

  // COMMERCE
  price,
  rating,
  reviews,
  stock: Math.floor(Math.random() * 10 + 1),
  status: "IN_STOCK",
  image: img
});
        });
      });
    });

    await Product.insertMany(products);

    console.log("✅ Products seeded correctly");
    console.log("Total products:", products.length);
    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}


seed();
