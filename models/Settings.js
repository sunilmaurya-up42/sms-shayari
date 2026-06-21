const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(

{

    siteName: {

        type: String,

        default: "SMS Shayari"

    },



    siteDescription: {

        type: String,

        default: ""

    },



    logo: {

        type: String,

        default: ""

    },



    phone: {

        type: String,

        default: "8887728576"

    },



    whatsapp: {

        type: String,

        default: "8887728576"

    },



    email: {

        type: String,

        default: "sunilmauryasurila@gmail.com"

    },



    address: {

        type: String,

        default: ""

    },



    analyticsId: {

        type: String,

        default: ""

    },



    adsenseCode: {

        type: String,

        default: ""

    },



    facebookUrl: {

        type: String,

        default: ""

    },



    xUrl: {

        type: String,

        default: ""

    },



    instagramUrl: {

        type: String,

        default: ""

    },



    copyrightText: {

        type: String,

        default: "© SMS Shayari. All Rights Reserved."

    }

},

{

    timestamps: true

}

);


module.exports = mongoose.models.Settings ||

mongoose.model(

"Settings",

settingsSchema

);
