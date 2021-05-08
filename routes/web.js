const HomeController=require('../app/http/controllers/homeController')
const AuthController=require('../app/http/controllers/authController')
const CartController=require('../app/http/controllers/customers/cartController')
function initRoutes(app){
    app.get('/',HomeController().index)
    
    app.get('/cart',CartController().cart)
    
    app.get('/login',AuthController().login)
    
    app.get('/register',AuthController().register)

    app.post('/update-cart',CartController().update)
}

module.exports=initRoutes;