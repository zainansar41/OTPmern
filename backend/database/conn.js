import mongoose from "mongoose";
const URI = "mongodb://127.0.0.1:27017/LoginWithVerification"

// import {MongoMemoryServer} from 'mongodb-memory-server'
mongoose.set('strictQuery', true);
async function connect(){

    const db = await mongoose.connect(URI)
    console.log(" database Connected ")
    return db
}

export default connect