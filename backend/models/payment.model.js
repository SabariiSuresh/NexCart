
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        orderId : { type : mongoose.Schema.Types.ObjectId , ref : 'Order' , required : true },
        amount : { type : Number , required : true },
        method : { type : String , required : true },
        status : { type : String , enum : ["Success" , "Paid" , "Pending" , "Failed"] , default : "Pending"},
        transactionId : { type : String , required : true},
        details : { type : Object , default : {}}

    } , { timestamps : true },
);


module.exports = mongoose.model("Payment" , paymentSchema);