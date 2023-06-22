const CountrysModel = require("../models/Country");

exports.getCountry = async (req, res) =>{
    try {
        const s = []
        const rez = await CountrysModel.find();
        rez.map(obj =>{
            let c = obj.country;
            let x = c.charAt(0).toUpperCase() + c.slice(1);
            s.push(x)
        })
        // const title = req.params.title.toLowerCase();
        // console.log(title)
        // const rez = await CountrysModel.findOne({
        //     country: title,
        // });
        // let x = title.charAt(0).toUpperCase() + title.slice(1);
        // rez.country = x
        // const arr = [];
        // arr.push(rez)
        // console.log(arr)
        // res.json(arr);
        // console.log(s)
        res.json(s);

    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить country!'
        })
    }
}
exports.getOneCountry = async (req, res) =>{
    try {
        const title = req.params.title.toLowerCase();
        console.log(title)
        const rez = await CountrysModel.findOne({
            country: title,
        });
        let x = title.charAt(0).toUpperCase() + title.slice(1);
        rez.country = x
        const arr = [];
        arr.push(rez)
        console.log(arr)
        res.json(arr);

    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить country!'
        })
    }
}