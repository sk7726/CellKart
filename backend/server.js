const app = require('./app');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary');
const connectDatabase = require('./config/database');

//Handling uncaught Exception --> undefined variable exceptions

process.on("uncaughtException", (err)=>{
    console.log("Error: "+ err.message);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
})

//config
dotenv.config({path: "backend/config/.env"});

//connect DB

connectDatabase();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at: http://localhost:${process.env.PORT}`);
})



//Unhandled Promise Rejection  --> due to wrong connection strings
process.on("unhandledRejection", (err)=>{
    console.log("Error: "+ err.message);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(()=>{
        process.exit(1);
    })
})

