const Menu=require('../../model/menu')

function HomeController(){
    //Factory function
    return {
        index : (req,res)=>{
            Menu.find().then((pizzas)=>{
                res.render('home',{pizzas:pizzas})
            })
            
        }
    }
}

module.exports=HomeController;