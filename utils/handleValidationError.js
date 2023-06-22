// import {validationResult} from "express-validator";
const {validationResult} = require('express-validator')
exports.handleValidationError = (req, res, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    next()
};