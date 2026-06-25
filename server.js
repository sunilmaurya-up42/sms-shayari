const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const publicRoutes = require("./routes/publicRoutes");
const Shayari = require("./models/Shayari");
const adminRoutes = require("./routes/adminRoutes");

const app = express();



// ===========================
// MongoDB Connection
// ===========================

mongoose.connect(

process.env.MONGO_URI ||

"mongodb://127.0.0.1:27017/sms-shayari"

)

.then(() => {

console.log(

"MongoDB Connected"

);

})

.catch((err) => {

console.log(err);

});




// ===========================
// Body Parser
// ===========================

app.use(

express.urlencoded({

extended: true

})

);

app.use(

express.json()

);




// ===========================
// Session
// ===========================

app.set("trust proxy", 1);

app.use(

session({

secret: "SMS@2001",

resave: false,

saveUninitialized: false,

cookie: {

httpOnly: true,

maxAge: 1000 * 60 * 60 * 24

}

})

);




// ===========================
// View Engine
// ===========================

app.set(

"view engine",

"ejs"

);


app.set(

"views",

path.join(

__dirname,

"views"

)

);




// ===========================
// Static Files
// ===========================

app.use(

express.static(

path.join(

__dirname,

"public"

)

)

);




// ===========================
// Routes
// ===========================

app.use(

"/",

publicRoutes

);


app.use(

"/admin",

adminRoutes

);


// ===========================
// Sitemap.xml
// ===========================

app.get("/sitemap.xml", async (req, res) => {

try{

const shayari = await Shayari.find({
published:true
});

let urls = "";

shayari.forEach(item=>{

urls += `

<url>

<loc>

https://sms-shayari.onrender.com/shayari/${item.slug}

</loc>

<priority>0.8</priority>

</url>

`;

});

const xml = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>

<loc>

https://sms-shayari.onrender.com/

</loc>

<priority>1.0</priority>

</url>

${urls}

</urlset>`;

res.header("Content-Type","application/xml");

res.send(xml);

}

catch(err){

console.log(err);

res.status(500).send("Sitemap Error");

}

});



// ===========================
// 404 Page
// ===========================

app.use(

(req, res) => {

res.status(404)

.send(

"404 Page Not Found"

);

}

);




// ===========================
// Start Server
// ===========================

const PORT =

process.env.PORT ||

3000;


app.listen(

PORT,

() => {

console.log(

`Server running on port ${PORT}`

);

}

);
