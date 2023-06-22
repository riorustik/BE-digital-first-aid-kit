const express = require('express')
const {mongoose} = require('mongoose')
const cors = require('cors')
const {registerValidation} = require('./validations.js')
const {loginValidation} = require('./validations.js')
const {postCreateValidation} = require('./validations.js')
const {handleValidationError} = require('./utils/handleValidationError.js')
const {checkAuth} = require('./utils/checkAuth.js')
const PharmacyControllers = require('./controllers/PharmacyControllers')
const UserControllers = require('./controllers/UserControllers')
const MedicineControllers = require('./controllers/MedicineControllers.js')
const MedsRegimenControllers = require('./controllers/MedsRegimenControllers.js')
const ArticlesControllers = require('./controllers/ArticlesControllers')
const CountryControllers = require('./controllers/CountryControllers')
const PostController = require("./controllers/PostControllers");


const app = express();
app.use(express.json());
mongoose
     .connect("mongodb+srv://rustamavatar:z85YqqmxxKtH2i30@cluster0.bhd86mm.mongodb.net/test?retryWrites=true&w=majority",)
    .then(() => console.log("DB OK!"))
    .catch((err) => console.log("DB ERR", err));
app.use(cors());

//user
//логинн
app.post('/auth/login', loginValidation, handleValidationError, UserControllers.login);
//реистрация
app.post('/auth/register', registerValidation, handleValidationError, UserControllers.registr);
//получение данных о пользователе
app.get('/auth/me', checkAuth, UserControllers.getMe);
//редактивароине данных
app.post('/settings-edit', checkAuth, UserControllers.edit)
//редактивароине пароля
app.post('/settings-password', checkAuth, UserControllers.editPassword)


//аптечка
//добавлене препарата в базу данных (не для пользователя)
app.get('/add-medicine', MedicineControllers.create);
//получение аптечки пользователя
app.get('/add-medicine/:id', PharmacyControllers.getOne);
//добавление нового препарата в аптечку
app.patch('/add-medicine/:id', PharmacyControllers.insert); //postCreateValidation
//обновение данных препарата
app.post('/add-medicine/:id/:title', checkAuth, handleValidationError, PharmacyControllers.update); //postCreateValidation
//запрос на данные препарата для изменения
app.get('/medicine-info/:id/:title', checkAuth, handleValidationError, PharmacyControllers.getMedicine); //postCreateValidation
//просмотр инстуркици препарата
app.post('/receive/:title', MedicineControllers.receive);
//удаление препарата из аптечки
app.delete('/add-medicine/:id/:title', checkAuth, PharmacyControllers.remove);
//все аптечки для админа переделать путь
// app.get('/posts', PharmacyControllers.getAll);

// курсы приема
app.post('/add-course/:id/:title', checkAuth, handleValidationError, MedsRegimenControllers.update);
// создать курс приема
app.patch('/add-course/:id', checkAuth, handleValidationError, MedsRegimenControllers.createCourse);
// просмотр курсов пользователя
app.get('/courses/:id', checkAuth, handleValidationError, MedsRegimenControllers.getCourses);
//получение данных о курсе длля редактирования course-info
app.get('/test/:id', checkAuth, handleValidationError, MedsRegimenControllers.getOneCourse);
// просмотр курсов пользователя
// app.get('/last-courses/:id', checkAuth, handleValidationError, MedsRegimenControllers.getLastCourse);
//удаление препарата из аптечки
app.delete('/course/:id', checkAuth, MedsRegimenControllers.remove);

//статьи
//создание статьи админом
app.get('/articles-create', handleValidationError, ArticlesControllers.create);
app.get('/posts', PostController.getLimt);
app.get('/posts-admin', PostController.getAll);
// app.get('/tags', PostController.getLastTags);
// app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', postCreateValidation, PostController.getOne);
app.post('/posts',  PostController.create);//handleValidationError
app.delete('/posts/:id', PostController.remove);
app.patch('/posts/:id', checkAuth, handleValidationError, PostController.update);

//страны
//получение страны с прививками по названию страны
app.get('/country/:title', handleValidationError, CountryControllers.getOneCountry);
app.get('/country', handleValidationError, CountryControllers.getCountry);


app.listen(4444, (err) =>{
    if(err){
        return console.log(err)
    }
    console.log("server ok");
})
