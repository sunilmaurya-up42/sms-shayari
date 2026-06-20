const mongoose=require("mongoose");



const CommentSchema=new mongoose.Schema({



name:String,


email:String,


comment:String,



approved:{


type:Boolean,


default:false


},



reply:{


type:String,


default:""


}



});


module.exports=mongoose.model("Comment",CommentSchema);
