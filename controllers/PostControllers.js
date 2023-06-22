const PostModel = require('../models/Post.js')

exports.getLastTags = async (req, res) =>{
    try {
        // res.header("Access-Control-Allow-Origin", "*"); решение проблемы CORS связи с клиентом из инета
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts.map((obj) => obj.tags).flat().slice(0, 5)

        res.json(tags)
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
        const posts = await PostModel.find()
        // console.log(posts)
        res.json(posts)
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи!'
        })
    }
}
exports.getLimt = async (req, res) =>{
    try {
        // res.header("Access-Control-Allow-Origin", "*"); решение проблемы CORS связи с клиентом из инета
        const posts = await PostModel.find().limit(3).exec();
        // console.log(posts)
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
        const post = await PostModel.findById(postId)
        res.json(post)
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи!'
        })
    }
}
exports.remove = async (req, res) =>{
    try {
        console.log('111')
        const postId = req.params.id;

        PostModel.findOneAndDelete({
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
exports.create = async (req, res) =>{
    try {
        // console.log(req.body)
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
        });

        const post = await doc.save();

        res.json(post);
    }catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать статью!'
        })
    }
}
exports.update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne({
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