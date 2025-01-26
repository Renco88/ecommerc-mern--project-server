const {Schema,mongoose} = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name:{
        type:String,
        require:[true, 'user name is require'],
        trim:true,
        maxlength:[31, 'the length of user name can be maximum 31 characters '],
        minimum:[3, 'the length of user name can be minimum 3 characters '],
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        set:(v)=>bcrypt.hashSync(v,bcrypt.genSaltSync(10)),
      
    },
    image:{
        type:String,
        
    },
    address:{
        type:String,
        require:[true,'user address is required'],
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isBanned:{
        type:Boolean,
        default:false
    },
    

},{timestamps:true});

const User = mongoose.model('User',userSchema);
module.exports=User;