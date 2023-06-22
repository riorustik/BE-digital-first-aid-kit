
const {mongoose, Schema, model} = require('mongoose')

const PharmacySchema = new mongoose.Schema({
    medicines: [
        new mongoose.Schema({
            title: {type: String,},
            expiratioDate:{type: Date,},
            dosageForm:{type: String,},
            medicine: {type: mongoose.Schema.Types.ObjectId, ref: 'Medicine',}
        })
    ],
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,},
}, {
    timestamps: true,
});


module.exports = model('Pharmacy', PharmacySchema);