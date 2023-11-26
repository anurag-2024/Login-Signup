import mongoose from "mongoose";
async function connect(){
    // const mongod =await MongoMemoryServer.create();
    // const getUri=mongod.getUri();
    // const db=await mongoose.connect(getUri);
    mongoose.set('strictQuery',true);
    const db=await mongoose.connect(process.env.REACT_APP_DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    });
    console.log("Database Connected to "+ process.env.REACT_APP_DATABASE_URL);
    return db;
}
export default connect;