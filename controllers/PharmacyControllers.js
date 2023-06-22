const PharmacyModel = require('../models/Pharmacy.js')
const MedicineModel = require('../models/Medicine.js')

exports.insert = async (req, res) => {
    try {
        const postId = req.params.id;
        const test = req.body.title.toLowerCase();
        const rez = await MedicineModel.findOne({
            fullname: test
        });
        if(rez){
            await PharmacyModel.updateOne({
                    _id: postId,
                },
                {
                    $push:{
                        medicines: {
                            title: test,
                            expiratioDate: req.body.expiratioDate,
                            dosageForm: req.body.dosageForm,
                            medicine: rez._id,
                        },
                    }
                },
            );
        }else {

            const ff = req.body.title.toLowerCase();
            const doc = new MedicineModel({
                fullname: ff,
                dosageForm: req.body.dosageForm,
            });
            const medicine = await doc.save();

            const {...medicineData} = medicine._doc;

            await PharmacyModel.updateOne({
                    _id: postId,
                },
                {
                    $push:{
                        medicines: {
                            title: test,
                            expiratioDate: req.body.expiratioDate,
                            dosageForm: req.body.dosageForm,
                            medicine: medicineData._id,
                        },
                    }
                },
            );
        }

       res.json({
            success: true,
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось добавать препарат в атечку!'
        })
    }
}
exports.update = async (req, res) => {
    try {
        console.log(req.body)
        const postId = req.params.id;
        const test = req.body.title.toLowerCase();

        const rez = await PharmacyModel.findOne({
            _id: postId,
        });
        const doc = rez.medicines.filter(obj => {
            if(obj.title === req.params.title){
                obj.title = test
                obj.expiratioDate = req.body.expiratioDate
                obj.dosageForm = req.body.dosageForm
            }
            return obj
        })
        await PharmacyModel.updateOne({
                _id: req.params.id,
            },
            {
                $unset:{
                    medicines: 1
                }
            },
        );
        await PharmacyModel.updateOne({
                _id: req.params.id,
            },
            {
                $push:{
                    medicines: doc
                }
            },
        );

        res.json({
            success: true,
        })
        // console.log(req.params)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось добавать препарат в атечку!'
        })
    }
}
exports.remove = async (req, res) =>{
    try {
        const rez = await PharmacyModel.findOne({
            _id: req.params.id,
        });
        const doc = rez.medicines.filter(obj => {
            return obj.title != req.params.title
        })

        await PharmacyModel.updateOne({
                _id: req.params.id,
            },
            {
                $unset:{
                    medicines: 1
                }
            },
        );
        await PharmacyModel.updateOne({
                _id: req.params.id,
            },
            {
                $push:{
                    medicines: doc
                }
            },
        );
        const test = await PharmacyModel.findOne({
            _id: req.params.id,
        });
        // console.log(req.params)
        res.json({
            success: true,
        })

    }catch (err){
        // console.log(err)
        res.status(500).json({
            message: 'Не удалось получить данные!'
        })
    }
}
exports.getAll = async (req, res) =>{
    try {
        // res.header("Access-Control-Allow-Origin", "*"); решение проблемы CORS связи с клиентом из инета
        const posts = await PharmacyModel.find().populate('user').exec();

        res.json(posts)
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить данные!'
        })
    }
}
exports.getOne = async (req, res) =>{
    try {

        const rez = await PharmacyModel.findOne({
            _id: req.params.id,
        });
        res.json(rez);

    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить аптечку!'
        })
    }
}
exports.getMedicine = async (req, res) =>{
    try {

        const rez = await PharmacyModel.findOne({
            _id: req.params.id,
        });
        let shel
        const doc = rez.medicines.filter(obj => {
            if(obj.title === req.params.title) {
                shel = Object.assign({}, obj._doc)
            }
        })
        console.log(doc)
        console.log(shel)
        res.json(shel);



    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить аптечку!'
        })
    }
}
// exports.getMedicine = async (req, res) => {
//     try {
//         const rez = await PharmacyModel.findOne({
//             _id: req.params.id,
//         });
//         const doc = rez.medicines.filter(obj => {
//             return obj.title != req.params.title
//         })
//
//         res.json(doc)
//
//     }catch (err){
//         // console.log(err)
//         res.status(500).json({
//             message: 'Не удалось получить статьи!'
//         })
//     }
// }
// export const getLastTags = async (req, res) =>{
//     try {
//         // res.header("Access-Control-Allow-Origin", "*"); решение проблемы CORS связи с клиентом из инета
//         const posts = await PharmacyModel.find().limit(5).exec();
//
//         const tags = posts.map((obj) => obj.tags).flat().slice(0, 5)
//
//         res.json(tags)
//     }catch (err){
//         console.log(err)
//         res.status(500).json({
//             message: 'Не удалось получить статьи!'
//         })
//     }
// }