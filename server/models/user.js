import mongoose from 'mongoose'
const {Schema} = mongoose;

const userSchema = new Schema({
    username : {type: String , required : true, unique : true},
    // lastName : String,
    email : {
        type: String,
        unique: true,
        // validate : {
        //     validator : function (v) {
        //         return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        //     },
        //     message:(props) => `${props.value} is not a valid email`
        // },
        required : true
    },
    password : {type: String, required : true},
    // token : String,
})

export default mongoose.model('User', userSchema)
// exports.User = mongoose.model('User', userSchema)