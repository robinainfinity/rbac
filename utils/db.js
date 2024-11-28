import mongoose from "mongoose";


const DbCon =async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('MONGDB is connected')
    } catch (error) {
        console.log('MONGDB connection error',error)
        
    }
}
export default DbCon