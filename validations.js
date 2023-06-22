const {body} = require('express-validator')
exports.loginValidation = [
    body('email', 'неверный email').isEmail(),
    body('password').isLength({min: 5}),
]

exports.registerValidation = [
    body('email', 'неверный email').isEmail(),
    body('password').isLength({min: 5}),
    body('fullname').isLength({min: 3}),
]

exports.postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text').isLength({min: 10}).isString(),
]