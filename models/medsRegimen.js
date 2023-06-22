const {mongoose, Schema, model} = require('mongoose')

const medsRegimenSchema = new mongoose.Schema({
    title: {type: String, required: true,},
    singleDose:{type: Number, required: true,},
    dosageForm:{type: String, required: true,},
    regardingFood:{type: String, required: true,},
    numberReceptions: {type: Array, default: [], required: true,}, //время
    reminder:{type: Boolean, required: true,},
    isActive:{type: Boolean, required: true,},
    receptionDays:{type: Array, default: [], required: true,},  //дни недели или все или через денб
    endOfReceptionNumber:{type: Number},// количество дней приема
    endOfReceptionDay:{type: Date},// дата дней приема
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,},
}, {
    timestamps: true,
});


module.exports = model('MedsRegimen', medsRegimenSchema);