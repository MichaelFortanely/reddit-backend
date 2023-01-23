import express from 'express'
import CommentMessage from './CommentSchema.js'
const CommentsRouter = express.Router()
import { v4 as uuidv4} from 'uuid' 
import PostMessage from './Schemas.js'

CommentsRouter.get('/', async (req, res) => {
    //retrieve comments
        try{
            const posts = await CommentMessage.find()
            res.json(posts)
        } catch(error){
            res.status(500).json({message: error.message})
        }
})


CommentsRouter.get('/by_id/:commentID', async (req, res) => {
    //retrieve comments
        try{
            const comment = await CommentMessage.find({commentID: req.params.commentID})
            res.json(comment)
        } catch(error){
            res.status(500).json({message: error.message})
        }
})

//this wipes every comment
// CommentsRouter.delete('/', async (req, res) => {
//     //retrieve comments
//         try{
//             const posts = await CommentMessage.deleteMany()
//             res.json(posts)
//         } catch(error){
//             res.status(500).json({message: error.message})
//         }
// })

//returns all comment responses to a comment that are its direct descendats and no lower
CommentsRouter.get('/responses/:commentID', async (req, res) => {
    //retrieve comments
    const {commentID} = req.params
    //if isPost is true, then return 
    // console.log('commentID: ' + commentID)
        try{
            const comment = await CommentMessage.find({commentID: commentID})
            let x = []

            for(let i = 0; i < comment[0].children.length; i++){
                try{
                    // console.log('finding ID ' + comment[0].children[i])
                    const nextComment = await CommentMessage.find({commentID: comment[0].children[i]})
                    x.push(nextComment)
                } catch(error){
                    res.status(500).json({message: 'problem converting IDs to conentent'})
                }
            }
            res.status(207).json(x)
        } catch(error){
            res.status(500).json({message: 'Error finding children'})
        }
})




//when adding a new comment, I will either pass along a postID or commmentId
CommentsRouter.post('/:parentID', async (req, res) => {
    //the :parent will be
    const {subreddit, user, body, isPost} = req.body
    //isPost tells whether parentID is a comment or post
    //parentID will be either a commentID or postID
    const parentID = req.params.parentID
    // console.log(subreddit, user, body, isPost, parentID)
    let comment = null
    if(!isPost) {
        comment = new CommentMessage({
            commentID: uuidv4(),
            subreddit: subreddit,
            user: user,
            body: body,
        })
    } else{
        comment = new CommentMessage({
            commentID: uuidv4(),
            subreddit: subreddit,
            user: user,
            body: body,
            parentPost: parentID 
        })
    }
    try{
        await comment.save()
        console.log('Sucessfully saved ' + comment)
    } catch(error){
        res.status(400).json('Unable to create new comment')
    }
    if(isPost){
        //need to add myself as one of the children of the post -> need to add my id to the commentThreads array of strings
        try{
            // console.log('hereree')
            // console.log(parentID)
            const parentPost = await PostMessage.findOne({postID: parentID})
            parentPost.commentThreads.push(comment.commentID)
            await parentPost.save()
            console.log('Success')
            res.status(205).json({message: 'Sucessfully created new comment and IAM child of parent psot',
                parent: parentPost, newComment: comment})
            // console.log({message: 'Sucessfully created new comment and IAM child of parent psot',
            // parent: parentPost, newComment: comment})
        } catch(e) {
            res.status(500).json({message: 'Unable to add new comment with body ' + body + " to commentThreads of post with id " + parentPost.postID})
        }
    } else{
        try{
            const parentComment = await CommentMessage.findOne({commentID: parentID})
            //this will require addinig myself to the children array of strings of postIDs
            parentComment.children.push(comment.commentID)
            await parentComment.save()
            res.status(205).json({message: 'Sucessfully created new comment and added myself to the parents children',
                parent: parentComment, newComment: comment})
        } catch(error){
            res.status(500).json({message: "Could not find parent comment with commentID " + parentID + " for comment with body: " + body})
        }
    }
})



export default CommentsRouter