const mongoose=require("mongoose");



const SettingsSchema=new mongoose.Schema({



siteName:String,


logo:String,


phone:String,


whatsapp:String,


email:String,


analytics:String



});



module.exports=mongoose.model("Settings",SettingsSchema);
