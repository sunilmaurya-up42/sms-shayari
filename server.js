require("dotenv").config();



const express=require("express");


const session=require("express-session");


const MongoStore=require("connect-mongo");


const connectDB=require("./config/db");



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
