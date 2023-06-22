const ArticlesModel = require("../models/Articles");

exports.create =  async (req, res) => {
    try {

        const doc = new ArticlesModel({
            text: req.body.text,
            title: req.body.title,
            avatarUrl: req.body.avatarUrl,
        })

        const user = await doc.save();

        res.json({
            ses: true
        });
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать статью!'
        })
    }
}
exports.update = async (req, res) => {
    try {
        const postId = req.params.id;

        await ArticlesModel.updateOne({
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
            },
        );

        res.json({
            success: true,
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить статью!'
        })
    }
}
exports.remove = async (req, res) =>{
    try {
        const postId = req.params.id;

        ArticlesModel.findOneAndDelete({
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
exports.getLastPost = async (req, res) =>{
    try {
        // res.header("Access-Control-Allow-Origin", "*"); решение проблемы CORS связи с клиентом из инета
        const posts = await ArticlesModel.find().limit(3).exec();

        res.json(posts)
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи!'
        })
    }
}
exports.getAll = async (req, res) =>{
    try {
        // res.header("Access-Control-Allow-Origin", "*"); решение проблемы CORS связи с клиентом из инета
        const posts = await ArticlesModel.find()
            // .populate('user').exec(); связь с дргой таблицей чтобы обьект был составной

        res.json(posts)
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи!'
        })
    }
}
exports.getOne = async (req, res) =>{
    try {
        const postId = req.params.id;
        const post = await ArticlesModel.findById(postId)
        res.json(post)
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статью!'
        })
    }
}