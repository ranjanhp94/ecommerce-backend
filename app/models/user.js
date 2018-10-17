/*
    username
    email
    password - encrypted password
    token: [{}]
    role:
*/ 

// const { mongoose } = require('../../config/db');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { cartItemSchema } = require('./cart_item');

const userSchema = new Schema({
    username: {
        type: String,
        minlength: 4,
        maxlength: 64,
        unique: true,
        required: true
    },
    email:{
        type: String,
        unique:  true, 
        // validate property is used for defining our own validations
        validate: {
            validator: function (value){
                // return always false to throw a validation error
                    return validator.isEmail(value);
            },
            message: function() {
                return 'invalid email format'
            }
        }
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 128
        },
        tokens: [{
            token: {
                type: String
            }
        }],
        role: {
            type : String,
            require: true,
            enum: ['admin', 'customer'],
            default: 'customer'
        },
        cartItems: [cartItemSchema],
        wishlistItems: [{
            product: { type: Schema.Types.ObjectId },
            createdAt: { type: Date, default: Date.now },
            isPublic: { type: Boolean, default: true }
        }]
    });

    userSchema.pre('save', function(next){
        let user = this;
        bcrypt.genSalt(10).then((salt) => {
            bcrypt.hash(user.password, salt).then((hashed) => {
                user.password = hashed;
                next();
            });
        });
    });

    userSchema.methods.shortInfo = function(){
        return {
            _id: this._id,
            username: this.username,
            email: this.email
        };
    };

    userSchema.statics.findByToken = function(token){
        let User = this;
        let tokenData;
        try {
            tokenData = jwt.verify(token, 'supersecret');
        } catch(e) {
             return Promise.reject(e);
        }
        return User.findOne({
            '_id': tokenData._id,
            'tokens.token': token
        }).then((user) => {
            if(user) {
                return Promise.resolve(user);
            } else {
                return Promise.reject(user);
            }
        })
    };

    userSchema.methods.generateToken = function(next){
        let user = this;
        let tokenData = {
            _id: user.id
        };
        let token = jwt.sign(tokenData, 'supersecret');
        user.tokens.push({
            token
        });

        return user.save().then(() =>{
            return token;
        });
    }

   const User = mongoose.model('User', userSchema);
    
   module.exports = {
       User
   }