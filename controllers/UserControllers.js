const UserModel = require('../models/User.js');
const bcrypt = require('bcrypt');
const PharmacyModel = require('../models/Pharmacy.js');
const MedsCards = require('../models/MedsCards.js');
const jwt = require('jsonwebtoken');
const MedsRegimenModel = require("../models/medsRegimen");
const moment = require("moment/moment");
const JSJoda = require("js-joda");

exports.registr =  async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            fullname: req.body.fullname,
            avatarUrl: req.body.avatarUrl,
            phone: req.body.phone,
            age: req.body.age,
            role: 0
        })

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret123',
            {
                expiresIn: '30d'
            });

        const {passwordHash, ...userData} = user._doc;

        const doc_one = new PharmacyModel({
            user: user._id,
        });
        const post = await doc_one.save();

        const doc_two = new MedsCards({
            user: user._id,
        });
        const post_two = await doc_two.save();

        await UserModel.updateOne({
                _id: user._id,
            },
            {
                pharmacy: post._id

            },
        );
        await UserModel.updateOne({
                _id: user._id,
            },
            {
                medscard: post_two._id

            },
        );

        const rez = await UserModel.findOne({
            _id: user._id,
        });

        res.json({
            rez,
            token
        });
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться!'
        })
    }
}
exports.login = async (req, res) =>{
    try{
        const user = await UserModel.findOne({email: req.body.email})
        const role = user.role
        if(!user){
            return res.status(404).json({message:'Пользователь не найден!'})
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass){
            return res.status(400).json({message:'Неверный логин или пароль!'})
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret123',
            {
                expiresIn: '30d'
            });
        const {passwordHash, ...userData} = user._doc;

        const rez = await MedsRegimenModel.find({
            user: user._doc._id
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

        res.json({
            ...userData,
            result: arr,
            token,
            role
        });
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось авторизоваться!'
        })
    }
}
exports.getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user){
            return res.status(404).json({
                message: 'Пользователь не найден!!!!!'
            })
        }
        const {passwordHash, ...userData} = user._doc;

        const rez = await MedsRegimenModel.find({
            user: req.userId,
            isActive: true
        }).sort({createdAt: -1} ).limit(3).exec();
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
console.log(arr)
        res.json({userData, result: arr,});
    }catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить доступ'
        })
    }
}
exports.edit = async (req, res) => {
    try {
        await UserModel.updateOne({
                _id: req.body.id,
            },
            {
                email: req.body.isEmail,
                fullname: req.body.isName,
                phone: req.body.isNumber,
                age: req.body.isAge
            },
        );
        res.json({
            success: true
        })
    }catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить доступ'
        })
    }
}
exports.editPassword = async (req, res) => {
    try {
        const user = await UserModel.findOne({_id: req.body.id})

        if(!user){
            return res.status(404).json({message:'Пользователь не найден!'})
        }
        console.log(req.body.isPassword)
        console.log(user._doc.passwordHash)
        const isValidPass = await bcrypt.compare(req.body.isPassword, user._doc.passwordHash);
        console.log(isValidPass)
        if(!isValidPass){
            return res.status(400).json({message:'Неверный пароль!'})
        }

        const password = req.body.isPasswordNew;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        await UserModel.updateOne({
                _id: req.body.id,
            },
            {
                passwordHash: hash,
            },
        );

        res.json({
            success: true,
        })

    }catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить доступ'
        })
    }
}
