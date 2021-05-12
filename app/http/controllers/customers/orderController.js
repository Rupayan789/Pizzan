const Order = require("../../../model/order");
const moment=require('moment')
const orderController=()=>{
    return {
         postOrder:(req,res)=>{
            const { phone ,address } =req.body;
            const order=new Order({
                customer_id:req.user._id,
                items:req.session.cart.items,
                phone,
                address
            });
            order.save().then(data=>{
                req.flash('success','Order placed successfully')
                delete req.session.cart;
                Order.populate(data,{ path: 'customer_id' },(err,order)=>{
                    const eventEmitter=req.app.get('event');
                    eventEmitter.emit('NewOrder',data);
                    res.redirect('/customer/order');
                })
                
            }).catch(error=>{
                req.flash("error","Error in saving cart")
                res.redirect('/cart')
            });
         },
         index:async (req,res)=>{
             const orders=await Order.find({customer_id:req.user._id},null,{ sort : { 'createdAt': -1 }});

             res.render('customers/order',{orders:orders,moment:moment})
         },
         status:async (req,res)=>{
             const order=await Order.findById(req.params.id)
             if(req.user._id.toString() === order.customer_id.toString())
             res.render('customers/status',{order:order});
             else
             res.redirect('/')
         }
    }
}
module.exports=orderController;