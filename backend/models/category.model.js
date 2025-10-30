
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name : { type : String , required : true , unique : true},
        parent : { type : mongoose.Schema.Types.ObjectId , ref : 'Category' , default : null},
        description : { type : String },
        type : {type : String}
    } , 
    { timestamps : true }
);


module.exports = mongoose.model('Category' , categorySchema);
