import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connect from "./database/conn.js";
import morgan from "morgan";
import router from "./router/routes.js";
const port=process.env.PORT||8080;
const app = express();
import 'dotenv/config';

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
  
app.use(cors(
    {
        origin:["https://login-signup-42cm.vercel.app"],
        methods:["GET","POST","PUT","DELETE"],
        credentials:true
    }
));
app.use(morgan("tiny"));
app.disable("x-powered-by");

app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.use("/api",router);

connect()
.then(()=>{
     try{
        console.log("Connecting to Server")
        app.listen(port, () => {
            console.log("Server is running on " + port);
        });
     }
     catch(err){
        console.log("Cannot connect to Server");
     }
})
.catch((err)=>{
    console.log("Invalid database connection");
})  
