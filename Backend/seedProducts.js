import mongoose from "mongoose";
import Product from "./models/product.js";

mongoose.connect("mongodb://localhost:27017/ecommerce")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const products = [
{
id: 1,
title: "Kitchen Bowls",
price: 800,
description: "High quality stainless steel kitchen bowls for daily use.",
image: "/image1.jpg"
},
{
id: 2,
title: "Iron Box",
price: 1000,
description: "Durable electric iron box for smooth ironing.",
image: "/image2.jpg"
},
{
id: 3,
title: "BedSheets",
price: 1500,
description: "Wakefit 100% Cotton Bedsheet Size Fitted with 2 Pillow Covers.",
image: "/image3.jpg"
},
{
id: 4,
title: "HandBag",
price: 500,
description: "Metallic finished office tote handbag.",
image: "/Box4.jpg"
},
{
id: 5,
title: "Pots",
price: 600,
description: "Decorative garden pots with vintage finish.",
image: "/Box5.jpg"
},
{
id: 6,
title: "Laptop",
price: 50000,
description: "HP Chromebook X360 Intel Celeron N4020.",
image: "/Box6.png"
},
{
id: 7,
title: "Womens Dress",
price: 1000,
description: "Claura floral printed midi dress.",
image: "/Box7.png"
},
{
id: 8,
title: "Sunscreen",
price: 300,
description: "Dot & Key Vitamin C+E SPF 50 sunscreen.",
image: "/Box8.png"
}
];

async function seedData() {
await Product.insertMany(products);
console.log("Products inserted");
mongoose.connection.close();
}

seedData();