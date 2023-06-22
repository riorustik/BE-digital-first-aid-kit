const {mongoose, Schema, model} = require('mongoose')

const UserSchema = new mongoose.Schema({
    fullname:{type: String, required: true,
    },
    email:{type: String, required: true, unique: true,
    },
    passwordHash: {type: String, required: true,
    },
    phone: {type: String, required: true,
    },
    age: {type: Number, required: true,
    },
    role: {type: Number, required: true,},
    avatarUrl: String,
    pharmacy: {type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy'},
    medscard: {type: mongoose.Schema.Types.ObjectId, ref: 'MedsCard'},
}, {
    timestamps: true,
});

module.exports = model('User', UserSchema);