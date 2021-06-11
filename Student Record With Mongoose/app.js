const express =  require('express');
const mongoose = require('mongoose');
const bodyParser =  require('body-parser');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const multer = require('multer');


const MongoDb_URI = 'mongodb+srv://iamfaridullah:srwatson33@cluster0.u6woc.mongodb.net/institution?retryWrites=true&w=majority'

const routes = require('./routes/routes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Multer Configuration

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename : (req, file, cb) => {
        cb(null, file.fieldname + '-' + file.originalname)
    }
})

const fileFilter = ( req, file, cb ) => {
   if( file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' ) {
        cb(null, true)
   }else{
        
        cb(null, false)
   }
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(multer({ storage : storage, fileFilter : fileFilter }).single('image'));

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new mongoDbStore({
    uri : MongoDb_URI,
    collection: 'sessions',
})

app.use(session({
    secret : 'my-secret',
    resave : false,
    saveUninitialized: false,
    store: store
}))

app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.path = req.originalUrl;
    next();
})

app.use(routes)
app.use(authRoutes)
app.use('*', (req, res) => {
    res.send('<h1>Page Not Found!</h1>')
})

mongoose.connect(MongoDb_URI)
        .then(
            app.listen(3000, () => {
                console.log('Server listening to requests on port 3000...')
            })
        ).catch((err) => {
            console.log(err);
        })



