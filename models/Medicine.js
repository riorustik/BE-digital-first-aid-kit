// import mongoose from 'mongoose';
const {mongoose, Schema, model} = require('mongoose')

const MedicineSchema = new mongoose.Schema({
    fullname:{type: String, required: true,},
    dosageForm:{type: String, required: true,},
    countryOfOrigin:{type: String},
    releaseForm:{type: String},
    activeSubstance:{type: String},
    pharmacotherapeuticGroup:{type: String},
    pharmacologicalAction:{type: String},
    pharmacokinetics:{type: String},
    indicationsOfTheDrug:{type: String},
    dosageRegimen:{type: String},
    sideAffect:{type: String},
    contraindicationsToUse:{type: String},
    useDuringPregnancyAndLactation:{type: String},
    useImpairedLiverFunction:{type: String},
    useImpairedRenalFunction:{type: String},
    useInChildren:{type: String},
    useInElderlyPatients:{type: String},
    specialInstructions:{type: String},
    overdose:{type: String},
    drugInteraction:{type: String},
    storageConditions:{type: String},
    shelfLife:{type: String},
    termsOfImplementation:{type: String},
}, {
    timestamps: true,
});
module.exports = model('Medicine', MedicineSchema);
// export default mongoose.model('Medicine', MedicineSchema);
