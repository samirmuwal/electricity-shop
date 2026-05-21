const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://samir:samir357475@cluster0.5d2ioky.mongodb.net/electrick-shop?retryWrites=true&w=majority&appName=Cluster0";
const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    stock: Number,
    category: String,
    image: String,
    brand: String,
    watt: String,
    voltage: String,
    description: String,
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

const products = [
  // BULBS
  { name: "LED Bulb 9W", price: 120, stock: 25, category: "Bulbs", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600", brand: "Philips", watt: "9W", voltage: "220V", description: "Energy saving LED bulb." },
  { name: "LED Bulb 12W", price: 150, stock: 20, category: "Bulbs", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600", brand: "Syska", watt: "12W", voltage: "220V", description: "Bright LED bulb for rooms." },
  { name: "Emergency Bulb", price: 350, stock: 12, category: "Bulbs", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=600", brand: "Wipro", watt: "10W", voltage: "220V", description: "Rechargeable emergency bulb." },
  { name: "Smart LED Bulb", price: 699, stock: 8, category: "Bulbs", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", brand: "Mi", watt: "9W", voltage: "220V", description: "Smart bulb with color control." },
  { name: "Tube Light Bulb", price: 280, stock: 18, category: "Bulbs", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600", brand: "Havells", watt: "20W", voltage: "220V", description: "Long life tube light." },

  // FANS
  { name: "Ceiling Fan", price: 1800, stock: 10, category: "Fans", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600", brand: "Havells", watt: "70W", voltage: "220V", description: "High speed ceiling fan." },
  { name: "Table Fan", price: 1200, stock: 15, category: "Fans", image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600", brand: "Usha", watt: "55W", voltage: "220V", description: "Portable table fan." },
  { name: "Exhaust Fan", price: 950, stock: 9, category: "Fans", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600", brand: "Crompton", watt: "40W", voltage: "220V", description: "Kitchen and bathroom exhaust fan." },
  { name: "Wall Fan", price: 1600, stock: 7, category: "Fans", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600", brand: "Bajaj", watt: "60W", voltage: "220V", description: "Wall mounted fan." },
  { name: "Pedestal Fan", price: 2400, stock: 6, category: "Fans", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600", brand: "Orient", watt: "75W", voltage: "220V", description: "Adjustable pedestal fan." },

  // SWITCHES
  { name: "One Way Switch", price: 40, stock: 50, category: "Switches", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", brand: "Anchor", watt: "N/A", voltage: "220V", description: "Basic one way switch." },
  { name: "Two Way Switch", price: 70, stock: 40, category: "Switches", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", brand: "Havells", watt: "N/A", voltage: "220V", description: "Two way electrical switch." },
  { name: "Bell Switch", price: 60, stock: 30, category: "Switches", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", brand: "GM", watt: "N/A", voltage: "220V", description: "Door bell switch." },
  { name: "Modular Switch", price: 90, stock: 35, category: "Switches", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", brand: "Legrand", watt: "N/A", voltage: "220V", description: "Premium modular switch." },
  { name: "Fan Regulator", price: 180, stock: 22, category: "Switches", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", brand: "Anchor", watt: "N/A", voltage: "220V", description: "Fan speed regulator." },

  // WIRES
  { name: "Copper Wire 1mm", price: 900, stock: 14, category: "Wires", image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600", brand: "Finolex", watt: "N/A", voltage: "220V", description: "Copper wire roll." },
  { name: "Copper Wire 1.5mm", price: 1300, stock: 12, category: "Wires", image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600", brand: "Polycab", watt: "N/A", voltage: "220V", description: "House wiring copper wire." },
  { name: "Copper Wire 2.5mm", price: 1900, stock: 10, category: "Wires", image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600", brand: "Havells", watt: "N/A", voltage: "220V", description: "Heavy duty copper wire." },
  { name: "Flexible Wire", price: 650, stock: 18, category: "Wires", image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600", brand: "RR Kabel", watt: "N/A", voltage: "220V", description: "Flexible wire for appliances." },
  { name: "Earthing Wire", price: 500, stock: 20, category: "Wires", image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600", brand: "Finolex", watt: "N/A", voltage: "220V", description: "Earthing wire." },

  // SOCKETS
  { name: "2 Pin Socket", price: 60, stock: 45, category: "Sockets", image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=600", brand: "Anchor", watt: "N/A", voltage: "220V", description: "2 pin socket." },
  { name: "3 Pin Socket", price: 90, stock: 40, category: "Sockets", image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=600", brand: "GM", watt: "N/A", voltage: "220V", description: "3 pin socket." },
  { name: "Universal Socket", price: 160, stock: 25, category: "Sockets", image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=600", brand: "Havells", watt: "N/A", voltage: "220V", description: "Universal socket." },
  { name: "USB Socket", price: 350, stock: 15, category: "Sockets", image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=600", brand: "Legrand", watt: "N/A", voltage: "220V", description: "Socket with USB port." },
  { name: "Power Socket 16A", price: 220, stock: 20, category: "Sockets", image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=600", brand: "Anchor", watt: "N/A", voltage: "220V", description: "16A heavy power socket." },

  // EXTENSION BOARDS
  { name: "4 Socket Extension Board", price: 450, stock: 15, category: "Extension Boards", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600", brand: "GM", watt: "N/A", voltage: "220V", description: "4 socket extension board." },
  { name: "6 Socket Extension Board", price: 650, stock: 12, category: "Extension Boards", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600", brand: "Havells", watt: "N/A", voltage: "220V", description: "6 socket extension board." },
  { name: "Spike Guard", price: 850, stock: 10, category: "Extension Boards", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600", brand: "Belkin", watt: "N/A", voltage: "220V", description: "Surge protection spike guard." },
  { name: "Extension Cord 5 Meter", price: 550, stock: 18, category: "Extension Boards", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600", brand: "Anchor", watt: "N/A", voltage: "220V", description: "5 meter extension cord." },
  { name: "Extension Cord 10 Meter", price: 900, stock: 8, category: "Extension Boards", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600", brand: "GM", watt: "N/A", voltage: "220V", description: "10 meter extension cord." },

  // MCB
  { name: "MCB 6A", price: 180, stock: 30, category: "MCB", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600", brand: "Schneider", watt: "N/A", voltage: "220V", description: "6A miniature circuit breaker." },
  { name: "MCB 10A", price: 220, stock: 25, category: "MCB", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600", brand: "Havells", watt: "N/A", voltage: "220V", description: "10A circuit breaker." },
  { name: "MCB 16A", price: 280, stock: 20, category: "MCB", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600", brand: "Legrand", watt: "N/A", voltage: "220V", description: "16A circuit breaker." },
  { name: "MCB 32A", price: 420, stock: 12, category: "MCB", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600", brand: "Anchor", watt: "N/A", voltage: "220V", description: "32A heavy circuit breaker." },
  { name: "RCCB", price: 1200, stock: 6, category: "MCB", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600", brand: "Schneider", watt: "N/A", voltage: "220V", description: "Residual current circuit breaker." },

  // LED LIGHTS
  { name: "LED Panel Light", price: 450, stock: 16, category: "LED Lights", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600", brand: "Philips", watt: "12W", voltage: "220V", description: "Panel light for ceiling." },
  { name: "LED Strip Light", price: 550, stock: 14, category: "LED Lights", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", brand: "Wipro", watt: "5M", voltage: "220V", description: "Decorative strip light." },
  { name: "LED Flood Light", price: 950, stock: 10, category: "LED Lights", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600", brand: "Havells", watt: "50W", voltage: "220V", description: "Outdoor flood light." },
  { name: "LED Street Light", price: 1800, stock: 5, category: "LED Lights", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600", brand: "Syska", watt: "60W", voltage: "220V", description: "Street light for outdoor use." },
  { name: "LED Downlight", price: 300, stock: 22, category: "LED Lights", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600", brand: "Philips", watt: "10W", voltage: "220V", description: "Modern downlight." },

  // TOOLS
  { name: "Tester Screwdriver", price: 80, stock: 35, category: "Tools", image: "https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=600", brand: "Taparia", watt: "N/A", voltage: "N/A", description: "Electrical tester screwdriver." },
  { name: "Wire Cutter", price: 220, stock: 18, category: "Tools", image: "https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=600", brand: "Stanley", watt: "N/A", voltage: "N/A", description: "Wire cutting tool." },
  { name: "Insulation Tape", price: 30, stock: 60, category: "Tools", image: "https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=600", brand: "3M", watt: "N/A", voltage: "N/A", description: "Electrical insulation tape." },
  { name: "Digital Multimeter", price: 650, stock: 8, category: "Tools", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600", brand: "Meco", watt: "N/A", voltage: "N/A", description: "Voltage and current tester." },
  { name: "Screwdriver Set", price: 350, stock: 12, category: "Tools", image: "https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=600", brand: "Taparia", watt: "N/A", voltage: "N/A", description: "Screwdriver set for electricians." },

  // APPLIANCES
  { name: "Electric Iron", price: 850, stock: 10, category: "Appliances", image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600", brand: "Bajaj", watt: "1000W", voltage: "220V", description: "Dry electric iron." },
  { name: "Water Heater Rod", price: 450, stock: 18, category: "Appliances", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600", brand: "Usha", watt: "1500W", voltage: "220V", description: "Water heating rod." },
  { name: "Room Heater", price: 1600, stock: 7, category: "Appliances", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600", brand: "Orpat", watt: "2000W", voltage: "220V", description: "Electric room heater." },
  { name: "Electric Kettle", price: 999, stock: 11, category: "Appliances", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600", brand: "Prestige", watt: "1500W", voltage: "220V", description: "Fast boiling electric kettle." },
  { name: "Mixer Grinder", price: 2400, stock: 6, category: "Appliances", image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600", brand: "Philips", watt: "750W", voltage: "220V", description: "Kitchen mixer grinder." },
];

async function seedProducts() {
  try {
   await mongoose.connect(MONGODB_URI);

console.log("MongoDB Connected");

await Product.deleteMany();
await Product.insertMany(products);


    console.log("Products added successfully");

    process.exit();
  } catch (error) {
    console.log("Seed Error:", error);
    process.exit(1);
  }
}

seedProducts();