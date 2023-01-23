import express from 'express'
import PostMessage from './Schemas.js'
const PostsRouter = express.Router()
import { v4 as uuidv4} from 'uuid' 
import UserModel from './UserSchema.js'
import CommentMessage from'./CommentSchema.js'

PostsRouter.get('/ALL', (req, res) => {
    //get all of the posts in the database
    async function asyncStuff(){
        try{
            const posts = await PostMessage.find()
            res.json(posts)
        } catch(error){
            res.status(500).json({message: error.message})
        }
    }
    asyncStuff()
})

PostsRouter.post('/ALL', (req, res) => {
    const {subreddit, title, user, body} = req.body
    const post = new PostMessage({
        postID: uuidv4(),
        subreddit: subreddit,
        title: title,
        user: user,
        body: body
    })
    // console.log(post)
    async function _internal (){
        try{
            const newPost = await post.save()
            res.status(201).json(newPost)
        } catch(error){
            res.status(400)
        }
    }
    _internal()
})

PostsRouter.get('/', (req, res) => {
    res.send('here')
})


PostsRouter.get('/ALL/:subredditName/', (req, res) => {
    // console.log('req.body')
    // console.log(req.params)
    const subreddit = req.params.subredditName
    // console.log(subreddit)
    async function asyncStuff(){
        try{
            const posts = await PostMessage.find({subreddit: subreddit})
            // console.log('got all the posts')
            res.json(posts)
        } catch(error){
            res.status(500).json({message: error.message})
        }
    }
    asyncStuff()
})

PostsRouter.get('/ALL/1/:postID', (req, res) => {
    //get by id
    // console.log('req.postID')
    const postID = req.params.postID
    // console.log(postID)
    async function asyncStuff(){
        try{
            const singlePost = await PostMessage.find({postID: postID})
            // console.log('found the post')
            res.json(singlePost)
            // console.log('printing')
        } catch(error){
            res.status(500).json({message: error.message})
        }
    }
    asyncStuff()
})

// //delete all posts in a subreddit
// PostsRouter.delete('/ALL/', (req, res) => {
//     // console.log('req.body')
//     // console.log(req.params)
//     // console.log(subreddit)
//     async function asyncStuff(){
//         try{
//             const posts = await PostMessage.deleteMany()
//             // console.log('deleted a post')
//             res.json(posts)
//         } catch(error){
//             res.status(500).json({message: error.message})
//         }
//     }
//     asyncStuff()
// })


//this is the API that voteButtons.js makes calls to

PostsRouter.patch('/vote/:postID', async (req, res) => {
    const {postID} = req.params
    const {count, user, isComment} = req.body
    console.log('postID' + postID + "   action " + count + " user " + user + " isComment " + isComment)
    try {
        const anotherUser = await UserModel.findOne({user: user});
        
        // console.log('xdsf\n')
        // console.log(Array.from(anotherUser.disliked_posts).indexOf(postID))
        // console.log(typeof anotherUser.disliked_posts)
        // if(anotherUser.disliked_posts.contains(postID)){
        // console.log('\n\n\n\nxxxxXXdisliked posts contains postID ' + postID)
        // console.log(user.disliked_posts)
        // }
        let inter_like = Array.from(anotherUser.liked_posts).indexOf(postID)
        let inLiked = inter_like !== -1
        let inter_dis = Array.from(anotherUser.disliked_posts).indexOf(postID)
        let inDisliked = inter_dis !== -1

        // let likey = {'liked_posts': anotherUser};
        // let dislikey = {'disliked_posts': anotherUser};
        // if(inLiked){

        //     console.log(likey.splice(inter_like), 1)
        // }

        
        // console.log('1')
        //TODO => need to figure out how to delete item from array
        if(count > 0){
            //TODO remove from the disliked array
            if(inDisliked){
                // console.log('asdjfausda')
                // console.log(anotherUser.disliked_posts)
                anotherUser.disliked_posts.splice(inter_dis, 1)
                
            }
            if(count === 2 || !inDisliked){
                anotherUser.liked_posts.push(postID)
            }
        }
        // console.log('2')
        
        if(count < 0){
            //TODO remove from the liked array
            // anotherUser.liked_posts = inLiked.filter(id => id === postID)
            if(inLiked){
                console.log('jhegj')
                console.log(typeof anotherUser.liked_posts)
                anotherUser.liked_posts.splice(inter_like, 1)
             
            }
            if(count === -2 || !inLiked){
                anotherUser.disliked_posts.push(postID)
            }
        }
        await anotherUser.save()
        // console.log('anotherUser: ' + anotherUser);
        // console.log('\n\n\n\n\n\n\n\n\nXXXXXXXXXXXXXXXXXxx')
        
        //TODO -> the implementation is agnostic to comments or posts so should be applicable to comments later on

        // console.log('SUCCESS CHANGIN VOTES')
        // console.log({ liked_posts: anotherUser.liked_posts, disliked_posts: anotherUser.disliked_posts})
        let post = null
        if(isComment){
            post = await CommentMessage.findOne({commentID: postID})
        } else{
            // console.log('present here')
            post = await PostMessage.findOne({ postID });
        }
        post.upvotes += Number(count);
        // console.log('here')
        // console.log(post)
        await post.save();
        // console.log('save')
        res.status(202).json({ liked_posts: anotherUser.liked_posts, disliked_posts: anotherUser.disliked_posts, upvotes: post.upvotes});
        // console.log('sent res')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

    //TO MAKE A SYSTEM THAT CAN KEEP TRACK OF PAST CLICKS 
    //TO SET THAT TO INITIAL, THEN i will responsd
    //from this method with json message containing both the liked and 
    //disliked arrays for the user
    //this could definitely be easily modified in the future
    //to check for votes by the user on comments also
})

//return search suggestions

PostsRouter.get('/search/:query', async (req, res) => {
    const {query} = req.params;
    try {
        const posts = await PostMessage.find({ 
            $or: [
                { body: { $regex: query, $options: 'i' } },
                { title: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PostsRouter.patch('/ALL/:subredditName', (req, res) => {
//     console.log('req.body')
//     console.log(req.params)
//     const subreddit = req.params.subredditName
//     console.log(subreddit)
//     async function asyncStuff(){
//         try{
//             const posts = await PostMessage.deleteMany({subreddit: subreddit})
//             console.log('deleted a post')
//             res.json(posts)
//         } catch(error){
//             res.status(500).json({message: error.message})
//         }
//     }
//     asyncStuff()
// })

//delete a post in a subreddit

export default PostsRouter
