const Order = require("../../../model/order");

const adminController=()=>{
    return {
        adminOrder:(req,res)=>{
            Order.find({ status: {$ne : 'completed'} },null ,{sort:{ 'createdAt':-1}})
            .populate('customer_id','-password').exec((error,orders)=>{
                if(req.xhr)
                {
                    res.json(orders)
                }
                else
                {
                    res.render('admin/admin')
                }
            })
            
        }
    }
}
module.exports=adminController;