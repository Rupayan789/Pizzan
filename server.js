require('dotenv').config();
const express=require('express');

const app=express();
const ejs=require('ejs');
const expressLayouts=require('express-ejs-layouts');
const path=require('path');
const PORT=3000 || process.env.PORT;
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('express-flash');
const MongoDbStore=require('connect-mongo');
//databse connection
// mongoose.connect('mongodb://localhost/pizza',{ useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true})
const uri='mongodb+srv://Rupayan:'+process.env.PASSWORD+'@cluster0.gwnwd.mongodb.net/pizza?retryWrites=true&w=majority'
mongoose.connect(uri,{ useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true})
const connection=mongoose.connection;
connection.once('open',()=>console.log('Database pizza connected')).catch(err=>console.log(err))
//assets
// let MongoStore=new MongoDbStore({
//     mongooseConnection:connection,
//     collection:'sessions'
// })


app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    store:MongoDbStore.create({
        mongoUrl: 'mongodb+srv://Rupayan:papuniku@123@cluster0.gwnwd.mongodb.net/pizza?retryWrites=true&w=majority'
    }),
    saveUninitialized:false,
    cookie: { maxAge: 1000 * 60 * 60 * 24}
}))

app.use(flash());
app.use(express.static(__dirname+'/public'));
app.use(express.json());
//global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session;
    next();
})
app.use(expressLayouts);
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app);


app.listen(PORT,()=>console.log(`Server running ${PORT}`));