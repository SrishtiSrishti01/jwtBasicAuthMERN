import mongoose from 'mongoose'
const {Schema} = mongoose;

const userSchema = new Schema({
    username : {type: String , required : true, unique : true},
    // lastName : String,
    email : {
        type: String,
        unique: true,
       
        required : true
    },
    password : {type: String, required : true},
    
})

export default mongoose.model('User', userSchema)