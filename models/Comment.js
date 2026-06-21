const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(

{

    postId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Shayari",

        required: true

    },



    name: {

        type: String,

        required: true,

        trim: true

    },



    email: {

        type: String,

        trim: true,

        lowercase: true,

        default: ""

    },



    comment: {

        type: String,

        required: true,

        trim: true

    },



    adminReply: {

        type: String,

        default: ""

    },



    approved: {

        type: Boolean,

        default: false

    }

},

{

    timestamps: true

}

);



module.exports = mongoose.models.Comment ||

mongoose.model(

"Comment",

commentSchema

);
