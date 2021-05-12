const adminMiddleware=(req,res,next)=>{
    if(req.isAuthenticated() && req.user.role=='admin')
    next();
    else
    res.redirect('/')
}
module.exports=adminMiddleware;