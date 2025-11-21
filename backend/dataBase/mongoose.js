
const mongoose = require('mongoose');
require('dotenv').config();

async function connectDb() {
    
    try{

        await mongoose.connect( process.env.MONGO_URL , {
            dbName : process.env.DB_NAME
        });

        console.log("Mongoose connected");
        
    } catch (err){

        console.error("Error to connect DB" + err.message);

    }

}


module.exports = {connectDb};