const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
// const Task = require('./task') 


const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        trim: true,
        max: 20
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        max: 20
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        max: 20
    },
    email: {
        type: String,
        unique: true, //this is to avoid duplicate emails, if it still happens, call this query in the DB..:  db.users.createIndex({"email" : 1}, { unique: true })
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        },
        
        max: 35,
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        },
        min: 6,
        max: 255,
    },
    // age: {
    //     type: Number,
    //     default: 0,
    //     validate(value) {
    //         if (value < 0) {
    //             throw new Error('Age must be a postive number')
    //         }
    //     }
    // },
    // tokens: [{
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }],
    avatar: {
        type: String
        //type: Buffer
    },
    role: {
        type: String,
        default: 'user'
    }

},{
    timestamps: true
})

// userSchema.virtual('tasks', {
//     ref: 'Task',
//     localField: '_id',
//     foreignField: 'owner'
// })

userSchema.methods.toJSON = function(){ //to makes sure password and token are not exposed 
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    //delete userObject.avatar

    return userObject

}

// userSchema.methods.generateAuthToken = async function(){
//     const user = this
//     const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
//     user.tokens = user.tokens.concat({ token }) // OR {token : token}
//     user.save()
//     return token
    
// }

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email: email})

    if(!user){
        throw new Error('Tento email neexistuje')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Zadej správné heslo')
    }

    return user
}

//hash the plain text password before it is deleted

userSchema.pre('save', async function (next){//Dont use arroe function
    const user = this
    if(user.isModified('password')){ //checks if the password was touched at all, because we may be updating other properties but password, just to avoid overwriting with hashed empty string
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//Delete user tasks when user is deleted
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)



module.exports = User;