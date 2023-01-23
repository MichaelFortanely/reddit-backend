import mongoose, { mongo, Schema } from "mongoose";

const userSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    account_creation: {
        type: Date,
        default: Date.now
    },
    karma: {
        type: Number,
        default: 0,
    },
    liked_posts: {
        type: [String],
        default: []
    },
    disliked_posts: {
        type: [String],
        default: []
    },
    viewed_posts: {
        type: [String],
        default: []
    }
})

const UserModel = mongoose.model('UserModel', userSchema)

export default UserModel