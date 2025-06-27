import mongoose from "mongoose";

const blogSchma = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    author: {
        type: String,
    },
    trash: {
        type: Boolean,
        default: false
    }
},{
    
})