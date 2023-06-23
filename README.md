# Цифровая аптечка | digital first aid kit (BACKEND)

Проект, реализован в 2023 году на языке **`JavaScript`**

Проект написан с использованием технологии **`Node`** **`Express`** базой данных **`MongoDB`**

Серверная часть проекта включает в себя, модели схем коллекций базы данных, контроллеры, файлы валидации.

Подлючение к базе данных 
```
mongoose
     .connect("mongodb+srv://***@cluster0.bhd86mm.mongodb.net/test?retryWrites=true&w=majority",)
    .then(() => console.log("DB OK!"))
    .catch((err) => console.log("DB ERR", err));
```
Примеры маршрутизации HTTP-запросов
```
  app.post('/auth/login', loginValidation, handleValidationError, UserControllers.login);
  app.post('/auth/register', registerValidation, handleValidationError, UserControllers.registr);
```
Функция создания токена с помощью библиотеки "jsonwebtoken"
```
exports.checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token){
        try {
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id;
            next();
        }catch (err) {
            return res.status(402).json({
                message: 'Данные не верны!!',
            })
        }
    }else{
        return res.status(403).json({
            message: 'нет доступа!',
        })
    }
}
```
Схема коллекции пользователя

>Схема имеет зависимости к другим коллекциям
```
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
```

В контроллерах представлены функции, для работы с каждой из коллекций

Функция регистрации пользователя
>Функция шифрует пароли с помощью библиотеки "bcrypt"
```
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
```

Схема коллекции аптечки пользователя
```
const PharmacySchema = new mongoose.Schema({
    medicines: [
        new mongoose.Schema({
            title: {type: String,},
            expiratioDate:{type: Date,},
            dosageForm:{type: String,},
            medicine: {type: mongoose.Schema.Types.ObjectId, ref: 'Medicine',}
        })
    ],
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,},
}, {
    timestamps: true,
});
```
Функция добавления препарата в аптечку
```
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
```

