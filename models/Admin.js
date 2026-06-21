const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(

{
    email: {

        type: String,

        required: true,

        unique: true,

        lowercase: true,

        trim: true

    },

    password: {

        type: String,

        required: true

    },

    createdAt: {

        type: Date,

        default: Date.now

    }

},

{

timestamps: true

}

);



module.exports = mongoose.models.Admin ||

mongoose.model(

"Admin",

adminSchema

);
