import bodyParser from 'body-parser'
import express from 'express'
import subreddits from './subreddits.js'
import cors from 'cors'
import mongoose from 'mongoose'
import 'dotenv/config'
import PostMessage from './Schemas.js'
import { v4 as uuidv4} from 'uuid' 
import PostsRouter from './PostsRouter.js'
import CommentsRouter from './CommentsRouter.js'
import UserRouter from './UserRouter.js'

const app = express()
const PORT = 9001

mongoose.set('strictQuery', false);
// mongoose.connect(MONGO_URL, {useNewURLParser: true, useUnifiedTopology: true})
app.use(cors())

app.use(bodyParser.json())

console.log('process.env.MONGO_URL ' + process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL, {useNewURLParser: true, useUnifiedTopology: true})
.then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
.catch((error) => console.log(error.message))
// mongoose.set('useFindAndModify', false);

app.get('/', (req, res) => res.send('<h1>BOLD SERVER TEXT</h1>'))

app.use('/subs/', subreddits)

app.use('/posts', PostsRouter)
app.use('/users', UserRouter)
app.use('/comments', CommentsRouter)

app.get('posts/:subredditName/:postID', (req, res) => {
    console.log('here')
    const {postID, subredditName} = req.params
    console.log(filteredData)
    let filteredData = data.filter(element => Object.keys(element)[0] === subredditName)
    //trying to actually work with json to manage
    //unstrucred data is a nightmare, I see
    //the necessity of mongodb now
    if(filteredData.length === 1){
        return Object.values(filteredData[0])[0]
    }
    return []

})

//what do I actually need to be communicating to this api?


app.get('/subs/ALL/', (req, res) => {
    async function asyncStuff(){
        try{
            const uniqueSubreddits = await PostMessage.aggregate([
                {
                    $group: {
                        _id: "$subreddit",
                        uniqueSubreddits: { $addToSet: "$subreddit" }
                    }
                }
            ]);
            res.json(uniqueSubreddits);
        } catch(error){
            res.status(500).json({message: error.message})
        }
    }
    asyncStuff();
});


