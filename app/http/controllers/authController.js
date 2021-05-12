const User = require('../../model/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

const AuthController=()=>{
    return {
        login:(req,res)=>{
            res.render('auth/login');
        },
        postLogin:(req,res,next)=>{
            const {email,password}=req.body;
            
            passport.authenticate('local',(error,user,info)=>{
                if(!email || !password)
                {
                    req.flash('error',"All fields are required");
                    return res.redirect('/login');
                }
                if(error)
                {
                    req.flash('error',info.message)
                    return next(err);
                }
                if(!user)
                {
                    req.flash('error',info.message)
                    return res.redirect('/login')
                }
                req.login(user,(err)=>{
                    if(err)
                    {
                        req.flash('error',info.message)
                        return next(err);
                    }
                    if(user.role==='admin')
                    return res.redirect('/admin/order')
                    else
                    return res.redirect('/');
                })
                

            })(req,res,next)
        },
        register:(req,res)=>{
            res.render('auth/register')
        },
        postRegister:async (req,res)=>{
            const { name , email, password }=req.body;
            //validate request
            if(!name || !email || !password){
                req.flash('error','All fields are required')
                req.flash('name',name);
                req.flash('email',email)
                return res.redirect('/register')
            }
            //Checking for email exists
            User.exists({email:email},(error,result)=>{
                if(result){
                    req.flash('error','Email address not available')
                    req.flash('name',name);
                    req.flash('email',email);
                    return res.redirect('/register')
                }
            })
            //hash Passowrd
            const hashPassword=await bcrypt.hash(password,10);
            //Create a User
            const user=new User({
                name:name,
                email:email,
                password:hashPassword
        })
        user.save().then((user)=>{
            //login
            return res.redirect('/')
        }).catch(err=>{
            req.flash('error','Something went wrong')
            res.redirect('/register')})
            
        },
        logout:(req,res)=>{
            req.logout();
            return res.redirect('/login');
        }
    }
}
module.exports=AuthController;