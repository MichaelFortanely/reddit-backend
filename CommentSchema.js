import mongoose, { mongo, Schema } from "mongoose";

const commentSchema = mongoose.Schema({
    commentID: {
        type: String,
        required: true     
    },
    subreddit: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    body: {
        type: String,
        required: true
    },
    parentPost: {
        type: String,
        default: ""
    },
    children: {
        type: [String],
        default: [],
    }
})

const CommentMessage = mongoose.model('CommentMessage', commentSchema)

export default CommentMessage