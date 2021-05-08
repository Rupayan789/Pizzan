import axios from 'axios';
import Noty from 'noty';
let addToCart=document.querySelectorAll('.addToCart');
let cardCounter=document.querySelector("#card-counter");
const updateCart=(pizza)=>{
    axios.post('/update-cart',pizza).then(res=>{
        console.log(res)
        cardCounter.innerText=res.data.totalQty;
        new Noty({
            timeout:1000,
            type:'success',
            text:'Item added to cart'
            
        }).show();
    }).catch(err=>{
        new Noty({
            timeout:1000,
            type:'error',
            text:'Something went wrong'
            
        }).show();
    })
}

addToCart.forEach(function(btn){
    btn.addEventListener('click',e=>{
    if(e.target.dataset.pizza)
    {
        let pizza=JSON.parse(e.target.dataset.pizza);
        // console.log(pizza)
        updateCart(pizza);
    }
})})


