const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userSchemaObject = {
    "email": {
        type: String,
        unique: true,
        required: [true, "Email is required"]
    },
    "password": {
        type: String,
        required: true

    },
    "firstName": {
        type: String,
        required: true

    },
    "lastName": {
        type: String,
        required: false,
        default: "NA"

    },
    "mobileNo": {
        type: String,
        required: true,

        validate: {
            validator: function (value) {
                return /^\d{10}$/.test(value)
            },
            message: props => `${props.value} is not a valid phone number!`
        }

    },
    "gender": {
        type: String,
        required: true,
        enum: ["MALE", "FEMALE", "OTHERS"] // List Of allowed values

    },
    "token":{
        type:String,
        require:false,
        default:""
    },
        role:{
            type:String,
            default:"CUSTOMER",
            enum:["CUSTOMER","SELLER","ADMIN","SUPER_ADMIN"]
        }
    
}
const userSchema = new mongoose.Schema(userSchemaObject,{
    timestamps:true
});

userSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);  //extra layer of security
    const cipherTextPassword = await bcrypt.hash(this.password, salt)
    this.password=cipherTextPassword
})
const UserModel = mongoose.model("users", userSchema)
module.exports = UserModel;