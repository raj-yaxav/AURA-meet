import express from "express";

import {createServer} from "node:http" ;
import {Server} from "socket.io"; 
import {userRoutes} from './src/routes/userRoutes.js';
// const userRoutes = require("./src/routes/userRoutes.js")

import mongoose from "mongoose";
 import cors from "cors";
import { connetTosocket } from "./src/controllers/socketIoManager.js";
import { stat } from "node:fs";
// import flash from "connect-flash";


const app = express();
const server = createServer(app);
const io = connetTosocket(server);


app.use(cors());
app.use(express.json({limit : "40kb"}));
app.use(express.urlencoded({limit : "40kb" , extended : true}));


app.set("port" , (process.env.PORT || 8080));
// app.use((req,res,next)=> {
//   res.locals.success = req.flash("success");
//   console.log(message);
// })

app.use("/api/v1/users" , userRoutes);


main().then( () => {
    console.log("database connection succesfull");
}).catch( (err) => {
    console.log("server not working \n" + err);
})


app.use((err , req,res,next) => {
    
    const {statusCode = 500 , message = "server Error"} = err;
    res.status(statusCode).json({"message" : `${message}`});
  
})


async function main(){
    server.listen(app.get("port") , () => {
    console.log("server is listening at port 8080");
})
    const dbUrl = 'mongodb://127.0.0.1:27017/AuraMeet';
    await mongoose.connect(dbUrl);
 
}



