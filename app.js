const express = require('express')
const session = require('express-session')
require('./db/mongoose')
const path = require('path')




const userRouter = require('./controllers/userController')
const app = express()
var exhbs  = require('express-handlebars');



// app.engine('hbs', exphbs({extname: '.hbs'}));
// app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.engine('hbs',exhbs({
    layouDir: __dirname + '/views/layouts',
    partialsLayout: __dirname + 'views/partials',
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
        isAdmin : (role) => role === 'admin'
    }
}))



app.use(express.json())
app.use(express.urlencoded({extended: true}));

//app.use(express.static('public'));

//app.use(express.static(__dirname + '/public'));
// app.use(express.static(path.join(__dirname, '/public/uploads/avatar')));
app.use(express.static(path.join(__dirname, '/public')))


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: process.env.SESSION_NAME,
    cookie: { 
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 ,
        sameSite: true, //= strict
        secure: process.env.NODE_ENV === 'production' // sets to tru if in production mode
     }
}))







const userRoutes = require('./routes/user');

console.log(process.env.NODE_ENV)


app.get('/', (req,res) => {
    console.log('HOME username', req.session.username)
    console.log('HOME userId', req.session.userId)
    res.render(`home`, {
        title:'Home',
        userId: req.session.userId,
        userRole: req.session.role,
        username: req.session.username,
        isAdmin: req.session.role === 'admin',
    })
})


app.use('/user', userRoutes);




// app.get('/*',function(req,res)
// {
//     res.render('404', {
//         title:'404',
//         userId: req.session.userId,
//         userRole: req.session.role,
//     });
// });



module.exports = app