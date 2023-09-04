import mongoose from 'mongoose';
import validator from 'validator';
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
 
  email : {
    type: String,
    required: true,
    trim: true,
    lowercase : true,
    unique: true,
    validate(val){
        if(!validator.isEmail(val)){
            throw new Error ('Email is INVALID')
        }
    }
},
tokens: [{type :String}],
password : {
  type: String,
  required: true,
  trim: true,
  minlength: 8,
  validate(value){
      let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
      if(!password.test(value)){
          throw new Error("Password must include uppercase , lowercase , numbers , speacial characters")
      }
  }

},
}, { timestamps: true });

export default mongoose.model('User', userSchema);
