const mongoose=require("mongoose");



const ShayariSchema=new mongoose.Schema({



title:String,



content:String,



category:{


type:mongoose.Schema.Types.ObjectId,


ref:"Category"


},



views:{


type:Number,


default:0


},



likes:{


type:Number,


default:0


},



seoTitle:String,



seoDescription:String,



createdAt:{


type:Date,


default:Date.now


}



});



module.exports=mongoose.model("Shayari",ShayariSchema);
