const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstname: String,
    lastName : {type:String , default: 'renamedUser'},
    avatar: String,
    email: String,
    bio: String,
});

module.exports = mongoose.model('User',userSchema,'users');