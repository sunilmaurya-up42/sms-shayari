const mongoose = require("mongoose");

const shayariSchema = new mongoose.Schema(

{

    title: {

        type: String,

        required: true,

        trim: true

    },

    slug: {

type: String,

required: true,

unique: true,

lowercase: true,

trim: true

},


slugHindi: {

type: String,

default: "",

trim: true

},

    content: {

        type: String,

        required: true

    },



    category: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Category",

        required: true

    },



    seoTitle: {

        type: String,

        default: ""

    },



    seoDescription: {

        type: String,

        default: ""

    },



    seoKeywords: {

        type: String,

        default: ""

    },



    views: {

        type: Number,

        default: 0

    },



    likes: {

        type: Number,

        default: 0

    },



    published: {

        type: Boolean,

        default: true

    }

},

{

    timestamps: true

}

);


module.exports = mongoose.models.Shayari ||

mongoose.model(

"Shayari",

shayariSchema

);
