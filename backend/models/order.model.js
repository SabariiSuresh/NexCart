
const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({

    product : { type : mongoose.Schema.Types.ObjectId , ref : 'Product' , required : true},
    name : { type : String , required : true},
    qty : { type : Number , required : true},
    price : { type : Number , required : true} 

} , { _id : false } );


const orderSchema = new mongoose.Schema({

    user : { type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true , index : true},
    orderItems : { 
        type : [orderItemSchema],
        validate : [(val)=> val.length > 0 , 'Order must have at least one item']
     },
    shippingAddress : { 
        fullName : { type : String , required : true },
        address : { type : String , required : true },
        city : { type : String , required : true },
        state : { type : String , required : true },
        country : { type : String , required : true},
        postalCode : { type : String , required : true },
        phoneNumber : { type : String , required : true },
        alternateNumber : { type : String , required : true },
    },
    paymentMethod : { type : String ,  enum : [ "Card" , "Upi" , "Netbanking" , "COD"] , required : true , default : 'COD' },
    paymentResult : { 
        id : String,
        status : String,
        update_time : String,
        email_address : String
    },
    itemPrice : { type : Number , required : true , default : 0 },
    taxPrice : { type : Number , required : true , default : 0 },
    shippingPrice : { type : Number , required : true , default : 0 },
    deliveryPrice : { type : Number , required : true , default : 0 },
    totalPrice : { type : Number , required : true , default : 0 },
    isDiscountApplied : { type : Boolean , default : 0},
    status : { type : String , enum : [ 'Pending' , 'Shipped' , 'Delivered' , 'Cancelled' , 'Payment Failed' ] , default : 'Pending' , index : true },
    isPaid : { type : Boolean , default : false},
    paidAt : { type : Date},
    isDelivered : { type : Boolean , default : false},
    deliveredAt : { type : Date }

} , { timestamps : true })



module.exports = mongoose.model('Order' , orderSchema);