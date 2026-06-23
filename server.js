const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const publicRoutes = require("./routes/publicRoutes");
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
