const MedsRegimenModel = require('../models/medsRegimen.js')
const moment= require('moment');
const JSJoda = require('js-joda');
const PharmacyModel = require("../models/Pharmacy");

exports.createCourse = async (req, res) =>{
    try {
        console.log(req.body)
        const postId = req.params.id;
        const test = req.body.title.toLowerCase();

        console.log(req.body.endOfReceptionDay)
        if(req.body.endOfReceptionDay){
            Date(req.body.endOfReceptionDay)
        }
        if(req.body.endOfReceptionNumber){
            Number(req.body.endOfReceptionNumber)
        }

        const doc = new MedsRegimenModel({
            title: test,
            singleDose: Number(req.body.singleDose),
            dosageForm: req.body.dosageForm,
            regardingFood: req.body.regardingFood,
            numberReceptions: req.body.numberReceptions,
            reminder: true,
            isActive: true,
            receptionDays: req.body.receptionDays,
            endOfReception: String(req.body.endOfReception),
            endOfReceptionNumber: req.body.endOfReceptionNumber,
            endOfReceptionDay: req.body.endOfReceptionDay,
            user: postId,
            // medicine: ссылка на препарат
        });

        const medsRegimen = await doc.save();

        res.json(medsRegimen);
    }catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать курс приема!!'
        })
    }
}
exports.update = async (req, res) => {
    try {
        const postId = req.params.id;
        const test = req.body.title.toLowerCase();

        if(req.body.endOfReceptionDay){
            Date(req.body.endOfReceptionDay)
        }
        if(req.body.endOfReceptionNumber){
            Number(req.body.endOfReceptionNumber)
        }

        await MedsRegimenModel.updateOne({
                _id: req.params.id,
            },
            {
                title: test,
                singleDose: Number(req.body.singleDose),
                dosageForm: req.body.dosageForm,
                regardingFood: req.body.regardingFood,
                numberReceptions: req.body.numberReceptions,
                reminder: true,
                isActive: true,
                receptionDays: req.body.receptionDays,
                endOfReception: String(req.body.endOfReception),
                endOfReceptionNumber: req.body.endOfReceptionNumber,
                endOfReceptionDay: req.body.endOfReceptionDay,
            },
        );

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
exports.getOneCourse = async (req, res) => {
    try{
        const rez = await MedsRegimenModel.find({
            _id: req.params.id,
        })
        let shel
        rez.map(obj => {
            shel = Object.assign({}, obj._doc)
        })
        res.json(shel);
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось олучить курс!!'
        })
    }

}
exports.getCourses = async (req, res) => {
    try {

        const rez = await MedsRegimenModel.find({
            user: req.params.id,
        })
        const arr = []
        rez.map(obj => {
            let day;
            if(obj.endOfReceptionNumber){
                day = obj.endOfReceptionNumber
            }else {
                const start = moment(obj.createdAt).format('YYYY-MM-DD')
                const end = moment(obj.endOfReceptionDay).format('YYYY-MM-DD')
                const LocalDate = JSJoda.LocalDate;
                const start_date = new LocalDate.parse(start);
                const end_date = new LocalDate.parse(end);
                day = JSJoda.ChronoUnit.DAYS.between(start_date, end_date);
            }
            const start = moment(obj.createdAt).format('YYYY-MM-DD')
            const end = moment().format('YYYY-MM-DD')
            const LocalDate = JSJoda.LocalDate;
            const start_date = new LocalDate.parse(start);
            const end_date = new LocalDate.parse(end);
            dayPast = JSJoda.ChronoUnit.DAYS.between(start_date, end_date);
            const startDayCou = moment(obj.createdAt).format('DD MMM')
            let endDayCou
            if(obj.endOfReceptionNumber){
                const dateNowDays = moment(obj.createdAt).add(obj.endOfReceptionNumber, "days");
                endDayCou = moment(dateNowDays).format('DD MMM')
            }
            if(obj.endOfReceptionDay){
                endDayCou = moment(obj.endOfReceptionDay).format('DD MMM')
            }
            arr.push({
                ...obj._doc,
                title: obj.title,
                allDay: day,
                dayThePast: dayPast,
                startDay: startDayCou,
                endDay: endDayCou
            })
        })
        res.json(arr);
    }catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать курс приема!!'
        })
    }
}
exports.getLastCourse = async (req, res) =>{
    try {
        const rez = await MedsRegimenModel.find({
            user: req.params.id,
        }).limit(3).exec();
        const arr = []
        rez.map(obj => {
            let day;
            if(obj.endOfReceptionNumber){
               day = obj.endOfReceptionNumber
            }else {
                const start = moment(obj.createdAt).format('YYYY-MM-DD')
                const end = moment(obj.endOfReceptionDay).format('YYYY-MM-DD')
                const LocalDate = JSJoda.LocalDate;
                const start_date = new LocalDate.parse(start);
                const end_date = new LocalDate.parse(end);
                day = JSJoda.ChronoUnit.DAYS.between(start_date, end_date);
            }
            const start = moment(obj.createdAt).format('YYYY-MM-DD')
            const end = moment().format('YYYY-MM-DD')
            const LocalDate = JSJoda.LocalDate;
            const start_date = new LocalDate.parse(start);
            const end_date = new LocalDate.parse(end);
            dayPast = JSJoda.ChronoUnit.DAYS.between(start_date, end_date);
            const startDayCou = moment(obj.createdAt).format('DD MMM')
            const endDayCou = moment(obj.endOfReceptionDay).format('DD MMM')
            arr.push({
                ...obj._doc,
                title: obj.title,
                allDay: day,
                dayThePast: dayPast,
                startDay: startDayCou,
                endDay: endDayCou
            })
        })
        res.json(arr);
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи!'
        })
    }
}
exports.remove = async (req, res) =>{
    try {
        const postId = req.params.id;

        MedsRegimenModel.findOneAndDelete({
                _id: postId,
            },
        ).then(doc => {
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    })
                }
                res.json({
                    success: true
                })
            }
        );
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи!'
        })
    }
}