const express=require('express');
const app=express();
const ejs=require('ejs');
const expressLayouts=require('express-ejs-layouts');
const path=require('path');
const PORT=3000 || process.env.PORT;

//assets
app.use(express.static(__dirname+'/public'))

app.get('/',(req,res)=>{
    res.render('home')
})
app.use(expressLayouts);
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')
app.listen(PORT,()=>console.log("Server running"));