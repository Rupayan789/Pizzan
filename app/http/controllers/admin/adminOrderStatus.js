const Order = require("../../../model/order")

const adminOrderStatus=()=>{
    return {
        updateStatus:(req,res)=>{
            // console.log(req.body)
            Order.updateOne({_id:req.body.orderId},{status:req.body.status},(err,result)=>{
                
                if(err)
                return res.redirect('/admin/order')
                const eventEmitter=req.app.get('event')
                eventEmitter.emit('orderUpdated',{ id : req.body.orderId,status:req.body.status})
                return res.redirect('/admin/order')
            })
           
        }
    }
}
module.exports=adminOrderStatus;