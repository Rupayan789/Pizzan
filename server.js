require('dotenv').config();
const express=require('express');
const passport=require('passport')
const app=express();
const ejs=require('ejs');
const expressLayouts=require('express-ejs-layouts');
const path=require('path');
const PORT=3000 || process.env.PORT;
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('express-flash');
const MongoDbStore=require('connect-mongo');
const Emitter=require('events');
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

//passport config

//Event Emitter
const eventEmitter=new Emitter();
app.set('event',eventEmitter);


app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    store:MongoDbStore.create({
        mongoUrl: 'mongodb+srv://Rupayan:'+process.env.PASSWORD+'@cluster0.gwnwd.mongodb.net/pizza?retryWrites=true&w=majority'
    }),
    saveUninitialized:false,
    cookie: { maxAge: 1000 * 60 * 60 * 24}
}))


const passportInit=require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
app.use(express.static(__dirname+'/public'));
app.use(express.urlencoded({extended:true}))
app.use(express.json());
//global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session;
    res.locals.user=req.user;
    next();
})
app.use(expressLayouts);
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app);


const server=app.listen(PORT,()=>console.log(`Server running ${PORT}`));

const io=require('socket.io')(server);

io.on("connection",socket=>{
    //join
    // console.log(socket.id)
    socket.on('join',(orderid)=>{
        // console.log(orderid)
        socket.join(orderid);
    })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data);
});
eventEmitter.on('NewOrder',data=>{
    io.to('adminRoom').emit('NewOrder',data)
});