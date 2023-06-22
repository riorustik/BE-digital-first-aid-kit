const MedicineModel = require('../models/Medicine.js')

exports.create = async (req, res) =>{
    try {
        //обработка со сторонней базой данных для заполнения полей преарпата ???
        const ff = req.body.fullname.toLowerCase();
        const doc = new MedicineModel({
            fullname: ff,
            dosageForm: req.body.dosageForm,
        });
        const medicine = await doc.save();
        res.json(medicine);
    }catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать ячейку прерапата!!'
        })
    }
}
exports.receive = async (req, res) =>{
    try {
        const fullname = req.params.title

        const rez = await MedicineModel.findOne({
            fullname: fullname,
        });
        // console.log(rez)
        if(rez){
            return res.json(rez);
        }
        // console.log(fullname)
        res.json(fullname);

    }catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать ячейку прерапата!!'
        })
    }
}