const HomeController=require('../app/http/controllers/homeController')
const AuthController=require('../app/http/controllers/authController')
const CartController=require('../app/http/controllers/customers/cartController')
const Guest=require('../app/http/middlewares/guest')
const orderController = require('../app/http/controllers/customers/orderController')
const Auth = require('../app/http/middlewares/auth')
const adminController = require('../app/http/controllers/admin/admin.contoller')
const adminMiddleware = require('../app/http/middlewares/admin')
const adminOrderStatus = require('../app/http/controllers/admin/adminOrderStatus')
function initRoutes(app){
    app.get('/',HomeController().index)
    
    app.get('/cart',CartController().cart)
    
    app.get('/login',Guest,AuthController().login)
    
    app.get('/register',Guest,AuthController().register)

    app.get('/customer/order',Auth, orderController().index)

    app.get('/admin/order',adminMiddleware,adminController().adminOrder)
    
    app.post('/admin/order/status',adminMiddleware,adminOrderStatus().updateStatus)

    app.post('/register',AuthController().postRegister)

    app.post('/login',AuthController().postLogin)

    app.post('/update-cart',CartController().update)

    app.post('/logout',AuthController().logout)

    app.post('/order',Auth,orderController().postOrder)

    app.get('/customer/order/:id',Auth,orderController().status)

}
module.exports=initRoutes;