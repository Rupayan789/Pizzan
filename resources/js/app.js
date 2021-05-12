import axios from 'axios';
import Noty from 'noty';
import moment from 'moment'
import adminbody from './admin';
let addToCart=document.querySelectorAll('.addToCart');
let cardCounter=document.querySelector("#card-counter");

//hamburger animation

const mobileMenu=()=>{
    items.classList.toggle('clicked')
    hamburger.classList.toggle("active");
    
}
const hamburger = document.querySelector(".hamburger");
const items=document.querySelector(".items");
hamburger.addEventListener("click", mobileMenu);
const updateCart=(pizza)=>{
    axios.post('/update-cart',pizza).then(res=>{
        cardCounter.innerText=res.data.totalQty;
        new Noty({
            timeout:1000,
            type:'success',
            text:'Item added to cart',
            progressBar:false
        }).show();
    }).catch(err=>{
        new Noty({
            timeout:1000,
            type:'error',
            text:'Something went wrong',
            progressBar:false
            
        }).show();
    })
}
// for(var i=0;i<addToCart.length;i++)
// {
//     self=addToCart[i];
//     self.addEventListener('click',e=>{
//         e.preventDefault();
//         if(e.target.dataset.pizza)
//     {
//         let pizza=JSON.parse(e.target.dataset.pizza);
//         console.log(pizza)
//         updateCart(pizza);
//     }
//     })
// }
addToCart.forEach(btn=>{
    btn.addEventListener('click',e=>{
        let pizza=JSON.parse(btn.dataset.pizza);
        // console.log(pizza)
        updateCart(pizza);
})})

const alertSuccess=document.querySelector('#success-alert')
if(alertSuccess){
    setTimeout(()=>alertSuccess.remove(),2000)
}

//status of order
var order;
const hiddenInput=document.querySelector('#hiddenInput');
if(hiddenInput)
order=JSON.parse(hiddenInput.value);
// console.log(order)

const allLists=document.querySelectorAll('.status_line');

const updateStatus=(order)=>{
    allLists.forEach(list=>{
        let status=list.dataset.status;
        if(status===order.status)
        {
            const small=document.createElement('small');
            // small.innerText=order.updatedAt;
            // list.appendChild(small);
            list.classList.add('current');
            new Noty({
                timeout:1000,
                type:'success',
                text:'Order Updated',
                progressBar:false
            }).show()
            let temp=list;
            while(temp.nextElementSibling)
            {
                temp=temp.nextElementSibling;
                if(temp.classList.contains('current') || temp.classList.contains('step-completed'))
                {
                    temp.classList.remove('current')
                    temp.classList.remove('step-completed');
                }
            }
            temp=list;
            while(temp.previousElementSibling)
            {
                temp=temp.previousElementSibling;
                if(temp.classList.contains('current'))
                temp.classList.remove('current')
                temp.classList.add('step-completed');
                
            }
        }

    })
}
updateStatus(order)

let socket=io();
if(order)
{
    socket.emit('join',`order_${order._id}`);

}
let adminUrl=window.location.pathname;
if(adminUrl.includes('admin'))
{
    adminbody(socket)
    socket.emit('join','adminRoom')
}

socket.on('orderUpdated',(data)=>{
    var updatedOrder={...order};
    updatedOrder.updatedAt=moment().format('LT');
    updatedOrder.status=data.status;
    // console.log(updatedOrder)
    updateStatus(updatedOrder)
})
//join
