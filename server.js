const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const publicRoutes = require("./routes/publicRoutes");
const Shayari = require("./models/Shayari");
const Category = require("./models/Category");
const adminRoutes = require("./routes/adminRoutes");
const compression = require("compression");
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
app.use(compression());
app.use(express.urlencoded({extended: true}));
app.use(express.json()

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

app.use( express.static(
path.join(__dirname,"public"),
{maxAge:"7d"}));

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
published: true
});
const categories = await Category.find();

console.log("TOTAL SHAYARI :", shayari.length);
  
let urls = "";

shayari.forEach(item => {

console.log(item.title);
console.log(item.slug);
console.log(item.published);
  
  if(

item.slug &&

/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)

)

  {

urls += `

<url>

<loc>

https://sms-shayari.onrender.com/post/${item.slug}

</loc>

<priority>0.8</priority>

<lastmod>

${new Date(item.updatedAt || item.createdAt)

.toISOString()

.split("T")[0]}

</lastmod>

</url>

`;

}

});

  categories.forEach(cat => {

if(cat.slug){

urls += `

<url>

<loc>

https://sms-shayari.onrender.com/category/${cat.slug}

</loc>

<priority>0.7</priority>

<lastmod>

${new Date().toISOString().split("T")[0]}

</lastmod>

</url>

`;

}

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

//============================
// Feed.xml
//============================

app.get("/feed.xml", async (req,res)=>{

try{

const posts = await Shayari.find({

published:true

})

.sort({

createdAt:-1

})

.limit(20);


let items = "";

posts.forEach(post=>{

items += `

<item>

<title><![CDATA[${post.title}]]></title>

<link>

https://sms-shayari.onrender.com/post/${post.slug}

</link>

<guid>

https://sms-shayari.onrender.com/post/${post.slug}

</guid>

<pubDate>

${new Date(post.createdAt).toUTCString()}

</pubDate>

</item>

`;

});


const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">

<channel>

<title>SMS Shayari</title>

<link>https://sms-shayari.onrender.com</link>

<description>Latest Shayari Updates</description>

${items}

</channel>

</rss>`;

res.header(

"Content-Type",

"application/xml"

);

res.send(xml);

}

catch(err){

console.log(err);

res.send("RSS Error");

}

});

//============================
// News Sitemap.xml
//============================

app.get("/news-sitemap.xml", async (req,res)=>{

try{

const posts = await Shayari.find({

published:true

})

.sort({

createdAt:-1

})

.limit(100);


let urls = "";

posts.forEach(post=>{

urls += `

<url>

<loc>

https://sms-shayari.onrender.com/post/${post.slug}

</loc>

<news:news>

<news:publication>

<news:name>

SMS Shayari

</news:name>

<news:language>

hi

</news:language>

</news:publication>

<news:publication_date>

${new Date(post.createdAt).toISOString()}

</news:publication_date>

<news:title><![CDATA[${post.title}]]></news:title>
</news:news>

</url>

`;

});


const xml = `<?xml version="1.0" encoding="UTF-8"?>

<urlset

xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"

xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">

${urls}

</urlset>`;


res.header(

"Content-Type",

"application/xml"

);

res.send(xml);

}

catch(err){

console.log(err);

res.send("Google News Sitemap Error");

}

});

// ===========================
// Robots.txt
// ===========================

app.get("/robots.txt",(req,res)=>{

res.type("text/plain");

res.send(

`User-agent: *

Allow: /

Sitemap: https://sms-shayari.onrender.com/sitemap.xml

Sitemap: https://sms-shayari.onrender.com/news-sitemap.xml

Feed: https://sms-shayari.onrender.com/feed.xml`

);

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
