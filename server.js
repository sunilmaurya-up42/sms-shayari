require("dotenv").config();
const express=require("express");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const connectDB=require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
app.use("/admin",adminRoutes);

const Admin = require("./models/Admin");
const bcrypt = require("bcryptjs");
async function seedAdmin() {
  const admin = await Admin.findOne({
    email: process.env.ADMIN_EMAIL
  });
  if (!admin) {
    const hash = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: hash
    });
console.log("Admin created");}
}



const app=express();



connectDB();



app.use(express.urlencoded({extended:true}));



app.use(express.json());



app.use(express.static("public"));



app.set("view engine","ejs");



app.use(session({



secret:process.env.SESSION_SECRET,



resave:false,



saveUninitialized:false,



store:MongoStore.create({



mongoUrl:process.env.MONGO_URI



})



}));




app.get("/",(req,res)=>{



res.send("SMS Shayari Running");



});



const PORT=process.env.PORT||3000;



app.listen(PORT,()=>{



console.log(`Server Running on ${PORT}`);



});
