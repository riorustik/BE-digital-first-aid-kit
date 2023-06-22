const {mongoose, Schema, model} = require('mongoose')

const CountrySchema = new mongoose.Schema({
    country: {type: String},
    yellowFever: {type: String},
    hepatitisA:{type: String},
    rabies:{type: String},
    japaneseEncephalitis: {type: String},
    cholera: {type: String},
    typhoidFever: {type: String},
    meningococcalInfection: {type: String},
    diphtheria: {type: String},
    tetanus: {type: String},
    polio: {type: String},
    malaria:{type: String},
}, {
    timestamps: true,
});

module.exports = model('Country', CountrySchema);