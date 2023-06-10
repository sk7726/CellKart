const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URI).then((data) =>{
        console.log(`MongoDB connected with sever: ${data.connection.host}`);
    })
}

module.exports=connectDatabase;