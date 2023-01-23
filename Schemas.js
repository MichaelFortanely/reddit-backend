import mongoose, { mongo, Schema } from "mongoose";

const postSchema = mongoose.Schema({
    postID: {
        type: String,
        required: true
    },
    subreddit: {
        type: String,
        required: true
    },
    title: {
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
    commentThreads: {
        type: [String],
        default: []
    }
})

const PostMessage = mongoose.model('PostMessage', postSchema)



export default PostMessage