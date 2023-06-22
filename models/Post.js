const {mongoose, Schema, model} = require('mongoose')

const PostSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    text:{
        type: String,
        required: true,
    },
    imageUrl: String,
}, {
    timestamps: true,
});

module.exports = model('Post', PostSchema);
