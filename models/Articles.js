const {mongoose, Schema, model} = require('mongoose')

const ArticlesSchema = new mongoose.Schema({
    title:{type: String, required: true,
    },
    text:{type: String, required: true,
    },
    avatarUrl: String,
}, {
    timestamps: true,
});

module.exports = model('Articles', ArticlesSchema);